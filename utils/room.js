const EventEmitter = require("events")
const { v4: uuidv4 } = require("uuid")
const Connect6 = require("./Connect6")

class Room extends EventEmitter {
  constructor(username) {
    super()
    this.roomId = uuidv4()
    this.roomName = `#${this.roomId.slice(0, 4)} - ${username}`
    this.players = {}
    this.game = new Connect6()
    this.status = "waiting"
    this.message = []
  }

  addPlayer(user) {
    this.players[user.id] = { ...user }
    if (Object.values(this.players).length === 2) {
      const coinFlip = Math.floor(Math.random() * 2)
      Object.keys(this.players).forEach((id, index) => {
        this.players[id].type = coinFlip === index ? "x" : "o"
      })

      this.status = "in game"
      this.emit("room", { event: "room update", data: this.toJson() })
      const message = `${user.username} has joined`
      this.message.push(message)
      this.emit("room", {
        event: "room message",
        data: { message },
      })
    }
  }

  getPlayerType(playerId) {
    return this.players[playerId]?.type || null
  }

  updateBoard(move) {
    const gameUpdate = this.game.makeMove(move)
    this.emit("room", { event: "game update", data: gameUpdate })
  }

  toJson() {
    return {
      roomId: this.roomId,
      roomName: this.roomName,
      players: this.players,
      game: this.game.toJson(),
      status: this.status,
      message: this.message,
    }
  }

  // Add other game-related methods here
}

module.exports = Room
