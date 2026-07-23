import { API_URL, apiFetch } from "./api"

const createLesson = async(moduleId, lessonData, token) => {
    const response = await apiFetch(`${API_URL}/modules/${moduleId}/lessons`, {
        method: 'POST',
        headers: {
            'Authorization':`Bearer ${token}`,
            'Content-type':'application/json'
        },
        body:JSON.stringify(lessonData)
    })

    const data = await response.json()

    if(!response.ok){
        throw new Error(data.message || 'Failed to create lesson')
    }

    return data
}

const updateLesson = async(id, lessonData, token) => {
    const response = await apiFetch(`${API_URL}/lessons/${id}`,{
        method:'PATCH',
        headers: {
            'Authorization':`Bearer ${token}`,
            'Content-type':'application/json'
        },
        body:JSON.stringify(lessonData)
    })

    const data = await response.json()

    if(!response.ok){
        throw new Error(data.message || 'Failed to update lesson')
    }

    return data
}

const deleteLesson = async(id, token) => {
    const response = await apiFetch(`${API_URL}/lessons/${id}`,{
        method:'DELETE',
        headers: {
            'Authorization':`Bearer ${token}`
        }
    })

    const data = await response.json()

    if(!response.ok){
        throw new Error(data.message || 'Failed to delete lesson')
    }

    return data
}

const uploadLessonVideo = async(id, file, token) => {
    const formData = new FormData()
    formData.append('video', file)

    const response = await apiFetch(`${API_URL}/lessons/${id}/video`,{
        method:'POST',
        headers: {
            'Authorization':`Bearer ${token}`
        },
        body:formData
    })

    const data = await response.json()

    if(!response.ok){
        throw new Error(data.message || 'Failed to upload video')
    }

    return data
}

export {
    createLesson,
    updateLesson,
    deleteLesson,
    uploadLessonVideo
}