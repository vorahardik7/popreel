import { db } from './firebase'
import { collection, addDoc, query, where, getDocs, writeBatch, doc } from 'firebase/firestore'

export async function addHashtags(videoId: string, caption: string) {
  const hashtags = caption.match(/#[\w]+/g) || []
  const uniqueTags = [...new Set(hashtags.map(tag => tag.toLowerCase()))]
  
  const batch = writeBatch(db)
  uniqueTags.forEach(tag => {
    const hashtagRef = doc(collection(db, 'hashtags'))
    batch.set(hashtagRef, {
      tag,
      videoId,
      createdAt: Date.now()
    })
  })
  
  await batch.commit()
  return uniqueTags
} 