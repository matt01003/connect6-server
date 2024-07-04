const express = require("express")
const { Router } = express
const router = Router()
const { v4: uuidv4 } = require("uuid")
const HttpError = require("../../utils/httpError")
const { updateGameState, checkGameover } = require("../../utils/game")
const { getUserById } = require("../../db/user")

router.post("/room/new", (req, res) => {
  const chatEmitter = req.app.get("chatEmitter")
  const rooms = req.app.get("rooms")
  const { username } = req.body

  const roomId = uuidv4()
  rooms.createRoom(roomId, username)
  chatEmitter.emit("lobby", { rooms: rooms.getRooms() })

  res.status(200).json({ success: true, roomId })
})

router.get("/room/:roomId/:userId", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream")
  res.setHeader("Cache-Control", "no-cache")
  res.setHeader("Access-Control-Allow-Origin", "*")
  const { roomId, userId } = req.params
  const rooms = req.app.get("rooms")
  const chatEmitter = req.app.get("chatEmitter")

  const [user] = await getUserById(userId)
  const { password, ...userData } = user
  const clientType = rooms.addClientToRoom(roomId, userData)
  const { emitter: roomEmitter, ...room } = rooms.getRoom(roomId)

  const messageListener = (msg) => {
    const { type, ...data } = msg
    res.write(`event: ${type}\ndata: ${JSON.stringify(data)}\n\n`)
  }
  roomEmitter.on("message", messageListener)
  roomEmitter.emit("message", { type: "room update", room })

  req.on("close", () => {
    delete room.players[userId]
    if (Object.keys(room.players).length === 0) {
      rooms.removeRoom(roomId)
      chatEmitter.emit("lobby", { rooms: rooms.getRooms() })
    }
    roomEmitter.off("message", messageListener)
  })
})

router.post("/room/:roomId/game_move", (req, res) => {
  const rooms = req.app.get("rooms")
  const { roomId } = req.params
  const { move } = req.body

  const room = rooms.getRoom(roomId)
  const updatedState = updateGameState(room.game, move)

  if (checkGameover(room.game.board, move.chess)) {
    room.status = "game over"
    room.game.currentPlayer = null
    const { emitter: roomEmitter, ...roomDetail } = room
    roomEmitter.emit("message", { type: "room update", room: roomDetail })
  } else {
    room.emitter.emit("message", { type: "game update", game: updatedState })
  }

  res.status(200).json({ success: true })
})

module.exports = router
