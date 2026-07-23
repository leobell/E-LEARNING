import { useToast } from "../../context/toast/ToastContext"
import { CheckCircle, XCircle } from 'lucide-react'

const Toast = () => {
    const { toast } = useToast()

    if(!toast) return null

    const isSuccess = toast.type === 'success'

    return (
        <div
            className={`fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-white z-50 ${
                isSuccess ? 'bg-green-600' : 'bg-red-600'
            }`}
        >
            {isSuccess ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            {toast.message}
        </div>
    )
}

export default Toast
