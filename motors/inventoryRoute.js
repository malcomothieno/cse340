// Needed Resources
const express = require("express");
const router = new express.Router();

// Set up "public" folder / static route
router.use(express.static("public"));

module.exports = router;
