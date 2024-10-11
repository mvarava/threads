export type User = {
  id: string
  email: string
  password: string
  name?: string
  avatarUrl?: string
  dateOfBirth?: Date
  createdAt?: Date
  updatedAt?: Date
  bio?: string
  location?: string
}

export type Post = {
  id: string
  content: string
  author: User
  createdAt?: Date
}

export type Comment = {
  id: string
  content: string
  user: User
  post: Post
  createdAt?: Date
}

export type Like = {
  id: string
  user: User
  post: Post
}

export type Follow = {
  id: string
  follower: User
  following: User
}
