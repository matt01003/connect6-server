const EventEmitter = require("events")

class Room {
  constructor() {
    this.rooms = new Map()
  }

  createRoom(roomId, username) {
    const emitter = new EventEmitter()
    this.rooms.set(roomId, {
      emitter,
      roomName: `#${roomId.slice(0, 4)} - ${username}`,
      roomId: roomId,
      players: {},
      game: {
        board: [...Array(19)].map((_) => Array(19).fill(".")),
        currentPlayer: "x",
        round: 0,
      },
      status: "waiting",
    })
  }

  removeRoom(roomId) {
    this.rooms.delete(roomId)
  }

  getRoom(roomId) {
    return this.rooms.get(roomId)
  }

  getRooms() {
    return Array.from(this.rooms.values()).map((e) => ({
      roomId: e.roomId,
      roomName: e.roomName,
      status: e.status,
    }))
  }

  addClientToRoom(roomId, user) {
    const room = this.getRoom(roomId)
    const playersCount = Object.values(room.players).length
    if (playersCount === 0) {
      room.players[user.id] = { ...user }
      return "player"
    } else if (playersCount === 1) {
      room.players[user.id] = { ...user }
      const coinFlip = Math.floor(Math.random() * 2)
      Object.keys(room.players).forEach((e, i) => {
        room.players[e].type = coinFlip === i ? "x" : "o"
      })
      room.status = "in game"
      return "player"
    } else {
      room.players[user.id] = { ...user, type: "audience" }
      return "audience"
    }
  }
}

module.exports = Room
