import { Point } from "react-easy-crop"

export type Profile = {
    username: string
    name: string
    avatar: string
    bio: string | null
    isPrivate: boolean
    postsCount: number
    followersCount: number
    followingCount: number
    isFollowed?: boolean
}

export type MiniProfile = {
    username: string
    name: string
    avatar: string
    isPrivate: boolean
    postsCount: number
    followersCount: number
    followingCount: number
    recentPostThumbnails: string[]
    isFollowed: boolean
}

export type Image = {
    fileUrl: string
    outputUrl: string
    zoom: number
    crop: Point
}

export type Post = {
    id: number
    isReel: boolean
    media: string[]
    description: string
    date: Date
    username: string
    avatar: string
    isLiked: boolean
    likesCount: number
    commentsCount: number
    isFollowed: boolean
}

export type Comment = {
    id: number
    username: string
    avatar: string
    content: string
    date?: Date
    likesCount: number
    repliesCount?: number
    isLiked: boolean
}

export type Notification = {
    id: number
    date: Date
    type: string
    url: string
    content: string
    avatar: string
}
