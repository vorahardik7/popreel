import { db } from './firebase'
import { collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore'
import { User } from 'firebase/auth'

export async function createNotification(type: 'like' | 'comment' | 'follow', targetUserId: string, sourceUser: User, videoId?: string) {
  await addDoc(collection(db, 'notifications'), {
    type,
    targetUserId,
    sourceUserId: sourceUser.uid,
    sourceUserName: sourceUser.displayName,
    sourceUserAvatar: sourceUser.photoURL,
    videoId,
    createdAt: Date.now(),
    read: false
  })
} 