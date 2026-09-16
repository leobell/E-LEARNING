import { useState, useEffect } from 'react'
import { useAuth } from '../../context/auth/AuthContext'
import { getMe, updateProfile } from '../../services/users.service'
import { changePassword } from '../../services/auth.service'
import { useToast } from '../../context/toast/ToastContext'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import usePageTitle from '../../hooks/usePageTitle'

const Profile = () => {
    const { user, token, saveAuth } = useAuth()
    const { showToast } = useToast()

    const [profileForm, setProfileForm] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || ''
    })
    const [savingProfile, setSavingProfile] = useState(false)

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: ''
    })
    const [changingPassword, setChangingPassword] = useState(false)
    const [hasPassword, setHasPassword] = useState(true)
    const [loading, setLoading] = useState(true)
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    usePageTitle('Profilo')

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const data = await getMe(token)
                setHasPassword(!data.user.googleId)
            } catch (e) {
                showToast(e.message, 'error')
            } finally {
                setLoading(false)
            }
        }

        fetchMe()
    }, [])

    const getInitials = () => {
        if (!user?.firstName) return '?'
        return `${user.firstName[0]}${user.lastName?.[0] || ''}`.toUpperCase()
    }

    const onChangeProfile = (e) => {
        const { name, value } = e.target
        setProfileForm({ ...profileForm, [name]: value })
    }

    const onChangePasswordForm = (e) => {
        const { name, value } = e.target
        setPasswordForm({ ...passwordForm, [name]: value })
    }

    const handleUpdateProfile = async (e) => {
        e.preventDefault()
        setSavingProfile(true)

        try {
            const data = await updateProfile(profileForm, token)
            saveAuth(token, { ...user, firstName: data.userUpdated.firstName, lastName: data.userUpdated.lastName })
            showToast('Profilo aggiornato con successo')
        } catch (e) {
            showToast(e.message, 'error')
        } finally {
            setSavingProfile(false)
        }
    }

    const handleChangePassword = async (e) => {
        e.preventDefault()

        if (passwordForm.newPassword !== confirmPassword) {
            showToast('Le password non coincidono', 'error')
            return
        }
        setChangingPassword(true)

        try {
            await changePassword(passwordForm, token)
            setPasswordForm({ currentPassword: '', newPassword: '' })
            setConfirmPassword('')
            showToast('Password aggiornata con successo')
        } catch (e) {
            showToast(e.message, 'error')
        } finally {
            setChangingPassword(false)
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-2xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-primary-dark mb-6">Il mio profilo</h1>

                <Link to={user.role === 'student' ? '/dashboard' : '/teacher/courses'} className="inline-flex items-center gap-1 text-sm text-primary hover:underline mb-4">
                    <ArrowLeft className="w-4 h-4" />
                    Torna {user.role === 'student' ? 'nella dashboard' : 'nei tuoi corsi'}
                </Link>

                <div className="flex items-center gap-4 bg-surface rounded-lg shadow p-6 mb-6">
                    <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl shrink-0">
                        {getInitials()}
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-primary-dark">
                            {user?.firstName} {user?.lastName}
                        </h1>
                        <p className="text-sm text-gray-500">{user?.role === 'teacher' ? 'Docente' : 'Studente'}</p>
                    </div>
                </div>

                <div className="bg-surface rounded-lg shadow p-6 mb-6">
                    <h2 className="text-lg font-bold text-primary-dark mb-4">Dati account</h2>
                    <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
                        <div className='flex flex-col gap-1'>
                           <label className="text-sm font-medium text-gray-600">Nome</label>
                            <input
                                name="firstName"
                                type="text"
                                placeholder="Nome"
                                value={profileForm.firstName}
                                onChange={onChangeProfile}
                                required
                                className="border-2 border-primary/20 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                            /> 
                        </div>
                        
                        <div className='flex flex-col gap-1'>
                            <label className="text-sm font-medium text-gray-600">Cognome</label>
                            <input
                                name="lastName"
                                type="text"
                                placeholder="Cognome"
                                value={profileForm.lastName}
                                onChange={onChangeProfile}
                                required
                                className="border-2 border-primary/20 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                            />
                        </div>
                        
                        <button
                            type="submit"
                            disabled={savingProfile}
                            className="bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50 self-start px-6"
                        >
                            {savingProfile ? 'Salvataggio...' : 'Salva modifiche'}
                        </button>
                    </form>
                </div>
                {!loading && hasPassword && (
                    <div className="bg-surface rounded-lg shadow p-6">
                        <h2 className="text-lg font-bold text-primary-dark mb-4">Cambia password</h2>
                        <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
                            <div className='flex flex-col gap-1'>
                                <label className="text-sm font-medium text-gray-600">Password attuale</label>
                                <div className='relative'>
                                    <input
                                        name="currentPassword"
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        placeholder="Password attuale"
                                        value={passwordForm.currentPassword}
                                        onChange={onChangePasswordForm}
                                        required
                                        className="border-2 border-primary/20 rounded-lg px-4 py-3 pr-10 w-full focus:outline-none focus:border-primary"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-600">Nuova password</label>
                                <div className='relative'>
                                    <input
                                        name="newPassword"
                                        type={showNewPassword ? 'text' : 'password'}
                                        placeholder="Nuova password"
                                        value={passwordForm.newPassword}
                                        onChange={onChangePasswordForm}
                                        required
                                        minLength={6}
                                        className="border-2 border-primary/20 rounded-lg px-4 py-3 pr-10 w-full focus:outline-none focus:border-primary"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                            

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-600">Conferma nuova password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        minLength={6}
                                        className="border-2 border-primary/20 rounded-lg px-4 py-3 pr-10 w-full focus:outline-none focus:border-primary"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                            
                            <button
                                type="submit"
                                disabled={changingPassword}
                                className="bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50 self-start px-6"
                            >
                                {changingPassword ? 'Attendi...' : 'Cambia password'}
                            </button>
                        </form>
                    </div>
                )}
                
            </div>
        </div>
    )
}

export default Profile