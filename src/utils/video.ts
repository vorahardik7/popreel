export function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src)
      resolve(video.duration)
    }
    
    video.onerror = () => {
      reject('Error loading video')
    }
    
    video.src = URL.createObjectURL(file)
  })
}

export function getVideoDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src)
      resolve({
        width: video.videoWidth,
        height: video.videoHeight
      })
    }
    
    video.onerror = () => {
      reject('Error loading video')
    }
    
    video.src = URL.createObjectURL(file)
  })
}

export function generateVideoThumbnail(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    
    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
    }
    
    video.onseeked = () => {
      if (!context) return reject('Canvas context not available')
      
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      const thumbnail = canvas.toDataURL('image/jpeg', 0.7)
      window.URL.revokeObjectURL(video.src)
      resolve(thumbnail)
    }
    
    video.onerror = () => {
      reject('Error loading video')
    }
    
    video.src = URL.createObjectURL(file)
    video.currentTime = 1 // Capture frame at 1 second
  })
} 