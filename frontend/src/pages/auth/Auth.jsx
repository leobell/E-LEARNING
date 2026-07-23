import { useNavigate, Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { login, register } from "../../services/auth.service"
import { useAuth } from "../../context/auth/AuthContext"
import { decodeToken } from "../../utils/token"
import ErrorAlert from "../../components/errorAlert/ErrorAlert"
import authImage from "../../assets/auth-workplace.png"

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true)
    const [loginForm, setLoginForm] = useState({email: '', password: ''})
    const [registerForm, setRegisterForm] = useState({
        firstName: '', 
        lastName: '', 
        email: '', 
        password: '',
        role:'student' 
    })
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { saveAuth } = useAuth()
    const navigate = useNavigate()

    const onChangeLogin = (e) => {
        const { name, value } = e.target
        setLoginForm({
            ...loginForm,
            [name]:value
        })
    }

    const onChangeRegister = (e) => {
        const { name, value } = e.target
        setRegisterForm({
            ...registerForm,
            [name]:value
        })
    }

    const afterAuthSuccess = (token) => {
        const decodedUser = decodeToken(token)
        saveAuth(token, decodedUser)
        navigate(decodedUser.role === 'teacher' ? '/teacher/courses' : '/dashboard')
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            const data = await login(loginForm.email, loginForm.password)
            afterAuthSuccess(data.token)
        } catch (e) {
            setError(e.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            await register(registerForm)
            const data = await login(registerForm.email, registerForm.password)
            afterAuthSuccess(data.token)
        } catch (e) {
            setError(e.message)
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <div className="min-h-screen flex">
            <div className="flex-3 flex flex-col items-center justify-center bg-background px-4">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-primary-dark">E-Learning</h1>
                    <p className="text-gray-500 text-sm mt-1">La tua piattaforma di corsi online</p>
                </div>

                <div className="bg-surface p-8 rounded-lg shadow-md w-full max-w-md">
                    <div className="flex mb-6">
                        <button
                            onClick={() => {setIsLogin(true); setError('')}}
                            className={`flex-1 py-2 font-semibold ${isLogin ? 'border-b-2 border-primary text-primary' : 'text-gray-400'}`}
                        >
                            Accedi
                        </button>
                        <button
                            onClick={() => {setIsLogin(false); setError('')}}
                            className={`flex-1 py-2 font-semibold ${!isLogin ? 'border-b-2 border-primary text-primary' : 'text-gray-400'}`}
                        >
                            Registrati
                        </button>
                    </div>

                    <ErrorAlert message={error} />

                    {isLogin ? (
                        <form onSubmit={handleLogin} className="flex flex-col gap-4">
                            <input 
                                name="email"
                                type="email"
                                placeholder="Email"
                                value={loginForm.email}
                                onChange={onChangeLogin}
                                required
                                className="border-2 border-primary/20 rounded-full bg-surface  hover:border-primary/40 transition-colors focus:outline-none focus:border-primary px-4 py-3" 
                            />
                            <input 
                                name="password"
                                type="password"
                                placeholder="Password"
                                value={loginForm.password}
                                onChange={onChangeLogin}
                                required
                                className="border-2 border-primary/20 rounded-full bg-surface  hover:border-primary/40 transition-colors focus:outline-none focus:border-primary px-4 py-3" 
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50"
                            >
                                {isLoading ? 'Attendi..' : 'Accedi'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleRegister} className="flex flex-col gap-4">
                            <input 
                                name="firstName"
                                type="text"
                                placeholder="Nome"
                                value={registerForm.firstName}
                                onChange={onChangeRegister}
                                required
                                className="border-2 border-primary/20 rounded-full bg-surface  hover:border-primary/40 transition-colors focus:outline-none focus:border-primary px-4 py-3" 
                            />
                            <input 
                                name="lastName"
                                type="text"
                                placeholder="Cognome"
                                value={registerForm.lastName}
                                onChange={onChangeRegister}
                                required
                                className="border-2 border-primary/20 rounded-full bg-surface  hover:border-primary/40 transition-colors focus:outline-none focus:border-primary px-4 py-3" 
                            />
                            <input 
                                name="email"
                                type="email"
                                placeholder="Email"
                                value={registerForm.email}
                                onChange={onChangeRegister}
                                required
                                className="border-2 border-primary/20 rounded-full bg-surface  hover:border-primary/40 transition-colors focus:outline-none focus:border-primary px-4 py-3" 
                            />
                            <input 
                                name="password"
                                type="password"
                                placeholder="Password"
                                value={registerForm.password}
                                onChange={onChangeRegister}
                                required
                                className="border-2 border-primary/20 rounded-full bg-surface  hover:border-primary/40 transition-colors focus:outline-none focus:border-primary px-4 py-3" 
                            />

                            <div className="flex gap-3">
                                <label className={`flex-1 border-2 rounded-lg  px-4 py-3 transition-colors text-center cursor-pointer font-medium ${
                                registerForm.role === 'student' ? 'border-primary bg-primary text-white' : 'border-primary/20 text-primary-dark' 
                                }`}>
                                    <input 
                                        name="role"
                                        type="radio"
                                        value='student'
                                        checked={registerForm.role === 'student'}
                                        onChange={onChangeRegister}
                                        className="hidden" 
                                    />
                                    Studente
                                </label>
                                <label className={`flex-1 border-2 rounded-lg  px-4 py-3 transition-colors text-center cursor-pointer font-medium ${
                                registerForm.role === 'teacher' ? 'border-primary bg-primary text-white' : 'border-primary/20 text-primary-dark' 
                                }`}>
                                    <input 
                                        name="role"
                                        type="radio"
                                        value='teacher'
                                        checked={registerForm.role === 'teacher'}
                                        onChange={onChangeRegister}
                                        className="hidden" 
                                    />
                                    Docente
                                </label>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50"
                            >
                                {isLoading ? 'Attendi..' : 'Registrati'}
                            </button>
                        </form>
                    )}
                </div>
                <p className="text-center text-sm text-gray-500 mt-6">
                    <Link to="/" className="text-primary hover:underline">← Torna alla home</Link>
                </p>
            </div>
            <div
                className="hidden lg:block flex-2 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${authImage})` }}
            >
                <div className="absolute inset-0 bg-primary-dark/60 flex items-center justify-center p-12">
                    <div className="text-white text-center max-w-md">
                        <h2 className="text-3xl font-bold mb-4">Inizia il tuo percorso</h2>
                        <p className="text-gray-200">Accedi o registrati per iniziare a imparare o insegnare con noi.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Auth
