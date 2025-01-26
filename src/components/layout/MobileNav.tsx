import { FiHome, FiPlusSquare, FiUser, FiLogOut } from 'react-icons/fi'
import { Link } from 'react-router-dom'

interface MobileNavProps {
  onLogout: () => void
}

export default function MobileNav({ onLogout }: MobileNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-gray-800 md:hidden">
      <div className="flex justify-around py-4">
        <Link to="/" className="flex flex-col items-center gap-1">
          <FiHome className="text-2xl" />
          <span className="text-xs">Home</span>
        </Link>
        <Link to="/upload" className="flex flex-col items-center gap-1">
          <FiPlusSquare className="text-2xl" />
          <span className="text-xs">Upload</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center gap-1">
          <FiUser className="text-2xl" />
          <span className="text-xs">Profile</span>
        </Link>
        <button onClick={onLogout} className="flex flex-col items-center gap-1">
          <FiLogOut className="text-2xl" />
          <span className="text-xs">Logout</span>
        </button>
      </div>
    </div>
  )
} 