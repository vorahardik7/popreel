import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { uploadVideo } from '../../services/video'
import { toast } from 'react-hot-toast'
import { FiUpload, FiX, FiVideo, FiCheck } from 'react-icons/fi'

const MAX_SIZE = 100 * 1024 * 1024 // 100MB
const MAX_DURATION = 60 // 60 seconds

export default function VideoUpload() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [caption, setCaption] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateVideo = async (file: File): Promise<boolean> => {
    if (file.size > MAX_SIZE) {
      setError('Video must be under 100MB')
      return false
    }

    const duration = await getVideoDuration(file)
    if (duration > MAX_DURATION) {
      setError('Video must be under 60 seconds')
      return false
    }

    const { width, height } = await getVideoDimensions(file)
    const aspectRatio = height / width
    if (aspectRatio < 1.6) {
      setError('Video must be in portrait mode (9:16)')
      return false
    }

    return true
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const isValid = await validateVideo(file)
      if (isValid) {
        setFile(file)
        setError(null)
        const url = URL.createObjectURL(file)
        setPreview(url)
      }
    }
  }

  const handleUpload = async () => {
    if (!file || !user) return

    setUploading(true)
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 500)

      await uploadVideo(file, caption, user)
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      toast.success('Video uploaded successfully!')
      navigate('/')
    } catch (error) {
      console.error('Upload failed:', error)
      toast.error('Failed to upload video')
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 to-dark-800 pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-dark-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-white mb-8">Upload Video</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Video Preview */}
            <div className="aspect-[9/16] bg-dark-700 rounded-xl overflow-hidden relative group">
              {preview ? (
                <>
                  <video
                    src={preview}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                  <button
                    onClick={() => {
                      setFile(null)
                      setPreview(null)
                      if (fileInputRef.current) fileInputRef.current.value = ''
                    }}
                    className="absolute top-4 right-4 p-2 bg-dark-900/80 rounded-full 
                             text-white hover:bg-dark-900 transition-colors"
                  >
                    <FiX size={20} />
                  </button>
                </>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer
                                hover:bg-dark-600/20 transition-colors">
                  <FiVideo className="text-4xl text-primary-500 mb-4" />
                  <span className="text-gray-400">Click to upload video</span>
                  <span className="text-sm text-gray-500 mt-2">MP4, MOV (max. 100MB)</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Upload Form */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Caption
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-xl
                           text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500
                           focus:border-transparent transition-all resize-none"
                  placeholder="Write a caption for your video..."
                  rows={4}
                />
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <p className="text-red-400">{error}</p>
                </div>
              )}

              {uploading && (
                <div className="space-y-2">
                  <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-400 text-right">{uploadProgress}%</p>
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="w-full py-4 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-500/50
                         text-white rounded-xl font-medium transition-colors relative group"
              >
                {uploading ? (
                  <span className="flex items-center justify-center gap-2">
                    <FiUpload className="animate-bounce" />
                    Uploading...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    {file ? <FiCheck /> : <FiUpload />}
                    {file ? 'Share Video' : 'Select a Video'}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Utility functions
const getVideoDuration = (file: File): Promise<number> => {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src)
      resolve(video.duration)
    }
    video.src = URL.createObjectURL(file)
  })
}

const getVideoDimensions = (file: File): Promise<{ width: number, height: number }> => {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src)
      resolve({ width: video.videoWidth, height: video.videoHeight })
    }
    video.src = URL.createObjectURL(file)
  })
} 