/// <reference path="./types/express.d.ts" />

import type { NextFunction, Request, Response } from "express"
import path from "path"
import bcrypt from "bcrypt"
import cookieParser from "cookie-parser"
import cors from "cors"
import express from "express"
import jwt from "jsonwebtoken"

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
    } catch (err) {
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
    } catch (err) {
        console.error(err)
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
    } catch (err) {
        console.error(err)
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
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "something went wrong" })
    }
})

app.post("/logout", requireAuth, async (req: Request, res: Response) => {
    try {
        res.clearCookie("token", { httpOnly: true })
        res.status(200).json({ message: "logged out" })
    } catch (err) {
        console.error(err)
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
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "something went wrong" })
    }
})

// app.get("/get-profile/:username", async (req: Request, res: Response) =>{
//     try {
//         const usernameParam = req.params.username
//
//         if (!usernameParam || Array.isArray(usernameParam)) {
//             return res.status(400).json({ error: "username is required" })
//         }
//
//         const profileData = await prisma.user.findUnique({
//             where: {username: usernameParam}
//         })
//
//         res.status(200).json({ username: profileData?.username,
//             name: profileData?.name,
//             bio:profileData?.bio,
//             avatar: profileData.avatar,
//         })
//     }
// } )

app.listen(4000, () => {
    console.log("Server running on port 4000")
})
