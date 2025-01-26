const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/video/upload`

export async function uploadToCloudinary(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
  formData.append('resource_type', 'video')

  try {
    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Cloudinary error:', error)
      throw new Error(error.message || 'Upload failed')
    }

    const data = await response.json()
    return {
      url: data.secure_url,
      thumbnail: data.thumbnail_url || data.secure_url,
      duration: Math.round(data.duration || 0),
      format: data.format,
      height: data.height,
      width: data.width
    }
  } catch (error) {
    console.error('Upload error:', error)
    throw error
  }
} 