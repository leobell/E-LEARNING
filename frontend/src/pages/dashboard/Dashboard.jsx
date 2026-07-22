import { useState, useEffect } from "react"
import { useAuth } from "../../context/auth/AuthContext"
import { getMyProgress } from "../../services/progress.service"
import { Link } from "react-router-dom"
import Spinner from "../../components/spinner/Spinner"
import ErrorAlert from "../../components/errorAlert/ErrorAlert"

const Dashboard = () => {

    const { token } = useAuth()
    const [progressList, setProgressList] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
    const fetchProgress = async () => {
        try {
            const data = await getMyProgress(token)
            setProgressList(data.allProgress)
        } catch (e) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }
    fetchProgress()
    
    }, [])

    const continueWatching = progressList[0]
    const otherCourses = progressList.slice(1)

    if (loading) {
        return <Spinner />
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <ErrorAlert message={error} />
                {continueWatching && (
                    <div className="mb-10">
                        <h2 className="text-xl font-bold mb-4 text-primary-dark">Continua a guardare</h2>
                        <Link
                            to={`/courses/${continueWatching.course._id}/learn`}
                            className="bg-surface rounded-lg shadow p-4 flex gap-4 items-center hover:shadow-lg transition"
                        > 
                            <img
                                src={continueWatching.course.urlImg}
                                alt={continueWatching.course.name}
                                className="w-32 h-20 object-cover rounded"
                            />
                            <div>
                                <p className="font-semibold text-primary-dark">{continueWatching.course.name}</p>
                                <p className="text-sm text-accent">
                                    {continueWatching.completedLessons.length} lezioni completate
                                </p>
                            </div>
                        </Link>
                    </div>
                )}

                <h2 className="text-xl font-bold mb-4 text-primary-dark">I miei corsi</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {otherCourses.map((progress) => (
                        <Link
                            key={progress._id}
                            to={`/courses/${progress.course._id}/learn`}
                            className="bg-surface rounded-lg shadow p-4 hover:shadow-lg transition block"
                        >
                            <img
                                src={progress.course.urlImg}
                                alt={progress.course.name}
                                className="w-full h-32 object-cover rounded mb-2"
                            />
                            <p className="font-semibold text-primary-dark">{progress.course.name}</p>
                            <p className="text-sm text-accent">
                                {progress.completedLessons.length} lezioni completate
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Dashboard
