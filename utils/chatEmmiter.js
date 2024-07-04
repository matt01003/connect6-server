const EventEmitter = require("events")

const chatEmitter = {
  emitter: new EventEmitter(),

  on(event, listener) {
    this.emitter.on(event, listener)
  },

  off(event, listener) {
    this.emitter.off(event, listener)
  },

  emit(event, data) {
    this.emitter.emit(event, data)
  },
}

module.exports = chatEmitter
