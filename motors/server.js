/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const path = require("path")

const app = express()

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")
app.set("views", path.join(__dirname, "views"))

/* ***********************
 * Static Files
 *************************/
app.use(express.static(path.join(__dirname, "public")))

/* ***********************
 * Routes
 *************************/
const indexRouter = require("./routes/index")
app.use("/", indexRouter)

/* ***********************
 * 404 Handler
 *************************/
app.use((req, res) => {
  res.status(404).render("errors/404", {
    title: "404 - Page Not Found",
    nav: "",
  })
})

/* ***********************
 * Local Server Info
 * Values from .env (see .env file)
 *************************/
const port = process.env.PORT || 5500
const host = process.env.HOST || "localhost"

app.listen(port, () => {
  console.log(`CSE Motors app listening on ${host}:${port}`)
})
