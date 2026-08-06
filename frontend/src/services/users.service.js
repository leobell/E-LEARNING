import { API_URL } from './api'

const updateProfile = async (data, token) => {
    const response = await fetch(`${API_URL}/users/me`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    const responseData = await response.json()

    if (!response.ok) {
        throw new Error(responseData.message || 'Failed to update profile')
    }

    return responseData
}

const getMe = async (token) => {
    const response = await fetch(`${API_URL}/users/me`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch profile')
    }

    return data
}

export { 
    updateProfile,
    getMe
}