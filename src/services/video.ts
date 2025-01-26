import { db } from './firebase'
import { collection, addDoc, query, orderBy, limit, getDocs, startAfter, where } from 'firebase/firestore'
import { User } from 'firebase/auth'
import { uploadToCloudinary } from './cloudinary'
import { Video } from '../types/index'  // Only import, remove the interface definition

export async function uploadVideo(file: File, caption: string, user: User) {
  try {
    // Upload to Cloudinary
    const cloudinaryData = await uploadToCloudinary(file)

    // Store video metadata in Firestore
    const videoDoc = await addDoc(collection(db, 'videos'), {
      url: cloudinaryData.url,
      thumbnail: cloudinaryData.thumbnail,
      caption,
      userId: user.uid,
      likes: 0,
      comments: 0,
      createdAt: Date.now(),
      duration: cloudinaryData.duration,
      format: cloudinaryData.format,
      height: cloudinaryData.height,
      width: cloudinaryData.width
    })

    return videoDoc.id
  } catch (error) {
    console.error('Upload error:', error)
    throw error
  }
}

export async function fetchVideos(pageSize = 5, lastDoc: any = null) {
  try {
    let videosQuery = query(
      collection(db, 'videos'),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    )

    if (lastDoc) {
      videosQuery = query(
        collection(db, 'videos'),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(pageSize)
      )
    }

    const snapshot = await getDocs(videosQuery)
    console.log('Fetched videos:', snapshot.docs.length) // Debug log
    const lastVisible = snapshot.docs[snapshot.docs.length - 1]
    
    const videos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Video[]

    return { videos, lastVisible }
  } catch (error) {
    console.error('Error fetching videos:', error)
    throw error
  }
}

export async function fetchUserVideos(userId: string) {
  const videosQuery = query(
    collection(db, 'videos'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )

  const snapshot = await getDocs(videosQuery)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Video[]
} 