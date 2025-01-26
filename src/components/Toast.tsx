import { toast, ToastOptions } from 'react-hot-toast'
import { FiCheck, FiX } from 'react-icons/fi'

const toastConfig: ToastOptions = {
  duration: 3000,
  position: 'bottom-center',
  className: 'bg-dark-800 text-white px-4 py-3 rounded-xl shadow-xl',
}

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    ...toastConfig,
    icon: <FiCheck className="text-green-500" />,
  })
}

export const showErrorToast = (message: string) => {
  toast.error(message, {
    ...toastConfig,
    icon: <FiX className="text-red-500" />,
  })
} 