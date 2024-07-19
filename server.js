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
const lobbyRouter = require("./route/lobby/router")
const chatEmitter = require("./utils/chatEmmiter")
const authRouter = require("./Authentication/router")
const HttpError = require("./utils/httpError")
const Rooms = require("./utils/Rooms")

app.set("chatEmitter", chatEmitter)
app.set("rooms", new Rooms())
app.set("clients", new Map())

app.use(authRouter)
app.use(roomRouter)
app.use(lobbyRouter)

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
