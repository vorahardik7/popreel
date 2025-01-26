import { db } from './firebase'
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc, setDoc, increment, writeBatch } from 'firebase/firestore'
import { User } from 'firebase/auth'

export async function toggleLike(videoId: string, user: User) {
  const videoRef = doc(db, 'videos', videoId)
  const likesRef = doc(db, 'likes', videoId)
  
  const likesDoc = await getDoc(likesRef)
  if (!likesDoc.exists()) {
    await setDoc(likesRef, { users: [] })
  }
  
  const likes = likesDoc.data()?.users || []
  const isLiked = likes.includes(user.uid)
  
  // Use a batch to ensure atomic updates
  const batch = writeBatch(db)
  
  batch.update(likesRef, {
    users: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid)
  })
  
  batch.update(videoRef, {
    likes: increment(isLiked ? -1 : 1)
  })
  
  await batch.commit()
  
  return !isLiked
}

export async function checkIfLiked(videoId: string, userId: string) {
  const likesRef = doc(db, 'likes', videoId)
  const likesDoc = await getDoc(likesRef)
  const likes = likesDoc.data()?.users || []
  return likes.includes(userId)
} 