import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../context/AuthContext'
import { FiLoader } from 'react-icons/fi'
import VideoCard from './VideoCard'
import type { Video } from '../../types/index'
import { fetchVideos } from '../../services/video'

export default function VideoFeed() {
  const { user } = useAuth()
  const [videos, setVideos] = useState<Video[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [slideDirection, setSlideDirection] = useState<'up' | 'down' | null>(null)
  const [showComments, setShowComments] = useState(false)

  const loadVideos = async () => {
    try {
      const { videos: fetchedVideos } = await fetchVideos(10)
      setVideos(fetchedVideos)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadVideos()
  }, [])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' && currentIndex < videos.length - 1) {
      setSlideDirection('down')
      setCurrentIndex(prev => prev + 1)
      setShowComments(false)
    } else if (e.key === 'ArrowUp' && currentIndex > 0) {
      setSlideDirection('up')
      setCurrentIndex(prev => prev - 1)
      setShowComments(false)
    }
  }, [currentIndex, videos.length])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-dark-900">
        <FiLoader className="animate-spin text-4xl text-primary-500" />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 top-20 flex items-center justify-center bg-dark-900 overflow-hidden">
      {videos.map((video, index) => (
        <div
          key={video.id}
          className={`absolute transition-all duration-500 ${
            getSlideAnimation(index, currentIndex, slideDirection)
          }`}
        >
          <VideoCard 
            video={video} 
            isVisible={index === currentIndex && !slideDirection?.includes('left') && !slideDirection?.includes('right')} 
            showComments={showComments}
            setShowComments={setShowComments}
          />
        </div>
      ))}
    </div>
  )
}

function getSlideAnimation(
  index: number, 
  currentIndex: number, 
  slideDirection: string | null
) {
  if (slideDirection?.includes('left') || slideDirection?.includes('right')) {
    return `transform transition-all duration-500 ${
      'translate-x-0 opacity-100'
    }`
  }

  return index === currentIndex 
    ? 'opacity-100 z-10 translate-y-0' 
    : index < currentIndex
      ? 'opacity-0 -z-10 -translate-y-full'
      : 'opacity-0 -z-10 translate-y-full'
} 