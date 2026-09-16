import { useState, useEffect } from "react"
import Spinner from "../../components/spinner/Spinner"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/auth/AuthContext"
import { getCourseForLearning } from "../../services/courses.service"
import { completeLesson, getMyProgress, unenrollFromCourse } from "../../services/progress.service"
import { useToast } from "../../context/toast/ToastContext"
import { Trophy } from 'lucide-react'
import usePageTitle from "../../hooks/usePageTitle"

const CourseLearn = () => {
  const { id } = useParams()
  const { token } = useAuth()
  const { showToast } = useToast()

  const [course, setCourse] = useState(null)
  const [completedLessons, setCompletedLessons] = useState([])
  const [activeLesson, setActiveLesson] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [expandedModuleId, setExpandedModuleId] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [completing, setCompleting] = useState(false)
  const [confirmUnenroll, setConfirmUnenroll] = useState(false)
  const navigate = useNavigate()

  usePageTitle('Corso')

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
        showToast(e.message, 'error')
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

    try {
      await completeLesson(id, activeLesson._id, token)
      const newCompletedLessons = [...completedLessons, activeLesson._id]
      setCompletedLessons([...completedLessons, activeLesson._id])

      if (newCompletedLessons.length === totalLessons) {
        showToast('Complimenti, hai completato il corso! 🎉')
      } else {
        showToast('Lezione completata!')
      }
      
    } catch (e) {
      showToast(e.message, 'error')
    } finally {
      setCompleting(false)
    }
  }

  const handleUnenroll = async () => {
    try {
      await unenrollFromCourse(id, token)
      showToast('Ti sei disiscritto dal corso')
      navigate('/dashboard')
    } catch (e) {
      showToast(e.message, 'error')
    }
  }

  if(isLoading){
    return <Spinner />
  }

  if(!course){
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-gray-500">Corso non trovato</p>
      </div>
    )
  }

  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0)
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link to="/dashboard" className="text-sm text-primary hover:underline mb-4 inline-block">
          ← Torna alla dashboard
        </Link>
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

            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progresso</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            
            {progressPercent === 100 && (
              <div className="mt-3 mb-3 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-green-600" />
                <p className="text-sm text-green-700 font-medium">Corso completato! 🎉</p>
              </div>
            )}

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
            <div className="mt-4 pt-4 border-t">
              {!confirmUnenroll ? (
                <button
                  onClick={() => setConfirmUnenroll(true)}
                  className="text-sm text-red-500 hover:underline"
                >
                  Disiscriviti dal corso
                </button>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-xs text-red-700 mb-2">
                    Perderai il tuo progresso su questo corso. Continuare?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleUnenroll}
                      className="bg-red-600 text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-red-700"
                    >
                      Sì, disiscrivimi
                    </button>
                    <button
                      onClick={() => setConfirmUnenroll(false)}
                      className="border px-3 py-1.5 rounded text-xs"
                    >
                      Annulla
                    </button>
                  </div>
                </div>
              )}
            </div>
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
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
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
