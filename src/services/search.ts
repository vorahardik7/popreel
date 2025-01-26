import { db } from './firebase'
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore'
import { Video } from '../types'

export async function searchVideos(searchTerm: string, pageSize = 10) {
  const videosQuery = query(
    collection(db, 'videos'),
    where('caption', '>=', searchTerm),
    where('caption', '<=', searchTerm + '\uf8ff'),
    orderBy('caption'),
    orderBy('createdAt', 'desc'),
    limit(pageSize)
  )

  const snapshot = await getDocs(videosQuery)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Video[]
} 