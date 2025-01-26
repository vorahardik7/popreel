import { useNavigate } from 'react-router-dom'
import { signInWithGoogle } from '../../services/firebase'
import { FcGoogle } from 'react-icons/fc'
import toast from 'react-hot-toast'

export default function LoginButton() {
  const navigate = useNavigate()

  const handleSignIn = async () => {
    try {
      const user = await signInWithGoogle()
      if (user) {
        toast.success('Welcome back!')
        navigate('/')
      }
    } catch (error) {
      toast.error('Failed to sign in')
      console.error(error)
    }
  }

  return (
    <button
      onClick={handleSignIn}
      className="flex items-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-full
        shadow-md hover:shadow-lg transition-all duration-200 ease-in-out hover:scale-105"
    >
      <FcGoogle className="text-2xl" />
      <span>Sign in with Google</span>
    </button>
  )
} 