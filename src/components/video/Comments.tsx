import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { addComment, fetchComments } from '../../services/comments'
import { FiSend, FiMessageCircle } from 'react-icons/fi'
import { formatTimeAgo } from '../../utils/formatters'
import type { Comment } from '../../types/index'
import { query, collection, where, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '../../services/firebase'

interface CommentsProps {
  videoId: string
}

export default function Comments({ videoId }: CommentsProps) {
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const commentsQuery = query(
      collection(db, 'comments'),
      where('videoId', '==', videoId),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(commentsQuery, 
      (snapshot) => {
        const newComments = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Comment[]
        setComments(newComments)
        setLoading(false)
      },
      (error) => {
        console.error('Failed to load comments:', error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [videoId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newComment.trim()) return

    setSubmitting(true)
    try {
      await addComment(videoId, newComment.trim(), user)
      setNewComment('')
    } catch (error) {
      console.error('Failed to add comment:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {user && (
        <div className="sticky top-0 bg-dark-900/95 backdrop-blur-sm p-4 border-b border-white/10">
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <img
              src={user.photoURL || ''}
              alt={user.displayName || 'User'}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1 relative">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full px-4 py-2.5 bg-dark-800 rounded-full text-white placeholder-gray-500
                         focus:ring-1 focus:ring-primary-500 focus:outline-none text-sm"
              />
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-primary-500
                         hover:bg-primary-500/10 disabled:text-gray-600 transition-all"
              >
                <FiSend size={16} />
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="px-4 space-y-4">
        {comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-dark-800 flex items-center justify-center mb-4">
              <FiMessageCircle className="text-3xl text-gray-500" />
            </div>
            <p className="text-gray-400 font-medium">No comments yet</p>
            <p className="text-sm text-gray-500">Start the conversation</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="group animate-fade-up">
                <div className="flex gap-3">
                  <img
                    src={comment.userAvatar}
                    alt={comment.userName}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent 
                             group-hover:ring-primary-500/20 transition-all"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white text-sm hover:text-primary-500 
                                     transition-colors cursor-pointer">
                        {comment.userName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mt-1 leading-relaxed">{comment.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 
