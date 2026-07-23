import { useState, useEffect } from "react"
import { useAuth } from "../../context/auth/AuthContext"
import { getMyProgress } from "../../services/progress.service"
import { Link } from "react-router-dom"
import Spinner from "../../components/spinner/Spinner"
import ErrorAlert from "../../components/errorAlert/ErrorAlert"
import { BookOpen, CheckCircle, Award } from "lucide-react"

const Dashboard = () => {

    const { token, user } = useAuth()
    const [progressList, setProgressList] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const getGreetings = () => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Buongiorno'
        if (hour < 18) return 'Buon pomeriggio'
        return 'Buonasera'
    }

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
                <Link to="/" className="text-sm text-primary hover:underline mb-4 inline-block">
                    ← Torna alla homepage
                </Link>
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-primary-dark">
                        {getGreetings()}, {user?.firstName}
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Ecco a che punto sei con i tuoi corsi
                    </p>
                </div>
                <ErrorAlert message={error} />
                {continueWatching && (
                    <div className="mb-10">
                        <h2 className="text-xl font-bold mb-4 text-primary-dark">Continua a guardare</h2>
                        <Link
                            to={`/courses/${continueWatching.course._id}/learn`}
                            className="bg-surface rounded-lg border-l-4 border-primary shadow p-4 flex gap-4 items-center hover:shadow-lg transition"
                        > 
                            <img
                                src={continueWatching.course.urlImg}
                                alt={continueWatching.course.name}
                                className="w-32 h-20 object-cover rounded"
                            />
                            <div className="flex-1">
                                <p className="font-semibold text-primary-dark">{continueWatching.course.name}</p>
                                <p className="text-sm text-accent">
                                    {continueWatching.completedLessons.length} lezioni completate
                                </p>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div
                                        className="bg-primary h-2 rounded-full transition-all"
                                        style={{
                                            width: `${Math.round(
                                                (continueWatching.completedLessons.length /
                                                    (continueWatching.course.modules.reduce((sum, m) => sum + m.lessons.length, 0) || 1)) * 100
                                            )}%`
                                        }}
                                    >
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                )}

                <h2 className="text-xl font-bold mb-4 text-primary-dark">I miei corsi</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {otherCourses.map((progress) => {
                        const totalLessons = progress.course.modules.reduce((sum, m) => sum + m.lessons.length, 0)
                        const progressPercent = totalLessons > 0 ? Math.round((progress.completedLessons.length / totalLessons) * 100) : 0

                        return(
                            <Link
                                key={progress._id}
                                to={`/courses/${progress.course._id}/learn`}
                                className="bg-surface rounded-lg shadow p-4 hover:shadow-lg transition flex flex-col"
                            >
                                <img
                                    src={progress.course.urlImg}
                                    alt={progress.course.name}
                                    className="w-full h-32 object-cover rounded mb-2"
                                />
                                <p className="font-semibold text-primary-dark">{progress.course.name}</p>
                                <p className="text-sm text-accent mb-2">
                                    {progress.completedLessons.length} lezioni completate
                                </p>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-auto">
                                    <div
                                        className="bg-primary h-2 rounded-full transition-all"
                                        style={{ width: `${progressPercent}%` }}
                                    >
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
                <div className="bg-primary/5 rounded-lg p-6 text-center mt-8">
                    <p className="text-primary-dark font-semibold mb-2">Vuoi imparare qualcosa di nuovo?</p>
                    <Link to="/search" className="text-primary hover:underline text-sm">
                        Esplora altri corsi →
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-8">
                    <div className="bg-surface rounded-lg shadow p-4 flex flex-col items-center">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                            <BookOpen className="w-6 h-6 text-primary" />
                        </div>
                        <p className="text-2xl font-bold text-primary">{progressList.length}</p>
                        <p className="text-sm text-gray-500">Corsi iscritti</p>
                    </div>
                    <div className="bg-surface rounded-lg shadow p-4 flex flex-col items-center">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                            <CheckCircle className="w-6 h-6 text-primary" />
                        </div>
                        <p className="text-2xl font-bold text-primary">
                            {progressList.reduce((sum, p) => sum + p.completedLessons.length, 0)}
                        </p>
                        <p className="text-sm text-gray-500">Lezioni completate</p>
                    </div>
                    <div className="bg-surface rounded-lg shadow p-4 flex flex-col items-center">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                            <Award className="w-6 h-6 text-primary" />
                        </div>
                        <p className="text-2xl font-bold text-primary">
                            {progressList.filter((p) => p.completedLessons.length === p.course.modules?.reduce((s, m) => s + m.lessons.length, 0)).length}
                        </p>
                        <p className="text-sm text-gray-500">Corsi completati</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
