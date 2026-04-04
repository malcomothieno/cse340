const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")

// Management view  GET /inv/
router.get(
  "/",
  utilities.handleErrors(invController.buildManagement)
)

// Classification view  GET /inv/type/:classificationId
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
)

// Vehicle detail view  GET /inv/detail/:inv_id
router.get(
  "/detail/:inv_id",
  utilities.handleErrors(invController.buildByInventoryId)
)

// Add classification view  GET /inv/add-classification
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
)

// Process add classification  POST /inv/add-classification
router.post(
  "/add-classification",
  utilities.classificationRules(),
  utilities.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Add inventory view  GET /inv/add-inventory
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
)

// Process add inventory  POST /inv/add-inventory
router.post(
  "/add-inventory",
  utilities.inventoryRules(),
  utilities.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

// Intentional error  GET /inv/error
router.get(
  "/error",
  utilities.handleErrors(invController.triggerError)
)

module.exports = router
