// Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");

// Route to build index view
// nav is injected automatically by global middleware in server.js
router.get(
  "/",
  utilities.handleErrors(async (req, res, next) => {
    res.render("index", {
      title: "Home",
    });
  })
);

module.exports = router;
