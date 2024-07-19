const Room = require("./Room")

class Rooms {
  constructor() {
    this.rooms = new Map()
  }

  createRoom(username) {
    const room = new Room(username)
    this.rooms.set(room.roomId, room)
    return { roomId: room.roomId, roomName: room.roomName, status: room.status }
  }

  removeRoom(roomId) {
    this.rooms.delete(roomId)
  }

  getRoom(roomId) {
    return this.rooms.get(roomId)
  }

  getRooms() {
    return Array.from(this.rooms.values(), (room) => ({
      roomId: room.roomId,
      roomName: room.roomName,
      status: room.status,
    }))
  }
}

module.exports = Rooms
