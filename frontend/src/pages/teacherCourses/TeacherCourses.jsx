import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/auth/AuthContext"
import { getMyCourses } from "../../services/courses.service"
import Spinner from "../../components/spinner/Spinner"
import ErrorAlert from "../../components/errorAlert/ErrorAlert"
import { BookOpen, Users, FileText } from "lucide-react"

const TeacherCourses = () => {
  const { token, user } = useAuth()
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  
  const getGreetings = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Buongiorno'
    if (hour < 18) return 'Buon pomeriggio'
    return 'Buonasera'
  }
  useEffect(() => {
    const fetchCourses = async() => {
      try {
        const data = await getMyCourses(token)
        setCourses(data.courses)
      } catch (e) {
        setError(e.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [])

  if(isLoading){
    return <Spinner />
  }

  const totalStudents = courses.reduce((sum, c) => sum + c.enrolledCount, 0)
  const totalLessons = courses.reduce(
    (sum, c) => sum + c.modules.reduce((s, m) => s + m.lessons.length, 0),
    0
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link to="/" className="text-sm text-primary hover:underline mb-4 inline-block">
          ← Torna alla homepage
        </Link>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary-dark">
            {getGreetings()}, {user?.firstName}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Ecco un riepilogo della tua attività didattica
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-surface rounded-lg shadow p-4 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <p className="text-2xl font-bold text-primary">{courses.length}</p>
            <p className="text-sm text-gray-500">Corsi creati</p>
          </div>

          <div className="bg-surface rounded-lg shadow p-4 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <p className="text-2xl font-bold text-primary">{totalStudents}</p>
            <p className="text-sm text-gray-500">Studenti totali</p>
          </div>

          <div className="bg-surface rounded-lg shadow p-4 flex flex-col items-center text-center col-span-2 md:col-span-1">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <p className="text-2xl font-bold text-primary">{totalLessons}</p>
            <p className="text-sm text-gray-500">Lezioni create</p>
          </div>
      </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-primary-dark">I miei corsi</h1>
          <Link
            to="/teacher/courses/new"
            className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark"
          >
            + Crea nuovo corso
          </Link>
        </div>

        <ErrorAlert message={error} />

        {courses.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Non hai ancora creato nessun corso.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {courses.map((course) => (
              <Link
                key={course._id}
                to={`/teacher/courses/${course._id}/edit`}
                className="bg-surface rounded-lg shadow p-4 hover:shadow-lg transition block"
              >
                <img
                  src={course.urlImg}
                  alt={course.name}
                  className="w-full h-32 object-cover rounded mb-2"
                />
                <p className="font-semibold text-primary-dark">{course.name}</p>
                <p className="text-sm text-gray-500">{course.category}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {course.enrolledCount} student{course.enrolledCount === 1 ? 'e' : 'i'} iscritt{course.enrolledCount === 1 ? 'o' : 'i'}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TeacherCourses
