import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { getCourseWithContent } from "../../services/courses.service"
import { useAuth } from "../../context/auth/AuthContext"
import { enrollInCourse, getMyProgress } from "../../services/progress.service"
import Spinner from "../../components/spinner/Spinner"
import ErrorAlert from "../../components/errorAlert/ErrorAlert"
import { BookOpen } from 'lucide-react'
import { useToast } from "../../context/toast/ToastContext"
import StarRating from "../../components/starRating/StarRating"
import { getReviewsByCourse, createReview, updateReview, deleteReview } from "../../services/reviews.service"

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
  const { showToast } = useToast()
  const [reviews, setReviews] = useState([])
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' })
  const [submittingReview, setSubmittingReview] = useState(false)
  const [editingReviewId, setEditingReviewId] = useState(null)
  const [accessCode, setAccessCode] = useState('')
  const [showCodeInput, setShowCodeInput] = useState(false)

  useEffect(() => {
    const fetchReviews = async() => {
      try {
        const data = await getReviewsByCourse(id)
        setReviews(data.reviews)
      } catch (e) {
        showToast(e.message, 'error')
      }
    }

    fetchReviews()
  }, [id])

  const myReview = reviews.find((r) => r.student._id === user?.id)

  const handleSubmitReview = async (e) => {
    e.preventDefault()

    if (reviewForm.rating === 0) {
      showToast('Seleziona una valutazione', 'error')
      return
    }

    setSubmittingReview(true)

    try {
      if (editingReviewId) {
        const data = await updateReview(editingReviewId, reviewForm, token)
        setReviews(reviews.map((r) => (r._id === editingReviewId ? { ...data.updatedReview, student: r.student } : r)))
        showToast('Recensione aggiornata')
      } else {
        const data = await createReview(id, reviewForm, token)
        setReviews([{ ...data.newReview, student: { _id: user.id, firstName: user.firstName, lastName: user.lastName } }, ...reviews])
        showToast('Recensione pubblicata')
      }

      setReviewForm({ rating: 0, comment: '' })
      setEditingReviewId(null)
    } catch (e) {
      showToast(e.message, 'error')
    } finally {
      setSubmittingReview(false)
    }
  }

  const startEditReview = (review) => {
    setEditingReviewId(review._id)
    setReviewForm({ rating: review.rating, comment: review.comment })
  }

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId, token)
      setReviews(reviews.filter((r) => r._id !== reviewId))
      showToast('Recensione eliminata')
    } catch (e) {
      showToast(e.message, 'error')
    }
  }

  const toggleModule = (moduleId) => {
    setOpenModuleId(moduleId === openModuleId ? null : moduleId)
  }

  const handleEnroll = async() => {
    if(!token){
      navigate('/auth')
      return
    }

    if (course.isPrivate && !showCodeInput) {
      setShowCodeInput(true)
      return
    }

    setEnrolling(true)

    try {
      await enrollInCourse(id, token, accessCode)
      setIsEnrolled(true)
      showToast('Iscrizione avvenuta con successo')
    } catch (e) {
      showToast(e.message, 'error')
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

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null
  
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

        {course.isPrivate && (
          <span className="inline-block bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full mb-2 mr-2">
            🔒 Corso privato
          </span>
        )}

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
              <>
                {showCodeInput && (
                  <input
                    type="text"
                    placeholder="Inserisci il codice di accesso"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    className="border-2 border-primary/20 rounded-lg px-4 py-2 text-center font-mono uppercase shadow-lg"
                  />
                )}
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50 shadow-lg"
                >
                  {enrolling
                    ? 'Iscrizione in corso...'
                    : course.isPrivate && !showCodeInput
                      ? 'Inserisci codice di accesso'
                      : 'Iscriviti'}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-bold text-primary-dark mb-4">Recensioni</h2>

          {averageRating && (
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-primary-dark">{averageRating}</span>
              <div>
                <StarRating rating={Math.round(averageRating)} readOnly />
                <p className="text-sm text-gray-500">{reviews.length} recensioni</p>
              </div>
            </div>
          )}

          {isEnrolled && !myReview && (
            <form onSubmit={handleSubmitReview} className="bg-surface rounded-lg shadow p-4 mb-6">
              <p className="text-sm font-medium text-primary-dark mb-2">Lascia una recensione</p>

              <StarRating 
                rating={reviewForm.rating}
                onChange={(star) => setReviewForm({...reviewForm, rating: star })}
              />

              <textarea 
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                placeholder="Scrivi la tua opinione sul corso..."
                required
                rows={4}
                className="w-full border-2 border-primary/20 rounded-lg px-4 py-2 mt-3 focus:outline-none focus:border-primary"
              />

              <button
                type="submit"
                disabled={submittingReview}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold mt-3 hover:bg-primary-dark disabled:opacity-50"
              >
                {submittingReview ? 'Invio...' : 'Pubblica recensione'}
              </button>
            </form>
          )}

          {editingReviewId && (
            <form onSubmit={handleSubmitReview} className="bg-surface rounded-lg shadow p-4 mb-6">
              <p className="text-sm font-medium text-primary-dark mb-2">Modifica la tua recensione</p>
              <StarRating 
                rating={reviewForm.rating}
                onChange={(star) => setReviewForm({ ...reviewForm, rating: star })}
              />
              <textarea 
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                required
                rows={4}
                className="w-full border-2 border-primary/20 rounded-lg px-4 py-2 mt-3 focus:outline-none focus:border-primary"
              />
              <div className="flex gap-2 mt-3">
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark disabled:opacity-50"
                >
                  Salva modifiche
                </button>
                <button
                  type="button"
                  onClick={() => { setEditingReviewId(null); setReviewForm({ rating: 0, comment: '' }) }}
                  className="border px-4 py-2 rounded-lg text-sm"
                >
                  Anulla
                </button>
              </div>
            </form>
          )}

          <div className="flex flex-col gap-3">
            {reviews.map((review) => (
              <div key={review._id} className="bg-surface rounded-lg shadow p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-primary-dark text-sm">
                      {review.student.firstName} {review.student.lastName}
                    </p>
                    <StarRating rating={review.rating} readOnly />
                  </div>
                  {review.student._id === user?.id && !editingReviewId && (
                    <div className="flex gap-2">
                      <button onClick={() => startEditReview(review)} className="text-xs text-primary hover:underline">
                        Modifica
                      </button>
                      <button onClick={() => handleDeleteReview(review._id)} className="text-xs text-red-500 hover:underline">
                        Elimina
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
              </div>
            ))}

            {reviews.length === 0 && (
              <p className="text-sm text-gray-500">Nessuna recensione per questo corso.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoursePage