import { useState } from 'react'
import { Video } from '../types/index'
import { formatNumber } from '../utils/formatters'
import { FiHeart, FiMessageCircle, FiX } from 'react-icons/fi'
import VideoCard from './video/VideoCard'

interface VideoThumbnailProps {
  video: Video
}

export default function VideoThumbnail({ video }: VideoThumbnailProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <>
      <div 
        onClick={() => setIsPlaying(true)}
        className="relative aspect-[9/16] rounded-xl overflow-hidden group cursor-pointer"
      >
        <img
          src={video.thumbnail}
          alt={video.caption}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-white line-clamp-2 mb-2">{video.caption}</p>
            <div className="flex items-center gap-4 text-sm text-gray-300">
              <span className="flex items-center gap-1">
                <FiHeart /> {formatNumber(video.likes)}
              </span>
              <span className="flex items-center gap-1">
                <FiMessageCircle /> {formatNumber(video.comments)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {isPlaying && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <button 
            onClick={() => setIsPlaying(false)}
            className="absolute top-4 right-4 p-2 text-white hover:text-primary-500"
          >
            <FiX size={24} />
          </button>
          <div className="w-[calc(100vh*9/16)] max-w-3xl">
            <VideoCard video={video} isVisible={true} />
          </div>
        </div>
      )}
    </>
  )
} 