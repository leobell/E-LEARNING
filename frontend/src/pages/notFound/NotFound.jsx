import { Link } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'

const NotFound = () => {
    return (
        <div className='min-h-screen flex items-center justify-center bg-background px-4'>
            <div className='text-center'>
                <GraduationCap className="w-16 h-16 text-primary mx-auto mb-4" />
                <h1 className="text-6xl font-bold text-primary-dark mb-2">404</h1>
                <p className="text-gray-500 mb-6">La pagina che cerchi non esiste o è stata spostata.</p>
                <Link
                    to="/"
                    className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark"
                >
                    Torna alla home
                </Link>
            </div>
        </div>
  )
}

export default NotFound
