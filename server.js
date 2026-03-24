/* ******************************************
 * This server.js file is the primary file of the
 * application. Please read the README file for a
 * description of the application.
 *
 * CSE Motors - Dealership Web Application
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
require("dotenv").config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const utilities = require("./utilities");

/* ***********************
 * Route Requires
 *************************/
const staticRoutes = require("./routes/static");
const indexRoutes = require("./routes/index");
const inventoryRoute = require("./routes/inventoryRoute");

/* ***********************
 * App Setup
 *************************/
const app = express();

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* ***********************
 * Middleware
 *************************/
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ***********************
 * Global Nav Middleware
 * Runs on every request BEFORE routes.
 * Attaches nav to res.locals so every EJS view
 * automatically has access to `nav` — no route
 * needs to pass it manually. Fixes: "nav is not defined"
 *************************/
app.use(async (req, res, next) => {
  try {
    res.locals.nav = await utilities.getNav();
  } catch (err) {
    // Fallback nav if DB is unavailable
    res.locals.nav =
      '<ul id="main-nav"><li><a href="/">Home</a></li></ul>';
  }
  next();
});

/* ***********************
 * Routes
 *************************/
app.use("/", staticRoutes);
app.use("/", indexRoutes);
app.use("/inv", inventoryRoute);

/* ***********************
 * 404 Error Handler
 * Must be placed after all other routes
 *************************/
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
  // nav is already on res.locals from the global middleware above
  // but we re-fetch in case the error happened before middleware ran
  if (!res.locals.nav) {
    try {
      res.locals.nav = await utilities.getNav();
    } catch {
      res.locals.nav =
        '<ul id="main-nav"><li><a href="/">Home</a></li></ul>';
    }
  }
  console.error(
    `Error at: "${req.originalUrl}": ${err.status || 500}: ${err.message}`
  );
  const message =
    err.status == 404
      ? err.message
      : "Oh no! There was a crash. Maybe try a different route?";
  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav: res.locals.nav,
  });
});

/* ***********************
 * Local Server Information
 * Values from .env
 *************************/
const port = process.env.PORT || 5500;
const host = process.env.HOST || "localhost";

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`CSE Motors app listening on ${host}:${port}`);
});
