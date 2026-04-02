
require("dotenv").config()
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const path = require("path")
const utilities = require("./utilities")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")

const app = express()

app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")
app.set("views", path.join(__dirname, "views"))


app.use(express.static(path.join(__dirname, "public")))


// Home route
app.get("/", utilities.handleErrors(baseController.buildHome))

// Inventory routes
app.use("/inv", inventoryRoute)


app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." })
})


app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)

  const status = err.status || 500
  let message

  if (status === 404) {
    message = err.message || "Page not found."
  } else {
    message =
      "Oh no! There was a crash. Maybe try a different route? Our team has been notified."
  }

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
