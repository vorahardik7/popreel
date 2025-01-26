import { useRef, useEffect, useState } from 'react'
import { FiHeart, FiMessageCircle, FiShare2, FiVolume2, FiVolumeX, FiX, FiPlay } from 'react-icons/fi'
import Comments from './Comments'
import { toggleLike, checkIfLiked } from '../../services/likes'
import { useAuth } from '../../context/AuthContext'
import { showErrorToast, showSuccessToast } from '../Toast'
import { formatTimeAgo, formatNumber } from '../../utils/formatters'
import { Video } from '../../types/index'
import { useNavigate, Link } from 'react-router-dom'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../../services/firebase'
import { signInWithGoogle } from '../../services/firebase'

interface VideoCardProps {
  video: Video
  isVisible: boolean
}

interface ActionButtonProps {
  icon: React.ReactNode
  label: string | number
  onClick: () => void
  active?: boolean
}

export default function VideoCard({ video, isVisible }: VideoCardProps) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(video.likes)
  const [commentsCount, setCommentsCount] = useState(video.comments)
  const [showComments, setShowComments] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      if (isVisible && isPlaying) {
        videoRef.current.play().catch(console.error)
      } else {
        videoRef.current.pause()
      }
    }
  }, [isVisible, isPlaying])

  useEffect(() => {
    if (user) {
      checkIfLiked(video.id, user.uid).then(setIsLiked)
    }
  }, [video.id, user])

  useEffect(() => {
    const commentsQuery = query(
      collection(db, 'comments'),
      where('videoId', '==', video.id)
    )

    const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
      setCommentsCount(snapshot.docs.length)
    })

    return () => unsubscribe()
  }, [video.id])

  const handleLike = async () => {
    if (!user) {
      showErrorToast('Please sign in to like videos')
      return
    }

    try {
      const newLikedState = await toggleLike(video.id, user)
      setIsLiked(newLikedState)
      setLikesCount(prev => newLikedState ? prev + 1 : prev - 1)
    } catch (error) {
      showErrorToast('Failed to like video')
    }
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(!isMuted)
    }
  }

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleSignIn = async () => {
    try {
      const user = await signInWithGoogle()
      if (user) {
        showSuccessToast('Welcome to PopReel!')
        navigate('/')
      }
    } catch (error) {
      showErrorToast('Failed to sign in')
      console.error(error)
    }
  }

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="relative">
        <div 
          className={`transform transition-all duration-300 ${
            showComments ? '-translate-x-[225px]' : 'translate-x-0'
          }`}
        >
          <div className="relative w-[90vw] md:w-[450px] aspect-[9/16] bg-dark-900 rounded-xl overflow-hidden shadow-xl">
            <div onClick={togglePlay} className="w-full h-full cursor-pointer">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                loop
                playsInline
                muted={isMuted}
                src={video.url}
              />
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <FiPlay className="text-white text-6xl opacity-80" />
                </div>
              )}
            </div>

            {/* Mute button */}
            <button
              onClick={toggleMute}
              className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors z-10"
            >
              {isMuted ? <FiVolumeX className="text-white" /> : <FiVolume2 className="text-white" />}
            </button>

            {/* Video info overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <div className="flex items-center gap-3 mb-3">
                <Link to={`/profile/${video.userId}`} className="group">
                  <img
                    src={video.userAvatar}
                    alt={video.userName}
                    className="w-10 h-10 rounded-full ring-2 ring-transparent group-hover:ring-primary-500 transition-all"
                  />
                </Link>
                <div>
                  <button
                    onClick={() => navigate(`/profile/${video.userId}`)}
                    className="font-semibold text-white hover:text-primary-500 transition-colors"
                  >
                    {video.userName}
                  </button>
                  <p className="text-sm text-gray-300">{formatTimeAgo(video.createdAt)}</p>
                </div>
              </div>
              <p className="text-white mb-4">{video.caption}</p>
            </div>

            {/* Action buttons */}
            <div className="absolute right-4 bottom-20 flex flex-col gap-4">
              <button
                onClick={handleLike}
                className={`p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors ${
                  isLiked ? 'text-primary-500 fill-current' : 'text-white'
                }`}
              >
                <FiHeart size={24} className={isLiked ? 'fill-current' : ''} />
                <span className="text-xs mt-1">{formatNumber(likesCount)}</span>
              </button>
              <button
                onClick={() => setShowComments(!showComments)}
                className="p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors text-white"
              >
                <FiMessageCircle size={24} />
                <span className="text-xs mt-1">{formatNumber(commentsCount)}</span>
              </button>
            </div>
          </div>
        </div>

        <div
          className={`absolute top-0 left-[calc(60%+0.5rem)] w-[450px] h-full bg-dark-900/95 backdrop-blur-sm
                     rounded-xl shadow-2xl transform transition-all duration-300 border border-white/10
                     ${showComments 
                       ? 'translate-x-0 opacity-100 pointer-events-auto' 
                       : 'translate-x-[50px] opacity-0 pointer-events-none'}`}
        >
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-dark-800/50">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-white">Comments</h3>
                <span className="text-sm text-gray-400">{formatNumber(video.comments)}</span>
              </div>
              <button 
                onClick={() => setShowComments(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <FiX size={20} className="text-white/70 hover:text-white" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <Comments videoId={video.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ActionButton({ icon, label, onClick, active = false }: ActionButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 transition-all ${
        active ? 'text-primary-500' : 'text-white/80 hover:text-white'
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  )
} 