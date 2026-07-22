import { useState, useEffect } from "react"
import { searchCourses } from "../../services/courses.service"
import Spinner from "../../components/spinner/Spinner"
import ErrorAlert from "../../components/errorAlert/ErrorAlert"
import CourseCard from "../../components/courseCard/CourseCard"

const Search = () => {
  const [query, setQuery] = useState('')
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const fetchResults = async() => {
        setIsLoading(true)
        try {
          const data = await searchCourses({ q: query, category, page })
          setCourses(data.courses)
          setTotalPages(data.totalPages)
        } catch (e) {
          setError(e.message)
        } finally {
          setIsLoading(false)
        }
      }

      fetchResults()
    }, 500)

    return () => clearTimeout(timeoutId)
    
  }, [query, category, page])

  useEffect(() => {
    setPage(1)
  }, [query, category])

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
          <input 
            type="text"
            placeholder="Cerca un corso"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border-2 border-primary/20 rounded-full bg-surface  hover:border-primary/40 transition-colors focus:outline-none focus:border-primary px-4 py-3 mb-6"
          />
          
          <div className="relative inline-block mb-6 ml-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="appearance-none border-2 border-primary/20 rounded-full pl-5 pr-10 py-3 bg-surface text-primary-dark font-medium cursor-pointer hover:border-primary/40 transition-colors focus:outline-none focus:border-primary"
            >
              <option value="">Tutte le categorie</option>
              <option value="Programmazione">Programmazione</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Business">Business</option>
              <option value="Altro">Altro</option>
            </select>

            <svg
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-dark"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        

        <ErrorAlert message={error} />

        {isLoading ? (
          <Spinner />
        ) : courses.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Nessun corso trovato.</p>
            <p className="text-gray-400 text-sm mt-1">Prova a modificare i filtri di ricerca.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}

        {!isLoading && courses.length > 0 && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Precedente
            </button>

            <span className="text-gray-600">
              Pagina {page} di {totalPages}
            </span>

            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Successivo
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Search
