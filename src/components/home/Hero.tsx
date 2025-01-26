import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { signInWithGoogle } from '../../services/firebase'
import { toast } from 'react-hot-toast'
import { FiPlay, FiTrendingUp, FiUsers } from 'react-icons/fi'

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

export default function Hero() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [videoError, setVideoError] = useState(false)

  const handleSignIn = async () => {
    try {
      const user = await signInWithGoogle()
      if (user) {
        toast.success('Welcome to PopReel!')
        navigate('/')
      }
    } catch (error) {
      toast.error('Failed to sign in')
      console.error(error)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      {!videoError && (
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            onError={() => setVideoError(true)}
            className="absolute w-full h-full object-cover scale-125 blur-sm"
          >
            <source src="/hero-background.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-dark-900/80 via-dark-900/90 to-dark-900" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-8xl md:text-9xl font-bold mb-4 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 text-transparent bg-clip-text animate-gradient">
              PopReel
            </h1>
            <p className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-primary-400 to-primary-600 text-transparent bg-clip-text">
              Share Your Story
            </p>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
              Join millions of creators sharing their moments through captivating short videos
            </p>
          </div>

          {!user && (
            <div className="space-y-12 animate-fade-up">
              <div className="flex justify-center">
                <button
                  onClick={handleSignIn}
                  className="group relative overflow-hidden px-8 py-4 bg-primary-500 rounded-xl 
                           transition-all hover:shadow-lg hover:shadow-primary-500/20 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-400 opacity-0 
                                group-hover:opacity-100 transition-opacity" />
                  <span className="relative text-lg font-medium text-white">Get Started</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard
                  icon={<FiPlay />}
                  title="Create"
                  description="Share your moments with stunning vertical videos"
                />
                <FeatureCard
                  icon={<FiTrendingUp />}
                  title="Grow"
                  description="Reach millions of viewers worldwide"
                />
                <FeatureCard
                  icon={<FiUsers />}
                  title="Connect"
                  description="Build your community and engage with fans"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-6 hover:bg-dark-800/70 
                    transition-all hover:shadow-lg hover:shadow-primary-500/5">
      <div className="text-3xl text-primary-500 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
} 