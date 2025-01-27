export interface User {
  id: string
  name: string
  email: string
  photoURL: string
}

export interface Comment {
  id: string
  text: string
  userId: string
  userName: string
  userAvatar: string
  createdAt: number
}

export interface Video {
  id: string
  url: string
  thumbnail: string
  caption: string
  userId: string
  userName: string
  userAvatar: string
  likes: number
  comments: number
  createdAt: number
  duration: number
  format: string
  height: number
  width: number
}

export interface UserProfile {
  uid: string
  displayName: string
  photoURL: string
  email: string
  followers: number
  following: number
  createdAt: number
} 