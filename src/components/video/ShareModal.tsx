import { FiX, FiLink, FiTwitter, FiInstagram } from 'react-icons/fi'
import toast from 'react-hot-toast'

interface ShareModalProps {
  videoId: string
  onClose: () => void
}

export default function ShareModal({ videoId, onClose }: ShareModalProps) {
  const videoUrl = `${window.location.origin}/video/${videoId}`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(videoUrl)
      toast.success('Link copied!')
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Share Video</h3>
          <button onClick={onClose}>
            <FiX className="text-xl" />
          </button>
        </div>

        <div className="space-y-4">
          <button
            onClick={copyLink}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-800 hover:bg-gray-700"
          >
            <FiLink className="text-xl" />
            <span>Copy Link</span>
          </button>

          <div className="flex justify-center gap-4">
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(videoUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-gray-800 hover:bg-gray-700"
            >
              <FiTwitter className="text-xl" />
            </a>
            <a
              href={`https://www.instagram.com/share?url=${encodeURIComponent(videoUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-gray-800 hover:bg-gray-700"
            >
              <FiInstagram className="text-xl" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 