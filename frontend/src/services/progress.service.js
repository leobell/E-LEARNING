import { API_URL } from "./api"

const getMyProgress = async (token) => {
    const response = await fetch(`${API_URL}/progress/me`, {
        method:'GET',
        headers: {
            'Authorization':`Bearer ${token}`
        }
    })

    const data = await response.json()

    if(!response.ok){
        throw new Error(data.message || 'Failed to fetch progress')
    }

    return data
}

const enrollInCourse = async(idCourse, token) => {
    const response = await fetch(`${API_URL}/courses/${idCourse}/enroll`,{
        method:'POST',
        headers:{
            'Authorization':`Bearer ${token}`
        }
    })

    const data = await response.json()

    if(!response.ok){
        throw new Error(data.message || 'Failed to enroll')
    }

    return data
}

const completeLesson = async(courseId, lessonId, token) => {
    const response = await fetch(`${API_URL}/courses/${courseId}/lessons/${lessonId}/complete`,{
        method:'PATCH',
        headers:{
            'Authorization':`Bearer ${token}`
        }
    })

    const data = await response.json()

    if(!response.ok){
        throw new Error(data.message || 'Failed to complete lesson')
    }

    return data
}

export { getMyProgress, enrollInCourse, completeLesson }