const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")

// PUBLIC routes – no auth needed
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByInventoryId))
router.get("/error", utilities.handleErrors(invController.triggerError))

// PROTECTED routes – Employee or Admin only
router.get("/", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildManagement))
router.get("/add-classification", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildAddClassification))
router.post("/add-classification", utilities.checkLogin, utilities.checkAccountType, utilities.classificationRules(), utilities.checkClassificationData, utilities.handleErrors(invController.addClassification))
router.get("/add-inventory", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildAddInventory))
router.post("/add-inventory", utilities.checkLogin, utilities.checkAccountType, utilities.inventoryRules(), utilities.checkInventoryData, utilities.handleErrors(invController.addInventory))

module.exports = router
