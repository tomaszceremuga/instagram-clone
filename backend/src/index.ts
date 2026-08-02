/// <reference path="./types/express.d.ts" />

import type { NextFunction, Request, Response } from "express"
import { error } from "console"
import path from "path"
import bcrypt from "bcrypt"
import cookieParser from "cookie-parser"
import cors from "cors"
import express from "express"
import jwt from "jsonwebtoken"

import { uploadAvatar } from "./multerConfig"
import { prisma } from "./prisma"

const app = express()

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    }),
)
app.use(express.json())
app.use(cookieParser())
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")))

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ error: "unauthorised" })
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as {
            userId: number
        }
        req.userId = payload.userId
        next()
    } catch (error) {
        res.status(401).json({ error: "unauthorised" })
    }
}

app.get("/me", requireAuth, async (req: Request, res: Response) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ error: "unauthorised" })
        }

        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: { id: true, username: true, avatar: true },
        })

        if (!user) {
            res.status(404).json({ error: "user not found" })
        }

        res.status(200).json(user)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "something went wrong" })
    }
})

app.post("/register", async (req: Request, res: Response) => {
    try {
        const { email, username, password, name, birthDate } = req.body

        if (!email || !username || !password || !name || !birthDate) {
            return res.status(400).json({ error: "missing required data" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const defaultAvatar = "http://localhost:4000/uploads/avatars/default-avatar.jpg"

        const newUser = await prisma.user.create({
            data: {
                email,
                username,
                name,
                birthDate,
                password: hashedPassword,
                avatar: defaultAvatar,
            },
        })

        res.status(201).json({
            id: newUser.id,
            email: newUser.email,
            username: newUser.username,
            name: newUser.name,
            birthDate: birthDate,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "something went wrong" })
    }
})

app.post("/login", async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body

        if (!username || !password) {
            return res.status(400).json({ error: "username and password are required" })
        }

        const user = await prisma.user.findUnique({ where: { username } })

        if (!user) {
            return res.status(401).json({ error: "couldn't log in" })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({ error: "couldn't log in" })
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
            expiresIn: "7d",
        })

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        res.status(200).json({
            id: user.id,
            email: user.email,
            username: user.username,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "something went wrong" })
    }
})

app.post("/logout", requireAuth, async (req: Request, res: Response) => {
    try {
        res.clearCookie("token", { httpOnly: true })
        res.status(200).json({ message: "logged out" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "something went wrong" })
    }
})

app.get("/check-username/:username", async (req: Request, res: Response) => {
    try {
        const usernameParam = req.params.username

        if (!usernameParam || Array.isArray(usernameParam)) {
            return res.status(400).json({ error: "username is required" })
        }

        const isExisting = await prisma.user.findUnique({
            where: { username: usernameParam },
        })

        res.status(200).json({ available: !isExisting })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "something went wrong" })
    }
})

app.get("/get-profile/:username", async (req: Request, res: Response) => {
    try {
        const usernameParam = req.params.username

        if (!usernameParam || Array.isArray(usernameParam)) {
            return res.status(400).json({ error: "username is required" })
        }

        const user = await prisma.user.findUnique({
            where: { username: usernameParam },
            include: {
                _count: {
                    select: {
                        posts: true,
                        followers: true,
                        following: true,
                    },
                },
            },
        })

        if (!user) {
            return res.status(404).json({ error: "user not found" })
        }

        res.status(200).json({
            username: user?.username,
            name: user?.name,
            avatar: user?.avatar,
            bio: user?.bio,
            postsCount: user._count.posts,
            followersCount: user._count.followers,
            followingCount: user._count.following,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "something went wrong" })
    }
})

app.post("/follow/:username", requireAuth, async (req: Request, res: Response) => {
    try {
        const usernameParam = req.params.username

        if (!usernameParam || Array.isArray(usernameParam)) {
            return res.status(400).json({ error: "username is required" })
        }

        if (!req.userId) {
            return res.status(401).json({ error: "unauthorised" })
        }

        const userToFollow = await prisma.user.findUnique({
            where: { username: usernameParam },
        })

        if (!userToFollow) {
            return res.status(404).json({ error: "user not found" })
        }

        if (userToFollow.id === req.userId) {
            return res.status(400).json({ error: "you cannot follow yourself" })
        }

        // const isExisting = await prisma.user.findUnique({
        //     where: { username: usernameParam },
        // })
        const follow = await prisma.follow.create({
            data: {
                followerId: req.userId,
                followingId: userToFollow.id,
            },
        })

        res.status(201).json(follow)
    } catch (error) {
        res.status(500).json({ error: "something went wrong" })
    }
})

