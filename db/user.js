const knex = require("./knex")

const createUser = async (user) => {
  return await knex("User").insert(user)
}

const getUserByName = async (username) => {
  return await knex("User").where("username", username)
}

const getUserById = async (userId) => {
  return await knex("User").where("id", userId)
}

module.exports = { createUser, getUserByName, getUserById }
