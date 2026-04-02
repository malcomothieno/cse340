const invModel = require("../models/inventory-model")

const Util = {}


Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = '<ul id="nav-menu" role="list">'
  list += '<li><a href="/" class="nav-link" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" class="nav-link" title="See our inventory of ' +
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
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details">'
      grid +=
        '<img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" />'
      grid += "</a>"
      grid += '<div class="namePrice">'
      grid += "<hr />"
      grid += "<h2>"
      grid +=
        '<a href="/inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>"
      grid += "</h2>"
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>"
      grid += "</div>"
      grid += "</li>"
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

  // Full-size image
  detail += '<div class="vehicle-detail-image">'
  detail +=
    '<img src="' +
    vehicle.inv_image +
    '" alt="Full image of ' +
    vehicle.inv_make +
    " " +
    vehicle.inv_model +
    '" />'
  detail += "</div>"

  // Info panel
  detail += '<div class="vehicle-detail-info">'
  detail +=
    "<h2>" + vehicle.inv_make + " " + vehicle.inv_model + " Details</h2>"
  detail += '<ul class="vehicle-specs">'
  detail +=
    "<li><span class='spec-label'>Year:</span><span class='spec-value'>" +
    vehicle.inv_year +
    "</span></li>"
  detail +=
    "<li><span class='spec-label'>Make:</span><span class='spec-value'>" +
    vehicle.inv_make +
    "</span></li>"
  detail +=
    "<li><span class='spec-label'>Model:</span><span class='spec-value'>" +
    vehicle.inv_model +
    "</span></li>"
  detail +=
    "<li><span class='spec-label'>Color:</span><span class='spec-value'>" +
    vehicle.inv_color +
    "</span></li>"
  detail +=
    "<li><span class='spec-label'>Mileage:</span><span class='spec-value'>" +
    miles +
    " miles</span></li>"
  detail +=
    "<li><span class='spec-label'>Price:</span><span class='spec-value spec-price'>" +
    price +
    "</span></li>"
  detail +=
    "<li class='spec-desc'><span class='spec-label'>Description:</span><span class='spec-value'>" +
    vehicle.inv_description +
    "</span></li>"
  detail += "</ul>"
  detail += "</div>" // close vehicle-detail-info

  detail += "</section>"

  return detail
}


Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util
