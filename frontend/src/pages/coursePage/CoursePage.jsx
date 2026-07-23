import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { getCourseWithContent } from "../../services/courses.service"
import { useAuth } from "../../context/auth/AuthContext"
import { enrollInCourse, getMyProgress } from "../../services/progress.service"
import Spinner from "../../components/spinner/Spinner"
import ErrorAlert from "../../components/errorAlert/ErrorAlert"
import { BookOpen } from 'lucide-react'

const CoursePage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { token, user } = useAuth()
  const [course, setCourse] = useState(null)
  const [isloading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [openModuleId, setOpenModuleId] = useState(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [enrolling, setEnrolling] = useState(false)
  const [enrolledCount, setEnrolledCount] = useState(0)
  
  const toggleModule = (moduleId) => {
    setOpenModuleId(moduleId === openModuleId ? null : moduleId)
  }

  const handleEnroll = async() => {
    if(!token){
      navigate('/auth')
      return
    }

    setEnrolling(true)
    setError('')

    try {
      await enrollInCourse(id, token)
      setIsEnrolled(true)
    } catch (e) {
      setError(e.message)
    } finally {
      setEnrolling(false)
    }
  }

  useEffect(() => {
    const getCourseContent = async() => {
      try {
        const data = await getCourseWithContent(id)
        setCourse(data.course)
        setEnrolledCount(data.enrolledCount)
      } catch (e) {
        setError(e.message)
      } finally {
        setIsLoading(false)
      }
    }

    getCourseContent()
  },[id])

  useEffect(() => {
    const checkEnrollment = async() => {
      if(!token || user?.role !== 'student') return

      try {
        const data = await getMyProgress(token)
        const enrolled = data.allProgress.some((p) => p.course._id === id)
        setIsEnrolled(enrolled)
      } catch (e) {
        setError(e.message)
      }
    }

    checkEnrollment()
  }, [id, token, user])

  if(isloading){
    return <Spinner />
  }

  if(!course){
    return <ErrorAlert message={error || 'Corso non trovato'}/>
  }

  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/search" className="text-sm text-primary hover:underline mb-4 inline-block">
          ← Torna ai corsi
        </Link>
        <img 
          src={course.urlImg} 
          alt={course.name}
          className="w-full h-64 object-cover rounded-lg mb-5" 
        />
        <h1 className="text-3xl font-bold text-primary-dark mb-2">{course.name}</h1>

        <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-2">
          {course.category}
        </span>

        <p className="text-sm text-gray-500 mb-4">
          {course.modules.length} moduli · {totalLessons} lezioni · {enrolledCount} student{enrolledCount === 1 ? 'e' : 'i'} iscritt{enrolledCount === 1 ? 'o' : 'i'}
        </p>

        <div className="mt-6 mb-6 bg-surface shadow rounded-lg p-5">
          <h2 className="text-lg font-bold text-primary-dark mb-2 flex items-center gap-2">
            <BookOpen className="w-5 h-5"/>
            Descrizione del corso
          </h2>
          <p className="text-gray-600 mb-4">{course.description}</p>
        </div>
        
        
        {course.teacher && (
          <div className="bg-surface shadow rounded-lg p-5 mb-6 flex items-center gap-2 w-fit">
            <p className="text-sm text-gray-500">
              Instructor: <span className="font-semibold text-primary-dark">{course.teacher.firstName} {course.teacher.lastName}</span>
            </p>
          </div>
        )}

        
        
        <div className="mt-8 relative">
          <h2 className="text-xl font-bold text-primary-dark mb-4">Contenuto del corso</h2>

          <div className="bg-surface rounded-lg shadow divide-y">
            {course.modules.map((module) => (
              <div 
                key={module._id}
                className=""
              >
                <button
                  onClick={() => toggleModule(module._id)}
                  className="w-full flex justify-between items-center px-4 py-3 font-semibold text-primary-dark text-left"
                >
                  {module.name}
                  <span className={`transform transition-transform ${openModuleId === module._id ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openModuleId === module._id ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <ul>
                    {module.lessons.map((lesson) => (
                      <li
                        key={lesson._id}
                        className="px-6 py-2 text-gray-600 text-sm"
                      >
                        {lesson.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="sticky bottom-4 mt-4 flex justify-center">
            {user?.role === 'teacher' ? null : isEnrolled ? (
              <button
                onClick={() => navigate(`/courses/${id}/learn`)}
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark shadow-lg"
              >
                Vai al corso
              </button>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50 shadow-lg"
              >
                {enrolling ? 'Iscrizione in corso...' : 'Iscriviti'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoursePage
