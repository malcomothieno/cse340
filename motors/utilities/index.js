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