app.post("/unfollow/:username", requireAuth, async (req: Request, res: Response) => {
    try {
        const usernameParam = req.params.username

        if (!req.userId) {
            return res.status(401).json({ error: "unauthorised" })
        }

        if (!usernameParam || Array.isArray(usernameParam)) {
            return res.status(400).json({ error: "username is required" })
        }

        const userToUnfollow = await prisma.user.findUnique({
            where: { username: usernameParam },
        })

        if (!userToUnfollow) {
            return res.status(404).json({ error: "user not found" })
        }

        if (userToUnfollow.id === req.userId) {
            return res.status(400).json({ error: "you cannot follow yourself" })
        }

        const unfollow = await prisma.follow.delete({
            where: {
                followerId_followingId: {
                    followerId: req.userId,
                    followingId: userToUnfollow.id,
                },
            },
        })

        res.status(200).json(unfollow)
    } catch (error) {
        res.status(500).json({ error: "something went wrong" })
    }
})

app.get("/check-follow/:followedUsername", requireAuth, async (req: Request, res: Response) => {
    try {
        const followedUserneme = req.params.followedUsername

        if (!req.userId) {
            return res.status(401).json({ error: "unauthorised" })
        }

        if (!followedUserneme || Array.isArray(followedUserneme)) {
            return res.status(400).json({ error: "following param is required" })
        }

        const followed = await prisma.user.findUnique({
            where: { username: followedUserneme },
        })

        if (!followed || followed?.id === req.userId) {
            return res.status(200).json({ isFollowed: false })
        }

        const isFollowed = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: req.userId,
                    followingId: followed.id,
                },
            },
        })

        res.status(200).json({ isFollowed: Boolean(isFollowed) })
    } catch (error) {
        res.status(500).json({ error: "something went wrong" })
    }
})

app.get("/users/:username/:type", requireAuth, async (req: Request, res: Response) => {
    try {
        const username = req.params.username
        const type = req.params.type

        if (!req.userId) {
            return res.status(401).json({ error: "unauthorised" })
        }

        if (!username || Array.isArray(username)) {
            return res.status(400).json({ error: "username is required" })
        }

        if (!type || Array.isArray(type) || (type !== "followers" && type !== "following")) {
            return res.status(400).json({ error: "please enter correct type" })
        }

        const user = await prisma.user.findUnique({
            where: { username: username },
        })

        if (!user) {
            return res.status(404).json({ error: "user not found" })
        }

        const cursorParam = req.query.cursor as string | undefined
        const pageSize = 12

        const searchValue = req.query.searchValue as string | undefined

        const whereClause = {
            ...(type === "followers" ? { followingId: user.id } : { followerId: user.id }),
            ...(searchValue && {
                [type === "followers" ? "follower" : "following"]: {
                    username: { contains: searchValue, mode: "insensitive" },
                },
            }),
        }

        const includeClaue =
            type === "followers"
                ? {
                      follower: {
                          select: { id: true, username: true, avatar: true, name: true },
                      },
                  }
                : {
                      following: {
                          select: { id: true, username: true, avatar: true, name: true },
                      },
                  }

        const follows = await prisma.follow.findMany({
            where: whereClause,
            include: includeClaue,
            take: pageSize,
            ...(cursorParam && {
                skip: 1,
                cursor: { id: Number(cursorParam) },
            }),
            orderBy: { createdAt: "desc" },
        })

        const users = follows.map((follow) =>
            type === "followers" ? (follow as any).follower : (follow as any).following,
        )

        const userIds = users.map((user) => user.id)

        const myFollows = await prisma.follow.findMany({
            where: {
                followerId: req.userId,
                followingId: { in: userIds },
            },
        })

        const followedIds = new Set(myFollows.map((follow) => follow.followingId))

        const result = users.map((user) => ({
            ...user,
            isFollowed: followedIds.has(user.id),
        }))

        const lastItem = follows[follows.length - 1]
        const nextCursor = follows.length === pageSize ? lastItem?.id : null

        res.status(200).json({
            users: result,
            nextCursor,
            myFollows: myFollows,
            followedIds: followedIds,
            userIds: userIds,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "something went wrong" })
    }
})

app.post(
    "/upload/avatar",
    requireAuth,
    uploadAvatar.single("avatar"),
    async (req: Request, res: Response) => {
        try {
            if (!req.userId) {
                return res.status(401).json({ error: "unauthorised" })
            }

            if (!req.file) {
                return res.status(400).json({ error: "no file uploaded or invalid file type" })
            }

            const avatarUrl = `http://localhost:4000/uploads/avatars/${req.file.filename}`

            const updatedUser = await prisma.user.update({
                where: { id: req.userId },
                data: { avatar: avatarUrl },
            })

            res.status(200).json({ avatar: updatedUser.avatar })
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: "something went wrong" })
        }
    },
)

app.post("/delete/avatar", requireAuth, async (req: Request, res: Response) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ error: "unauthorised" })
        }

        const defaultAvatar = "http://localhost:4000/uploads/avatars/default-avatar.jpg"

        const updatedUser = await prisma.user.update({
            where: { id: req.userId },
            data: { avatar: defaultAvatar },
        })

        res.status(200).json({ avatar: updatedUser.avatar })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "something went wrong" })
    }
})

app.listen(4000, () => {
    console.log("Server running on port 4000")
})
