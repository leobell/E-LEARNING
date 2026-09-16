import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { resetPassword } from '../../services/auth.service'
import { useToast } from '../../context/toast/ToastContext' 
import { Eye, EyeOff } from 'lucide-react'

const ResetPassword = () => {
    const { token } = useParams()
    const navigate = useNavigate()
    const { showToast } = useToast()

    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (newPassword !== confirmPassword) {
            showToast('Le password non coincidono', 'error')
            return
        }

        setLoading(true)

        try {
            await resetPassword(token, newPassword)
            showToast('Password reimpostata con successo, effettua il login')
            navigate('/auth')
        } catch (e) {
            showToast(e.message, 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="bg-surface p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-xl font-bold text-primary-dark mb-2">Imposta nuova password</h1>
                <p className="text-sm text-gray-500 mb-6">Scegli una nuova password per il tuo account.</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Nuova password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={6}
                                className="border-2 border-primary/20 rounded-lg px-4 py-3 pr-10 w-full focus:outline-none focus:border-primary"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? 'Nascondi password' : 'Mostra password'}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Conferma password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={6}
                            className="border-2 border-primary/20 rounded-lg px-4 py-3 w-full focus:outline-none focus:border-primary"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50"
                    >
                        {loading ? 'Attendi...' : 'Reimposta password'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    <Link to="/auth" className="text-primary hover:underline">← Torna al login</Link>
                </p>
            </div>
        </div>
    )
}

export default ResetPassword
