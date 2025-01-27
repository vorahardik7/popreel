import { db } from './firebase'
import { doc, getDoc, collection, query, where, getDocs, setDoc, orderBy } from 'firebase/firestore'
import type { Video } from '../types/index'
import { User } from 'firebase/auth'

export async function createUserProfile(user: User) {
  if (!user.uid) return
  
  const userRef = doc(db, 'users', user.uid)
  const userData = {
    uid: user.uid,
    displayName: user.displayName,
    photoURL: user.photoURL,
    email: user.email,
    followers: 0,
    following: 0,
    createdAt: Date.now()
  }
  
  await setDoc(userRef, userData, { merge: true })
  return userData
}

export async function fetchUserProfile(userId: string) {
  const userRef = doc(db, 'users', userId)
  const userDoc = await getDoc(userRef)
  
  if (!userDoc.exists()) {
    // Create profile if it doesn't exist
    const user = await createUserProfile({
      uid: userId,
      displayName: 'User',
      photoURL: null,
      email: null
    } as User)
    return user
  }
  
  return {
    id: userDoc.id,
    ...userDoc.data()
  }
}

export async function fetchUserVideos(userId: string): Promise<Video[]> {
  const videosQuery = query(
    collection(db, 'videos'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )
  
  try {
    const snapshot = await getDocs(videosQuery)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Video[]
  } catch (error: unknown) {
    if ((error as { code?: string }).code === 'failed-precondition') {
      const simpleQuery = query(
        collection(db, 'videos'),
        where('userId', '==', userId)
      )
      const snapshot = await getDocs(simpleQuery)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Video[]
    }
    throw error
  }
}

export async function fetchUserStats(userId: string) {
  const userRef = doc(db, 'users', userId)
  const userDoc = await getDoc(userRef)
  
  const defaultStats = {
    followers: 0,
    following: 0,
    likes: 0,
    videos: 0
  }
  
  if (!userDoc.exists()) {
    return defaultStats
  }
  
  const data = userDoc.data()
  return {
    followers: data.followers ?? 0,
    following: data.following ?? 0,
    likes: data.likes ?? 0,
    videos: data.videos ?? 0
  }
}

export async function fetchLikedVideos(userId: string): Promise<Video[]> {
  const likesQuery = query(collection(db, 'likes'), where('users', 'array-contains', userId))
  const likesSnapshot = await getDocs(likesQuery)
  
  const videoIds = likesSnapshot.docs.map(doc => doc.id)
  
  if (videoIds.length === 0) return []
  
  const videosQuery = query(collection(db, 'videos'), where('__name__', 'in', videoIds))
  const videosSnapshot = await getDocs(videosQuery)
  
  return videosSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Video[]
} 