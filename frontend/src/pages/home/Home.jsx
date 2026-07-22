import { useState, useEffect } from "react"
import { getLatestCourses } from "../../services/courses.service"
import CourseCard from "../../components/courseCard/CourseCard"
import Spinner from "../../components/spinner/Spinner"
import ErrorAlert from "../../components/errorAlert/ErrorAlert"

const Home = () => {
  const [courses, setCourses] = useState([])
  const [isloading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

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

    fetchCourses( )

  }, [])

  return (
    <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-primary-dark mb-6">Ultimi corsi</h1>

            <ErrorAlert message={error} />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {courses.map((course) => (
                    <CourseCard key={course._id} course={course} />
                ))}
            </div>
        </div>
    </div>
  )
}

export default Home
