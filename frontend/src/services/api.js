export const API_URL = import.meta.env.VITE_API_URL

const apiFetch = async (url, options = {}) => {
    const response = await fetch(url, options)

    if(response.status === 401) {
        window.dispatchEvent(new CustomEvent('auth:expired'))
    }

    return response
}

export { apiFetch }