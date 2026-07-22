const decodeToken = (token) => {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(atob(payload))
    return decoded
}

export { decodeToken }