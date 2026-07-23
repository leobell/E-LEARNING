import { API_URL, apiFetch } from "./api"

const getLatestCourses = async () => {
    const response = await fetch(`${API_URL}/courses/latest`)

    const data = await response.json()

    if(!response.ok){
        throw new Error(data.message || 'Failed to fetch courses')
    }

    return data
}

const getCourseWithContent = async(id) => {
    const response = await fetch(`${API_URL}/courses/${id}/content`)

    const data = await response.json()

    if(!response.ok){
        throw new Error(data.message || 'Failed to fetch course')
    }

    return data
}

const searchCourses = async({ q, category, page }) => {
    const params = new URLSearchParams()

    if(q) params.append('q', q)
    if(category) params.append('category', category)
    if(page) params.append('page', page)
    
    const response = await fetch(`${API_URL}/courses/search?${params.toString()}`)

    const data = await response.json()

    if(!response.ok){
        throw new Error(data.message || 'Failed to search courses')
    }

    return data
}

const getMyCourses = async(token) => {
    const response = await apiFetch(`${API_URL}/courses/mine`,{
        method: 'GET',
        headers: {
            'Authorization':`Bearer ${token}`
        }
    })

    const data = await response.json()

    if(!response.ok){
        throw new Error(data.message || 'Failed to fetch your courses')
    }

    return data
}

const createCourse = async(body, token) => {
    const response = await apiFetch(`${API_URL}/courses`,{
        method: 'POST',
        headers: {
            'Authorization' : `Bearer ${token}`,
            'Content-type' : 'application/json'
        },
        body: JSON.stringify(body)
    })

    const data = await response.json()

    if(!response.ok) {
        throw new Error(data.message || 'Failed to create course')
    }

    return data
}

const updateCourse = async(id, body, token) => {
    const response = await apiFetch(`${API_URL}/courses/${id}`,{
        method: 'PATCH',
        headers: {
            'Authorization' : `Bearer ${token}`,
            'Content-type' : 'application/json'
        },
        body: JSON.stringify(body)
    })

    const data = await response.json()

    if(!response.ok) {
        throw new Error(data.message || 'Failed to update course')
    }

    return data
}

const uploadCourseImage = async(id, file, token) => {
    const formData = new FormData()
    formData.append('image', file)

    const response = await apiFetch(`${API_URL}/courses/${id}/image`,{
        method: 'POST',
        headers:{
            'Authorization':`Bearer ${token}`
        },
        body: formData
    })

    const data = await response.json()

    if(!response.ok){
        throw new Error(data.message || 'Failed to upload image')
    }

    return data
}

const getCourseForLearning = async(id, token) => {
    const response = await apiFetch(`${API_URL}/courses/${id}/learn`,{
        method: 'GET',
        headers:{
            'Authorization' : `Bearer ${token}`
        }
    })

    const data = await response.json()

    if(!response.ok){
        throw new Error(data.message || 'Failed to fetch course content')
    }

    return data
}

export { 
    getLatestCourses, 
    getCourseWithContent, 
    searchCourses, 
    getMyCourses, 
    createCourse, 
    updateCourse,
    uploadCourseImage,
    getCourseForLearning
}