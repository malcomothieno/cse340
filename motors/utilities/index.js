const invModel = require("../models/inventory-model")
const { body, validationResult } = require("express-validator")

const Util = {}


Util.getNav = async function () {
  let data = await invModel.getClassifications()
  let list = '<ul id="nav-menu" role="list">'
  list += '<li><a href="/" class="nav-link" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" class="nav-link" title="See our ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}


Util.buildClassificationGrid = async function (data) {
  let grid
  if (data.length > 0) {
    grid = '<ul id="inv-display" role="list">'
    data.forEach((vehicle) => {
      grid += "<li>"
      grid +=
        '<a href="/inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make + " " + vehicle.inv_model + ' details">'
      grid +=
        '<img src="' + vehicle.inv_thumbnail +
        '" alt="Image of ' + vehicle.inv_make + " " + vehicle.inv_model +
        ' on CSE Motors" />'
      grid += "</a>"
      grid += '<div class="namePrice"><hr /><h2>'
      grid +=
        '<a href="/inv/detail/' + vehicle.inv_id +
        '" title="View ' + vehicle.inv_make + " " + vehicle.inv_model + ' details">' +
        vehicle.inv_make + " " + vehicle.inv_model + "</a>"
      grid += "</h2>"
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>"
      grid += "</div></li>"
    })
    grid += "</ul>"
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}


Util.buildVehicleDetail = function (vehicle) {
  const price = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(vehicle.inv_price)

  const miles = new Intl.NumberFormat("en-US").format(vehicle.inv_miles)

  let detail = '<section class="vehicle-detail-wrap">'
  detail += '<div class="vehicle-detail-image">'
  detail +=
    '<img src="' + vehicle.inv_image +
    '" alt="Full image of ' + vehicle.inv_make + " " + vehicle.inv_model + '" />'
  detail += "</div>"
  detail += '<div class="vehicle-detail-info">'
  detail += "<h2>" + vehicle.inv_make + " " + vehicle.inv_model + " Details</h2>"
  detail += '<ul class="vehicle-specs">'
  detail += "<li><span class='spec-label'>Year:</span><span class='spec-value'>" + vehicle.inv_year + "</span></li>"
  detail += "<li><span class='spec-label'>Make:</span><span class='spec-value'>" + vehicle.inv_make + "</span></li>"
  detail += "<li><span class='spec-label'>Model:</span><span class='spec-value'>" + vehicle.inv_model + "</span></li>"
  detail += "<li><span class='spec-label'>Color:</span><span class='spec-value'>" + vehicle.inv_color + "</span></li>"
  detail += "<li><span class='spec-label'>Mileage:</span><span class='spec-value'>" + miles + " miles</span></li>"
  detail += "<li><span class='spec-label'>Price:</span><span class='spec-value spec-price'>" + price + "</span></li>"
  detail += "<li class='spec-desc'><span class='spec-label'>Description:</span><span class='spec-value'>" + vehicle.inv_description + "</span></li>"
  detail += "</ul></div></section>"
  return detail
}


Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}


Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)


Util.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty()
      .withMessage("Classification name is required.")
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage(
        "Classification name cannot contain spaces or special characters."
      ),
  ]
}


Util.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await Util.getNav()
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: errors.array(),
      classification_name,
    })
    return
  }
  next()
}


Util.inventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Make is required (min 3 characters)."),
    body("inv_model")
      .trim()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Model is required (min 3 characters)."),
    body("inv_year")
      .trim()
      .notEmpty()
      .isInt({ min: 1900, max: 2099 })
      .withMessage("A valid 4-digit year is required."),
    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Description is required."),
    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Image path is required."),
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail path is required."),
    body("inv_price")
      .trim()
      .notEmpty()
      .isFloat({ min: 0 })
      .withMessage("A valid price is required."),
    body("inv_miles")
      .trim()
      .notEmpty()
      .isInt({ min: 0 })
      .withMessage("Valid mileage is required."),
    body("inv_color")
      .trim()
      .notEmpty()
      .withMessage("Color is required."),
    body("classification_id")
      .notEmpty()
      .withMessage("Classification is required."),
  ]
}


Util.checkInventoryData = async (req, res, next) => {
  const {
    inv_make, inv_model, inv_year, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_miles,
    inv_color, classification_id,
  } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await Util.getNav()
    let classificationList = await Util.buildClassificationList(classification_id)
    res.render("inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      classificationList,
      errors: errors.array(),
      inv_make, inv_model, inv_year, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_miles,
      inv_color, classification_id,
    })
    return
  }
  next()
}

module.exports = Util



Util.registrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),
    body("account_lastname")
      .trim()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),
    body("account_email")
      .trim()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const accountModel = require("../models/account-model")
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists) {
          throw new Error("Email already exists. Please log in or use a different email.")
        }
      }),
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}


Util.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await Util.getNav()
    res.render("account/register", {
      title: "Registration",
      nav,
      errors: errors.array(),
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}


Util.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required."),
  ]
}


Util.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await Util.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: errors.array(),
      account_email,
    })
    return
  }
  next()
}


Util.accountUpdateRules = () => {
  return [
    body("account_firstname")
      .trim()
      .notEmpty()
      .withMessage("First name is required."),
    body("account_lastname")
      .trim()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Last name is required."),
    body("account_email")
      .trim()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email, { req }) => {
        const accountModel = require("../models/account-model")
        const account_id = req.body.account_id
        const existing = await accountModel.getAccountById(account_id)
        if (existing && existing.account_email !== account_email) {
          const emailExists = await accountModel.checkExistingEmail(account_email)
          if (emailExists) {
            throw new Error("Email already in use by another account.")
          }
        }
      }),
  ]
}


Util.checkAccountUpdateData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await Util.getNav()
    res.render("account/update", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    })
    return
  }
  next()
}


Util.passwordUpdateRules = () => {
  return [
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "Password must be at least 12 characters with uppercase, lowercase, number, and special character."
      ),
  ]
}


Util.checkPasswordUpdateData = async (req, res, next) => {
  const { account_id } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await Util.getNav()
    const accountModel = require("../models/account-model")
    const accountData = await accountModel.getAccountById(account_id)
    res.render("account/update", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
      account_id,
    })
    return
  }
  next()
}


Util.checkJWTToken = (req, res, next) => {
  const jwt = require("jsonwebtoken")
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("notice", "Please log in.")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      }
    )
  } else {
    next()
  }
}


Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}


Util.checkAccountType = (req, res, next) => {
  if (
    res.locals.loggedin &&
    (res.locals.accountData.account_type === "Employee" ||
      res.locals.accountData.account_type === "Admin")
  ) {
    next()
  } else {
    req.flash("notice", "You do not have permission to access that area.")
    return res.redirect("/account/login")
  }
}
