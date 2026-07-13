import express from "express"
import cors from "cors"
import { type Request, type Response } from 'express';
import { prisma } from "./prisma";

const app = express()

app.use(cors())
app.use(express.json());

app.get("/", (req, res) => {
    res.send("api is working")
})

app.post("/post1", (req: Request, res: Response) => {
    const { text } = req.body;
    console.log(text);

    res.send('Got a POST request');
});

app.post("/test", async (req: Request, res: Response) => {
    try {
        const { title, count, isActive } = req.body;

        if (!title) {
            return res.status(400).json({ error: "title is required" });
        }

        const newTest = await prisma.test.create({
            data: { title, count, isActive },
        });

        res.status(201).json(newTest);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "something went wrong" });

    }
});

app.delete("/test/:id", async (req: Request, res: Response) => {
    try {
        const idParam = req.params.id;

        if (!idParam || Array.isArray(idParam)) {
            return res.status(400).json({ error: "id is required" });
        }

        const id: number = parseInt(idParam);

        const deleteTest = await prisma.test.delete({
            where: { id },
        });

        res.status(200).json(deleteTest);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "something went wrong" });
    }

})

app.listen(4000, () => {
    console.log("Server running on port 4000")
})
