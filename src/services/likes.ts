import { db } from './firebase'
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc, setDoc } from 'firebase/firestore'
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
  
  await updateDoc(likesRef, {
    users: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid)
  })
  
  await updateDoc(videoRef, {
    likes: isLiked ? likes.length - 1 : likes.length + 1
  })
  
  return !isLiked
}

export async function checkIfLiked(videoId: string, userId: string) {
  const likesRef = doc(db, 'likes', videoId)
  const likesDoc = await getDoc(likesRef)
  const likes = likesDoc.data()?.users || []
  return likes.includes(userId)
} 