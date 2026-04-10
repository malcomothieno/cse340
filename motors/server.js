require("dotenv").config()
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const path = require("path")
const session = require("express-session")
const flash = require("connect-flash")
const utilities = require("./utilities")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
  session({
    secret: process.env.SESSION_SECRET || "superSecretCSEMotorsKey",
    resave: false,
    saveUninitialized: true,
    name: "sessionId",
  })
)

app.use(flash())

app.use(function (req, res, next) {
  res.locals.notice = req.flash("notice")
  next()
})

app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")
app.set("views", path.join(__dirname, "views"))

app.use(express.static(path.join(__dirname, "public")))

app.get("/", utilities.handleErrors(baseController.buildHome))
app.use("/inv", inventoryRoute)

app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." })
})

app.use(async (err, req, res, next) => {
  let nav = ""
  try {
    nav = await utilities.getNav()
  } catch (navErr) {
    nav = ""
  }
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  const status = err.status || 500
  const message =
    status === 404
      ? err.message
      : "Oh no! There was a crash. Maybe try a different route?"
  res.status(status).render("errors/error", {
    title: status + " Error",
    nav,
    message,
    status,
  })
})

const port = process.env.PORT || 5500
const host = process.env.HOST || "localhost"
app.listen(port, () => {
  console.log(`CSE Motors app listening on ${host}:${port}`)
})