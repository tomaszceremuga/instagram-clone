/// <reference path="./types/express.d.ts" />
import express from "express"
import cors from "cors"
import { type Request, type Response, type NextFunction } from 'express';
import { prisma } from "./prisma";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

const app = express()

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}))
app.use(express.json());
app.use(cookieParser());


export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: "unauthorised" });

    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };
        req.userId = payload.userId;
        next();

    } catch (err) {
        res.status(401).json({ error: "unauthorised" });

    }

};


app.get("/", (req, res) => {
    res.send("api is working")

});


app.post("/register", async (req: Request, res: Response) => {
    try {
        const { email, username, password } = req.body;

        if (!email || !username || !password) {
            return res.status(400).json("email, username and password are required ");

        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
            },
        });

        res.status(201).json({
            id: newUser.id,
            email: newUser.email,
            username: newUser.username,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "something went wrong" });

    }
});


app.post("/login", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json("email and password are required ");

        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(401).json("couldn't log in");

        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json("couldn't log in");

        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        )

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        res.status(200).json({
            id: user.id,
            email: user.email,
            username: user.username,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ err: "something went wrong" })

    }

})


app.get("/profile", requireAuth, async (req: Request, res: Response) => {
    res.json({ userId: req.userId });
});


app.listen(4000, () => {
    console.log("Server running on port 4000")

})


