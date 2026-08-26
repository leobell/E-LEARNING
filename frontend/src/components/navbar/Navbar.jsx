import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../context/auth/AuthContext"
import { useState, useEffect, useRef } from "react"
import { GraduationCap, ChevronDown } from 'lucide-react'

const Navbar = () => {
    const { user, logout } = useAuth()
    const userMenuRef = useRef(null)
    const navigate = useNavigate()
    const location = useLocation()
    const [menuOpen, setMenuOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setUserMenuOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)

    }, [])
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const isActive = (path) => location.pathname === path

    const handleLogout = () => {
        logout()
        setMenuOpen(false)
        navigate('/')
    }

    const getInitials = () => {
        if (!user?.firstName) return '?'
        return `${user.firstName[0]}${user.lastName?.[0] || ''}`.toUpperCase()
    }

    return (
        <nav className={`bg-surface px-6 py-4 sticky top-0 z-40 transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-none'}`}>
            <div className="flex justify-between items-center">
                <Link to="/" className="text-xl font-bold text-primary-dark flex items-center gap-2">
                    <GraduationCap className="w-6 h-6 text-primary" />
                    E-Learning
                </Link>

                <div className="hidden md:flex gap-6 items-center">
                    <Link to="/search" className={`hover:text-primary ${isActive('/search') ? 'text-primary font-semibold' : 'text-primary-dark'}`}>
                        Esplora
                    </Link>

                    {user ? (
                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-1"
                            >
                                <div className="w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center font-semibold text-sm">
                                    {getInitials()}
                                </div>
                                <ChevronDown className={`w-4 h-4 text-primary-dark transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {userMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-surface rounded-lg shadow-lg py-2 z-50">
                                    <Link
                                        to={user.role === 'teacher' ? '/teacher/courses' : '/dashboard'}
                                        onClick={() => setUserMenuOpen(false)}
                                        className="block px-4 py-2 text-sm text-primary-dark hover:bg-background"
                                    >
                                        {user.role === 'teacher' ? 'I miei corsi' : 'Dashboard'}
                                    </Link>
                                    <Link
                                        to={'/profile'}
                                        onClick={() => setUserMenuOpen(false)}
                                        className="block px-4 py-2 text-sm text-primary-dark hover:bg-background"
                                    >
                                        Profilo
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-background"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/auth" className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark">
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

                <Link
                    to={'/profile'}
                    onClick={() => setMenuOpen(false)}
                    className="text-primary-dark"
                >
                    Profilo
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
