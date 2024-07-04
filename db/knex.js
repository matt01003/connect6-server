const knex = require("knex")

const connectedKnex = knex({
  client: "sqlite3",
  connection: {
    filename: "data.db",
  },
})

module.exports = connectedKnex
