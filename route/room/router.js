const express = require("express")
const { Router } = express
const router = Router()
const HttpError = require("../../utils/httpError")
const { getUserById } = require("../../db/user")

router.post("/rooms", (req, res) => {
  const chatEmitter = req.app.get("chatEmitter")
  const rooms = req.app.get("rooms")
  const { username } = req.body

  const room = rooms.createRoom(username)
  chatEmitter.emit("lobby", {
    event: "create room",
    data: room,
  })

  res.status(200).json({ success: true, room })
})

router.get("/rooms/:roomId", (req, res) => {
  const rooms = req.app.get("rooms")
  const { roomId } = req.params
  const room = rooms.getRoom(roomId)

  res.status(200).json({ success: true, room: room.toJson() })
})

router.post("/rooms/:roomId/member", async (req, res) => {
  const { userId } = req.body
  const { roomId } = req.params
  const rooms = req.app.get("rooms")
  const room = rooms.getRoom(roomId)

  const [user] = await getUserById(userId)
  const { password: _, ...userData } = user
  room.addPlayer(userData)
  res.status(200).json({ success: true })
})

router.get("/rooms/:roomId/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream")
  res.setHeader("Cache-Control", "no-cache")
  res.setHeader("Access-Control-Allow-Origin", "*")
  const { roomId } = req.params
  const rooms = req.app.get("rooms")
  const room = rooms.getRoom(roomId)

  const messageListener = (msg) => {
    const { event, data } = msg
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
  }
  room.on("room", messageListener)
  req.on("close", () => {
    room.off("room", messageListener)
  })
})

router.post("/rooms/:roomId/move", (req, res) => {
  const { roomId } = req.params
  const { move } = req.body
  const rooms = req.app.get("rooms")
  const room = rooms.getRoom(roomId)

  room.updateBoard(move)
  res.status(200).json({ success: true })
})

// router.get("/room/:roomId/:userId", async (req, res) => {

//   const { roomId, userId } = req.params
//   const rooms = req.app.get("rooms")
//   const chatEmitter = req.app.get("chatEmitter")

//   const [user] = await getUserById(userId)
//   const { password, ...userData } = user
//   const clientType = rooms.addClientToRoom(roomId, userData)
//   const { emitter: roomEmitter, ...room } = rooms.getRoom(roomId)

//   const messageListener = (msg) => {
//     const { type, ...data } = msg
//     res.write(`event: ${type}\ndata: ${JSON.stringify(data)}\n\n`)
//   }
//   roomEmitter.on("message", messageListener)
//   roomEmitter.emit("message", { type: "room update", room })

//   req.on("close", () => {
//     delete room.players[userId]
//     if (Object.keys(room.players).length === 0) {
//       rooms.removeRoom(roomId)
//       chatEmitter.emit("lobby", { rooms: rooms.getRooms() })
//     }
//     roomEmitter.off("message", messageListener)
//   })
// })

// router.post("/room/:roomId/game_move", (req, res) => {
//   const rooms = req.app.get("rooms")
//   const { roomId } = req.params
//   const { move } = req.body

//   const room = rooms.getRoom(roomId)
//   const updatedState = updateGameState(room.game, move)

//   if (checkGameover(room.game.board, move.chess)) {
//     room.status = "game over"
//     room.game.currentPlayer = null
//     const { emitter: roomEmitter, ...roomDetail } = room
//     roomEmitter.emit("message", { type: "room update", room: roomDetail })
//   } else {
//     room.emitter.emit("message", { type: "game update", game: updatedState })
//   }

//   res.status(200).json({ success: true })
// })

module.exports = router
