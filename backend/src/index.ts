import express from "express"
import cors from "cors"

const app = express()

app.use(cors())

app.get("/", (req, res) => {
    res.send("api is working")
})

app.listen(4000, () => {
    console.log("Server running on port 4000")
})
