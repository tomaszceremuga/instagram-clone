import express from "express"
import cors from "cors"
import { type Request, type Response } from 'express';

const app = express()

app.use(cors())
app.use(express.json());

app.get("/", (req, res) => {
    res.send("api is working")
})

app.post('/post1', (req: Request, res: Response) => {
    const { text } = req.body;
    console.log(text);
    // res.json()

    res.send('Got a POST request');
});

app.listen(4000, () => {
    console.log("Server running on port 4000")
})
