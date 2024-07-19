const express = require("express")
const { Router } = express
const router = Router()

router.get("/lobby", async (req, res) => {
  const rooms = req.app.get("rooms")
  const lobby = { rooms: rooms.getRooms() }
  res.status(200).json({ success: true, lobby })
})

router.get("/lobby/stream", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream")
  res.setHeader("Cache-Control", "no-cache")
  res.setHeader("Access-Control-Allow-Origin", "*")

  const chatEmitter = req.app.get("chatEmitter")

  const messageListener = (msg) => {
    const { event, data } = msg
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
  }
  chatEmitter.on("lobby", messageListener)

  req.on("close", () => {
    chatEmitter.off("lobby", messageListener)
  })
})

module.exports = router
