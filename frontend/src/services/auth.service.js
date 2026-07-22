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

export { login, register }