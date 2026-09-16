import { useState, useEffect } from "react"
import { getLatestCourses } from "../../services/courses.service"
import CourseCard from "../../components/courseCard/CourseCard"
import Spinner from "../../components/spinner/Spinner"
import ErrorAlert from "../../components/errorAlert/ErrorAlert"
import Hero from "../../components/hero/Hero"
import Features from "../../components/features/Features"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/auth/AuthContext"
import usePageTitle from "../../hooks/usePageTitle"

const Home = () => {
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { user } = useAuth()

  usePageTitle('Home')

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getLatestCourses()
        setCourses(data.courses)
      } catch (e) {
        setError(e.message)
      } finally{
        setIsLoading(false)
      }
    }

    fetchCourses()

  }, [user])

  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <Features />
      <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-primary-dark mb-6">Ultimi corsi</h1>

          <ErrorAlert message={error} />

          {isLoading ? (
            <Spinner />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          )}
      </div>
      {!user && (
        <div className="bg-primary/5 py-12 text-center">
          <h2 className="text-2xl font-bold text-primary-dark mb-3">Pronto a iniziare?</h2>
          <p className="text-gray-600 mb-6">Scopri il corso perfetto per te tra tutti quelli disponibili.</p>
          <button onClick={() => navigate('/search')} className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark">
            Esplora il catalogo
          </button>
        </div>
      )}
    </div>
  )
}

export default Home
