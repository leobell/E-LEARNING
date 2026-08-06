import { useNavigate, Link } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { login, register, googleAuth, completeGoogleRegistration, requestPasswordReset } from "../../services/auth.service"
import { useAuth } from "../../context/auth/AuthContext"
import { useToast } from "../../context/toast/ToastContext"
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
    const googleButtonRef = useRef(null)
    const [pendingGoogleData, setPendingGoogleData] = useState(null)
    const [extraLastName, setExtraLastName] = useState('')
    const [showForgotPassword, setShowForgotPassword] = useState(false)
    const [forgotEmail, setForgotEmail] = useState('')
    const [sendingReset, setSendingReset] = useState(false)
    const { showToast } = useToast()

    const afterAuthSuccess = (token) => {
        const decodedUser = decodeToken(token)
        saveAuth(token, decodedUser)
        navigate(decodedUser.role === 'teacher' ? '/teacher/courses' : '/dashboard')
    }

    const handleGoogleResponse = async (response) => {
        try {
            const data = await googleAuth(response.credential)

            if (data.isNewUser) {
                setPendingGoogleData(data.googleData)
            } else {
                afterAuthSuccess(data.token)
            }
        } catch (e) {
            setError(e.message)
        }
    }

    const handleCompleteGoogleRegistration = async (role) => {
        setIsLoading(true)
        setError('')

        try {
            const finalData = {
                ...pendingGoogleData,
                lastName: pendingGoogleData.lastName || extraLastName
            }
            const data = await completeGoogleRegistration(finalData, role)
            afterAuthSuccess(data.token)
        } catch (e) {
            setError(e.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleForgotPassword = async(e) => {
        e.preventDefault()

        setSendingReset(true)

        try {
            await requestPasswordReset(forgotEmail)
            showToast('Se l\'email esiste, riceverai un link per il reset')
            setShowForgotPassword(false)
            setForgotEmail('')
        } catch (e) {
            showToast(e.message, 'error')
        } finally {
            setSendingReset(false)
        }
    }

    useEffect(() => {
        if (!window.google) return

        window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleGoogleResponse
        })

        window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: 'outline',
            size: 'large',
            width: '100%'
        })
    }, [])

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
                    {pendingGoogleData ? (
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-primary-dark mb-2">
                                Ciao {pendingGoogleData.firstName}!
                            </h2>
                            <p className="text-gray-500 text-sm mb-6">
                                Completa la registrazione
                            </p>

                            {!pendingGoogleData.lastName && (
                                <input
                                    type="text"
                                    placeholder="Cognome"
                                    value={extraLastName}
                                    onChange={(e) => setExtraLastName(e.target.value)}
                                    required
                                    className="border-2 border-primary/20 rounded-full bg-surface px-4 py-3 mb-4 w-full"
                                />
                            )}

                            <ErrorAlert message={error} />

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => handleCompleteGoogleRegistration('student')}
                                    disabled={isLoading || (!pendingGoogleData.lastName && !extraLastName.trim())}
                                    className="border-2 border-primary/20 rounded-lg px-4 py-3 font-medium text-primary-dark hover:border-primary hover:bg-primary/5 disabled:opacity-50"
                                >
                                    Sono uno Studente
                                </button>
                                <button
                                    onClick={() => handleCompleteGoogleRegistration('teacher')}
                                    disabled={isLoading || (!pendingGoogleData.lastName && !extraLastName.trim())}
                                    className="border-2 border-primary/20 rounded-lg px-4 py-3 font-medium text-primary-dark hover:border-primary hover:bg-primary/5 disabled:opacity-50"
                                >
                                    Sono un Docente
                                </button>
                            </div>

                            <button
                                onClick={() => setPendingGoogleData(null)}
                                className="text-sm text-gray-400 hover:underline mt-4"
                            >
                                Annulla
                            </button>
                        </div>
                    ) : showForgotPassword ? (
                        <div>
                            <h2 className="text-lg font-bold text-primary-dark my-2">Password dimenticata?</h2>
                            <p className="text-sm text-gray-500 mb-4">
                                Inserisci la tua email, ti manderemo un link per reimpostarla.
                            </p>
                            <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    required
                                    className="border-2 border-primary/20 rounded-full px-4 py-3 focus:outline-none focus:border-primary"
                                />
                                <button
                                    type="submit"
                                    disabled={sendingReset}
                                    className="bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50"
                                >
                                    {sendingReset ? 'Invio...' : 'Invia link di reset'}
                                </button>
                            </form>
                            <button
                                onClick={() => setShowForgotPassword(false)}
                                className="text-sm text-gray-400 hover:underline mt-4"
                            >
                                ← Torna al login
                            </button>
                        </div>
                    ) : (
                        <>
                            <div ref={googleButtonRef} className="mb-4"></div>
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
                                        type="button"
                                        onClick={() => setShowForgotPassword(true)}
                                        className="text-sm text-primary hover:underline self-end"
                                    >
                                        Password dimenticata?
                                    </button>

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
                        </>
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
