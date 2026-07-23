import { createContext, useState, useContext, useCallback } from 'react'

const ToastContext = createContext()

const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState(null)

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type })

        setTimeout(() => {
            setToast(null)
        }, 3000)
    }, [])

    return (
        <ToastContext.Provider value={{ toast, showToast }}>
            {children}
        </ToastContext.Provider>
    )
}

const useToast = () => useContext(ToastContext)

export { ToastProvider, useToast}
