const utilities = require("../utilities")
const wishlistModel = require("../models/wishlist-model")

const wishlistCont = {}


wishlistCont.buildWishlist = utilities.handleErrors(async function (req, res, next) {
  const account_id = res.locals.accountData.account_id
  let nav = await utilities.getNav()
  const wishlistItems = await wishlistModel.getWishlistByAccountId(account_id)
  res.render("wishlist/index", {
    title: "My Wishlist",
    nav,
    wishlistItems,
    errors: null,
  })
})


wishlistCont.addToWishlist = utilities.handleErrors(async function (req, res, next) {
  const account_id = res.locals.accountData.account_id
  const inv_id = parseInt(req.body.inv_id)

  if (!inv_id || isNaN(inv_id)) {
    req.flash("notice", "Invalid vehicle selection.")
    return res.redirect("back")
  }

  const result = await wishlistModel.addToWishlist(account_id, inv_id)

  if (result && result.duplicate) {
    req.flash("notice", "That vehicle is already in your wishlist.")
  } else if (result) {
    req.flash("notice", "Vehicle added to your wishlist!")
  } else {
    req.flash("notice", "Sorry, could not add to wishlist. Please try again.")
  }

  // Return to the vehicle detail page they came from
  const referer = req.get("Referer") || "/wishlist"
  res.redirect(referer)
})


wishlistCont.removeFromWishlist = utilities.handleErrors(async function (req, res, next) {
  const account_id = res.locals.accountData.account_id
  const wishlist_id = parseInt(req.body.wishlist_id)

  if (!wishlist_id || isNaN(wishlist_id)) {
    req.flash("notice", "Invalid wishlist item.")
    return res.redirect("/wishlist")
  }

  const result = await wishlistModel.removeFromWishlist(wishlist_id, account_id)

  if (result) {
    req.flash("notice", "Vehicle removed from your wishlist.")
  } else {
    req.flash("notice", "Could not remove item. Please try again.")
  }

  res.redirect("/wishlist")
})

module.exports = wishlistCont
