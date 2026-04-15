const express = require("express")
const router = new express.Router()
const wishlistController = require("../controllers/wishlistController")
const utilities = require("../utilities")

// All wishlist routes require login
router.use(utilities.checkLogin)

// View wishlist  GET /wishlist/
router.get(
  "/",
  utilities.handleErrors(wishlistController.buildWishlist)
)

// Add to wishlist  POST /wishlist/add
router.post(
  "/add",
  utilities.handleErrors(wishlistController.addToWishlist)
)

// Remove from wishlist  POST /wishlist/remove
router.post(
  "/remove",
  utilities.handleErrors(wishlistController.removeFromWishlist)
)

module.exports = router
