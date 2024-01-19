import express from "express"
const app = express()

app.use(express.json())


import pollRoute from "./routes/poll.routes.js"

app.use("/api",pollRoute)

export {app}