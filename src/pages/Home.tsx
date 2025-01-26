import { useAuth } from '../context/AuthContext'
import Hero from '../components/home/Hero'
import VideoFeed from '../components/video/VideoFeed'
import Navbar from '../components/layout/Navbar'
import { Suspense } from 'react'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) {
    return null 
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Navbar />
      <div className="min-h-screen">
        {!user ? <Hero /> : (
          <div className="pt-16">
            <VideoFeed />
          </div>
        )}
      </div>
    </Suspense>
  )
} 