import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/auth/AuthContext"
import { useState } from "react"

const Navbar = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)

    const handleLogout = () => {
        logout()
        setMenuOpen(false)
        navigate('/')
    }

    return (
        <nav className="bg-surface shadow px-6 py-4">
            <div className="flex justify-between items-center">
                <Link to="/" className="text-xl font-bold text-primary-dark">
                    E-Learning
                </Link>

                <div className="hidden md:flex gap-6 items-center">
                    <Link to="/search" className="text-primary-dark hover:text-primary">
                        Esplora
                    </Link>

                    {user ? (
                        <>
                            {user.role === 'teacher' ? (
                                <Link to="/teacher/courses" className="text-primary-dark hover:text-primary">
                                    I miei corsi
                                </Link>
                            ) : (
                                <Link to="/dashboard" className="text-primary-dark hover:text-primary">
                                    Dashboard
                                </Link>
                            )}
                            <button
                                onClick={handleLogout}
                                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/auth"
                            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
                        >
                            Accedi
                        </Link>
                    )}
                </div>

                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden text-primary-dark"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            <div
                className={`md:hidden flex flex-col gap-4 overflow-hidden transition-all duration-300 ${
                    menuOpen ? 'max-h-96 opacity-100 mt-4 pb-2' : 'max-h-0 opacity-0'
                }`}
            >
                <Link to="/search" onClick={() => setMenuOpen(false)} className="text-primary-dark">
                    Esplora
                </Link>

                {user ? (
                    <>
                        {user.role === 'teacher' ? (
                            <Link to="/teacher/courses" onClick={() => setMenuOpen(false)} className="text-primary-dark">
                                I miei corsi
                            </Link>
                        ) : (
                            <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="text-primary-dark">
                                Dashboard
                            </Link>
                        )}
                        <button
                            onClick={handleLogout}
                            className="bg-primary text-white px-4 py-2 rounded text-left"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <Link
                        to="/auth"
                        onClick={() => setMenuOpen(false)}
                        className="bg-primary text-white px-4 py-2 rounded text-center"
                    >
                        Accedi
                    </Link>
                )}
            </div>
            
        </nav>
    )
}

export default Navbar
