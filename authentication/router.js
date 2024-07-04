const { Router } = require("express")
const bcrypt = require("bcrypt")
const { toJWT } = require("./jwt")
const { createUser, getUserByName } = require("../db/user")
const { v4: uuidv4 } = require("uuid")
const HttpError = require("../utils/httpError")

const router = new Router()

router.post("/login", async (req, res, next) => {
  const { password, username } = req.body
  if (!password || !username) {
    throw new HttpError(400, "Please provide valid credentials to login.")
  }

  try {
    const [user] = await getUserByName(username)
    if (!user) throw new HttpError(401, "invalid user")

    if (bcrypt.compareSync(req.body.password, user.password)) {
      const { password, ...userData } = user
      res
        .status(200)
        .json({
          success: true,
          data: {
            message: "login success",
            jwt: toJWT({ userId: user.id }),
            ...userData,
          },
        })
        .end()
    } else {
      throw new HttpError(401, "invalid password")
    }
  } catch (error) {
    next(error)
  }
})

router.post("/register", async (req, res, next) => {
  const { username } = req.body
  if (!username || !req.body.password) {
    throw new HttpError(400, "invalid information to sign up ")
  }

  try {
    const uuid = uuidv4()
    const user = await getUserByName(username)

    if (user.length > 0) throw new HttpError(400, "invaild username")

    const newUser = {
      id: uuid,
      username: username,
      password: bcrypt.hashSync(req.body.password, 10),
    }
    await createUser(newUser)

    const { password, ...userData } = newUser
    res.status(200).json({ success: true, data: userData })
  } catch (error) {
    next(error)
  }
})

module.exports = router
