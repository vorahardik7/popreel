import { db } from './firebase'
import { collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore'
import { User } from 'firebase/auth'
import { Comment } from '../types'

export async function addComment(videoId: string, text: string, user: User) {
  return addDoc(collection(db, 'comments'), {
    videoId,
    text,
    userId: user.uid,
    userName: user.displayName,
    userAvatar: user.photoURL,
    createdAt: Date.now()
  })
}

export async function fetchComments(videoId: string): Promise<Comment[]> {
  const commentsQuery = query(
    collection(db, 'comments'),
    where('videoId', '==', videoId),
    orderBy('createdAt', 'desc')
  )

  const snapshot = await getDocs(commentsQuery)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Comment[]
} 
