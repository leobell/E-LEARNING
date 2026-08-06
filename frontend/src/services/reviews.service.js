import { API_URL } from "./api"

const getReviewsByCourse = async(courseId) => {
    const response = await fetch(`${API_URL}/courses/${courseId}/reviews`)

    const data = await response.json()

    if(!response.ok){
        throw new Error(data.message || 'Failed to fetch reviews')
    }

    return data
}

const createReview = async(courseId, { rating, comment }, token) => {
    const response = await fetch(`${API_URL}/courses/${courseId}/reviews`, {
        method: 'POST',
        headers:{
            'Authorization': `Bearer ${token}`,
            'Content-Type':'application/json'
        },
        body: JSON.stringify({ rating, comment })
    })

    const data = await response.json()

     if (!response.ok) {
        throw new Error(data.message || 'Failed to create review')
    }

    return data
}

const updateReview = async (id, { rating, comment }, token) => {
    const response = await fetch(`${API_URL}/reviews/${id}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rating, comment })
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || 'Failed to update review')
    }

    return data
}

const deleteReview = async (id, token) => {
    const response = await fetch(`${API_URL}/reviews/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || 'Failed to delete review')
    }

    return data
}

export { 
    getReviewsByCourse, 
    createReview, 
    updateReview, 
    deleteReview 
}