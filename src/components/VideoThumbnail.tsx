import { Video } from '../types'
import { formatNumber } from '../utils/formatters'
import { FiHeart, FiMessageCircle } from 'react-icons/fi'

interface VideoThumbnailProps {
  video: Video
}

export default function VideoThumbnail({ video }: VideoThumbnailProps) {
  return (
    <div className="relative aspect-[9/16] rounded-xl overflow-hidden group">
      <video
        src={video.url}
        className="w-full h-full object-cover"
        playsInline
        muted
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent 
                    opacity-0 group-hover:opacity-100 transition-opacity">
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
  )
} 