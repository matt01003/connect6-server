const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const { v4: uuidv4 } = require("uuid")

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(cookieParser())

const roomRouter = require("./route/room/router")
const chatEmitter = require("./utils/chatEmmiter")
const authRouter = require("./Authentication/router")
const HttpError = require("./utils/httpError")
const Room = require("./utils/room")
const { getUserById } = require("./db/user")

app.set("chatEmitter", chatEmitter)
app.set("rooms", new Room())
app.set("clients", new Map())

app.use(authRouter)
app.use(roomRouter)

app.get("/steam/:userId", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream")
  res.setHeader("Cache-Control", "no-cache")
  res.setHeader("Access-Control-Allow-Origin", "*")

  const { userId } = req.params
  const rooms = req.app.get("rooms")
  const clients = req.app.get("clients")
  const chatEmitter = req.app.get("chatEmitter")

  const [user] = await getUserById(userId)

  clients.set(user.id, { userId: user.id, name: user.username, roomId: null })

  console.log("client join: ", user.username)
  const messageListener = (msg) => {
    res.write(`event: lobby\ndata: ${JSON.stringify(msg)}\n\n`)
  }
  chatEmitter.on("lobby", messageListener)
  chatEmitter.emit("lobby", {
    rooms: rooms.getRooms(),
    clients: Array.from(clients.values()),
  })

  req.on("close", () => {
    console.log("client left: ", user.username)
    chatEmitter.off("lobby", messageListener)
    clients.delete(user.id)
    chatEmitter.emit("lobby", {
      clients: Array.from(clients.values()),
    })
  })
})

app.all("*", (req, res, next) => {
  const err = new HttpError(404, "not found")
  next(err)
})

app.use((error, req, res, next) => {
  const { statusCode, message } = error
  console.log("***", error)
  res.status(statusCode || 500).json({ message })
})

const port = 8000
app.listen(port, () => console.log(`Server is running on port ${port}`))
