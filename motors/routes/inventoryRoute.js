// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/inventoryController");
const utilities = require("../utilities");

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// Route to build a specific vehicle detail view — Task 1
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildByInvId)
);

// Intentional error route — Task 3
router.get(
  "/trigger-error",
  utilities.handleErrors(invController.triggerError)
);

module.exports = router;
