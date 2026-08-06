import { API_URL } from "./api"

const login = async(email, password) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({email, password})
    })

    const data = await response.json()

    if(!response.ok){
        throw new Error(data.message || 'Login failed')
    }
    
    return data
}

const register = async({ firstName, lastName, email, password, role }) => {
    const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: {
            'Content-type':'application/json'
        },
        body: JSON.stringify({ firstName, lastName, email, password, role })
    })

    const data = await response.json()

    if(!response.ok){
        throw new Error(data.message || 'Registration failed')
    }

    return data
}

const googleAuth = async(idToken) => {
    const response = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify({ idToken })
    })

    const data = await response.json()

    if(!response.ok){
        throw new Error(data.message || 'Google authentication failed')
    }

    return data
}

const completeGoogleRegistration = async(googleData, role) => {
    const response = await fetch(`${API_URL}/auth/google/complete`, {
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify({ ...googleData, role })
    })

    const data = await response.json()

    if(!response.ok){
        throw new Error(data.message || 'Registration failed')
    }

    return data
}

const changePassword = async ({ currentPassword, newPassword }, token) => {
    const response = await fetch(`${API_URL}/auth/change-password`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentPassword, newPassword })
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || 'Failed to change password')
    }

    return data
}

const requestPasswordReset = async (email) => {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset email')
    }

    return data
}

const resetPassword = async (token, newPassword) => {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password')
    }

    return data
}
export { 
    login, 
    register, 
    googleAuth, 
    completeGoogleRegistration, 
    changePassword,
    requestPasswordReset,
    resetPassword
}