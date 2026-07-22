import { API_URL } from "./api"

const createModule = async(courseId, name, token) => {
    const response = await fetch(`${API_URL}/courses/${courseId}/modules`,{
        method:'POST',
        headers: {
            'Authorization':`Bearer ${token}`,
            'Content-Type':'application/json'
        },
        body:JSON.stringify( {name })
    })

    const data = await response.json()

    if(!response.ok){
        throw new Error(data.message || 'Failed to create module')
    }

    return data
}

const updateModule = async(id, name, token) => {
    const response = await fetch(`${API_URL}/modules/${id}`,{
        method:'PATCH',
        headers:{
            'Authorization': `Bearer ${token}`,
            'Content-Type':'application/json'
        },
        body:JSON.stringify({ name })
    })

    const data = await response.json()

    if(!response.ok){
        throw new Error(data.message || 'Failed to update module')
    }

    return data
}

const deleteModule = async(id, token) => {
    const response = await fetch(`${API_URL}/modules/${id}`,{
        method:'DELETE',
        headers:{
            'Authorization':`Bearer ${token}`
        }
    })

    const data = await response.json()

    if(!response.ok){
        throw new Error(data.message || 'Failed to delete module')
    }

    return data
}

export{
    createModule,
    updateModule,
    deleteModule
}