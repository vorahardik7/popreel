import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchUserVideos, fetchUserStats, fetchUserProfile, fetchLikedVideos } from '../services/user'
import { Video } from '../types/index'
import EditProfileModal from '../components/profile/EditProfileModal'
import { FiVideo, FiHeart } from 'react-icons/fi'
import TabButton from '../components/TabButton'
import LoadingGrid from '../components/LoadingGrid'
import VideoThumbnail from '../components/VideoThumbnail'
import StatCard from '../components/StatCard'
import Navbar from '../components/layout/Navbar'

export default function Profile() {
  const { user } = useAuth()
  const { userId } = useParams()
  const navigate = useNavigate()
  const [videos, setVideos] = useState<Video[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({ followers: 0, following: 0, likes: 0, videos: 0 })
  const [activeTab, setActiveTab] = useState('videos')
  const [loading, setLoading] = useState(true)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [likedVideos, setLikedVideos] = useState<Video[]>([])

  const isOwnProfile = !userId || (user && userId === user.uid)

  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (!user && !userId) {
          navigate('/')
          return
        }

        const targetUserId = isOwnProfile ? user?.uid : userId
        if (!targetUserId) return

        const [userVideos, userStats, userProfile, userLikedVideos] = await Promise.all([
          fetchUserVideos(targetUserId),
          fetchUserStats(targetUserId),
          !isOwnProfile ? fetchUserProfile(targetUserId) : null,
          isOwnProfile ? fetchLikedVideos(targetUserId) : Promise.resolve([])
        ])
        
        setVideos(userVideos)
        setLikedVideos(userLikedVideos)
        setStats({
          ...userStats,
          videos: userVideos.length
        })

        if (!isOwnProfile && userProfile) {
          setProfile(userProfile)
        }
      } catch (error) {
        console.error('Failed to load user data:', error)
        navigate('/')
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [user, userId, isOwnProfile, navigate])

  useEffect(() => {
    if (!user && !userId) {
      navigate('/')
    }
  }, [user, userId, navigate])

  if (loading) {
    return (
      <>
        <Navbar />
        <LoadingGrid />
      </>
    )
  }
  
  if (!user && !profile) return null

  const displayUser = isOwnProfile ? user : profile

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-dark-900 to-dark-800">
        <div className="max-w-5xl mx-auto px-4 py-24">
          <div className="bg-dark-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <div className="relative group">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden ring-4 ring-primary-500/20">
                  <img 
                    src={displayUser?.photoURL || ''} 
                    alt={displayUser?.displayName || 'User'}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                  <h1 className="text-3xl font-bold text-white">{displayUser?.displayName}</h1>
                  {isOwnProfile && (
                    <button 
                      onClick={() => setShowEditProfile(true)} 
                      className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl 
                               transition-all hover:shadow-lg hover:shadow-primary-500/20"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-4 bg-dark-700/50 rounded-xl">
                  <StatCard label="Followers" value={stats.followers} />
                  <StatCard label="Following" value={stats.following} />
                  <StatCard label="Likes" value={stats.likes} />
                  <StatCard label="Videos" value={stats.videos} />
                </div>
              </div>
            </div>

            <div className="mt-12">
              <div className="flex justify-center md:justify-start gap-8 mb-8">
                <TabButton 
                  active={activeTab === 'videos'} 
                  onClick={() => setActiveTab('videos')}
                  icon={<FiVideo />}
                  label="Videos"
                />
                {isOwnProfile && (
                  <TabButton 
                    active={activeTab === 'liked'} 
                    onClick={() => setActiveTab('liked')}
                    icon={<FiHeart />}
                    label="Liked"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {activeTab === 'videos' && videos.map((video) => (
                  <VideoThumbnail key={video.id} video={video} />
                ))}
                {activeTab === 'liked' && likedVideos.map((video) => (
                  <VideoThumbnail key={video.id} video={video} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isOwnProfile && (
        <EditProfileModal isOpen={showEditProfile} onClose={() => setShowEditProfile(false)} />
      )}
    </>
  )
} 