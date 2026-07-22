import { useState, useEffect } from "react"
import Spinner from "../../components/spinner/Spinner"
import ErrorAlert from "../../components/errorAlert/ErrorAlert"
import { useParams } from "react-router-dom"
import { useAuth } from "../../context/auth/AuthContext"
import { getCourseForLearning } from "../../services/courses.service"
import { completeLesson, getMyProgress } from "../../services/progress.service"

const CourseLearn = () => {
  const { id } = useParams()
  const { token } = useAuth()

  const [course, setCourse] = useState(null)
  const [completedLessons, setCompletedLessons] = useState([])
  const [activeLesson, setActiveLesson] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedModuleId, setExpandedModuleId] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [completing, setCompleting] = useState(false)

  useEffect(() => {
    const fetchData = async() => {
      try {
        const courseData = await getCourseForLearning(id, token)
        
        setCourse(courseData.course)

        const progressData = await getMyProgress(token)
        const myProgress =  progressData.allProgress.find((p) => p.course?._id === id)

        if(myProgress){
          setCompletedLessons(myProgress.completedLessons)
        }

        if(courseData.course.modules[0]?.lessons[0]){
          setActiveLesson(courseData.course.modules[0].lessons[0])
        }
      } catch (e) {
        setError(e.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  },[id])

  const toggleModuleExpanded = (moduleId) => {
    setExpandedModuleId(expandedModuleId === moduleId ? null : moduleId)
  }

  const getYouTubeEmbedUrl = (url) => {
    if(!url) return
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)
    return match ? `https://www.youtube.com/embed/${match[1]}` : null
  }

  const handleCompleteLesson = async() => {
    setCompleting(true)
    setError('')

    try {
      await completeLesson(id, activeLesson._id, token)
      setCompletedLessons([...completedLessons, activeLesson._id])
    } catch (e) {
      setError(e.message)
    } finally {
      setCompleting(false)
    }
  }

  if(isLoading){
    return <Spinner />
  }

  if(!course){
    return <ErrorAlert message={error || 'Corso non trovato'} />
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden mb-4 flex items-center gap-2 bg-surface shadow px-4 py-2 rounded-lg text-primary-dark font-semibold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          Contenuto del corso
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          <div className={`md:w-80 bg-surface rounded-lg shadow p-4 h-fit md:block ${sidebarOpen ? 'block' : 'hidden'}`}>
            <h2 className="font-bold text-primary-dark mb-4">{course.name}</h2>
            
            {course.modules.map((module) => (
              <div key={module._id} className="mb-4">
                <button
                  onClick={() => toggleModuleExpanded(module._id)}
                  className="w-full flex justify-between items-center text-left font-semibold text-sm text-gray-500 py-2"
                >
                  {module.name}
                    <span className={`transform transition-transform ${expandedModuleId === module._id ? 'rotate-180' : ''}`}>
                        ▼
                    </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                      expandedModuleId === module._id ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <ul className="flex flex-col gap-1 pb-2">
                    {module.lessons.map((lesson) => (
                      <li key={lesson._id}>
                        <button
                          onClick={() => {
                              setActiveLesson(lesson)
                              setSidebarOpen(false)
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                            activeLesson?._id === lesson._id ? 'bg-primary text-white' : 'hover:bg-background text-primary-dark'
                          }`}
                        >
                          {completedLessons.includes(lesson._id) ? '✓' : '○'} {lesson.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex-1 bg-surface rounded-lg shadow p-6">
            {activeLesson ? (
              <>
                <h1 className="text-xl font-bold text-primary-dark mb-4">{activeLesson.name}</h1>
                <div className="aspect-video mb-4 bg-black rounded-lg overflow-hidden">
                  {!activeLesson.linkVideo ? (
                    <p className="text-gray-400 text-sm">Video non ancora disponibile per questa lezione</p>
                  ) : (
                    getYouTubeEmbedUrl(activeLesson.linkVideo) ? (
                      <iframe 
                        src={getYouTubeEmbedUrl(activeLesson.linkVideo)} 
                        title={activeLesson.name}
                        allowFullScreen
                        className="w-full h-full"
                      />
                    ) : (
                      <video 
                        key={activeLesson._id}  
                        src={activeLesson.linkVideo}
                        controls
                        className="w-full h-full"
                      /> 
                    )
                  )}
                </div>

                <p className="text-gray-600">{activeLesson.description}</p>
                <div className="mt-4">
                  {completedLessons.includes(activeLesson._id) ? (
                    <span className="inline-flex items-center gap-2 text-green-600 font-semibold">
                      ✓ Lezione completata
                    </span>
                  ) : (
                    <button
                      onClick={handleCompleteLesson}
                      disabled={completing}
                      className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50"
                    >
                      {completing ? 'Salvataggio...' : 'Segna come completata'}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <p className="text-gray-500">Seleziona una lezione per iniziare</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseLearn
