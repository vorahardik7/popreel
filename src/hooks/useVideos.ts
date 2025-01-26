import { useState, useEffect } from 'react'
import { fetchVideos, Video } from '../services/video'

export function useVideos() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const fetchedVideos = await fetchVideos()
        setVideos(fetchedVideos)
      } catch (err) {
        setError('Failed to load videos')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadVideos()
  }, [])

  return { videos, loading, error }
} 