import { db } from './firebase'
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc, setDoc } from 'firebase/firestore'
import { User } from 'firebase/auth'

export async function toggleFollow(targetUserId: string, currentUser: User) {
  const followersRef = doc(db, 'followers', targetUserId)
  const followingRef = doc(db, 'following', currentUser.uid)
  
  // Create documents if they don't exist
  const [followersDoc, followingDoc] = await Promise.all([
    getDoc(followersRef),
    getDoc(followingRef)
  ])
  
  if (!followersDoc.exists()) {
    await setDoc(followersRef, { users: [] })
  }
  if (!followingDoc.exists()) {
    await setDoc(followingRef, { users: [] })
  }
  
  const isFollowing = followingDoc.data()?.users?.includes(targetUserId)
  
  await Promise.all([
    updateDoc(followersRef, { users: isFollowing ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid) }),
    updateDoc(followingRef, { users: isFollowing ? arrayRemove(targetUserId) : arrayUnion(targetUserId) })
  ])
  
  return !isFollowing
} 