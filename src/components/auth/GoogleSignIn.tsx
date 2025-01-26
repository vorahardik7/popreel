import { FcGoogle } from 'react-icons/fc'

export default function GoogleSignIn({ onSignIn }: { onSignIn: () => void }) {
  return (
    <button
      onClick={onSignIn}
      className="group relative w-full max-w-sm mx-auto overflow-hidden bg-white/10 
        backdrop-blur-lg hover:bg-white/20 text-white rounded-xl px-6 py-4 
        transition-all duration-300 border border-white/20 hover:border-white/40
        transform hover:scale-[1.02] hover:shadow-xl"
    >
      <div className="relative flex items-center justify-center gap-4">
        <FcGoogle className="text-2xl" />
        <span className="font-medium">Continue with Google</span>
      </div>
    </button>
  )
} 