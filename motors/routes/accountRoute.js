const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")

// Deliver login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Deliver registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process registration
router.post(
  "/register",
  utilities.registrationRules(),
  utilities.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process login
router.post(
  "/login",
  utilities.loginRules(),
  utilities.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Account management view (protected)
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
)

// Deliver account update view (protected)
router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountUpdate)
)

// Process account info update (protected)
router.post(
  "/update",
  utilities.checkLogin,
  utilities.accountUpdateRules(),
  utilities.checkAccountUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

// Process password update (protected)
router.post(
  "/update-password",
  utilities.checkLogin,
  utilities.passwordUpdateRules(),
  utilities.checkPasswordUpdateData,
  utilities.handleErrors(accountController.updatePassword)
)

// Logout
router.get("/logout", utilities.handleErrors(accountController.logout))

module.exports = router
