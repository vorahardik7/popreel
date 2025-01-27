import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { auth, signInWithGoogle } from '../../services/firebase'
import { FiUpload, FiLogOut } from 'react-icons/fi'
import { SiMediamarkt } from "react-icons/si"
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, loading } = useAuth()

  if (loading) return null

  return (
    <nav className="fixed top-0 inset-x-0 h-20 z-50 backdrop-blur-lg bg-dark-900/80">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <SiMediamarkt className="h-8 w-8 text-primary-500" />
          <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 
                        text-transparent bg-clip-text">
            PopReel
          </span>
        </Link>

        {user ? (
          <div className="flex items-center gap-6">
            <Link 
              to="/upload"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full 
                       bg-gradient-to-r from-primary-500 to-primary-600 
                       hover:from-primary-400 hover:to-primary-500
                       transition-all duration-300 text-white font-medium"
            >
              <FiUpload className="text-lg" />
              <span>Upload</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link to="/profile">
                <img 
                  src={user.photoURL || ''} 
                  alt={user.displayName || ''} 
                  className="w-10 h-10 rounded-full ring-2 ring-primary-500/50 hover:ring-primary-500 
                           transition-all object-cover"
                />
              </Link>
              <button
                onClick={() => auth.signOut()}
                className="p-2.5 rounded-full text-white/80 hover:text-white
                         hover:bg-white/10 transition-all duration-300"
              >
                <FiLogOut className="text-xl" />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => signInWithGoogle()}
            className="px-6 py-2.5 rounded-full bg-primary-500 hover:bg-primary-600 
                     text-white font-medium transition-all"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  )
} 