const invModel = require("../models/inventory-model");

const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 * Pulls classification data from the database
 ************************** */
Util.getNav = async function () {
  let data = await invModel.getClassifications();
  let list = '<ul id="main-nav">';
  list += '<li><a href="/">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification grid HTML
 * Used by the classification view
 * ************************************* */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="/inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">';
      grid +=
        '<img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" />';
      grid += "</a>";
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
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
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build the vehicle detail HTML
 * Takes a single vehicle object and wraps it in HTML
 * Returns the resulting string to the controller
 * ************************************* */
Util.buildVehicleDetailHTML = function (vehicle) {
  // Format price as US dollars with commas and $ symbol
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(vehicle.inv_price);

  // Format mileage with place-value commas
  const formattedMiles = new Intl.NumberFormat("en-US").format(
    vehicle.inv_miles
  );

  let html = '<section id="vehicle-detail">';

  // Full-size image (not thumbnail)
  html += '<div id="vehicle-image">';
  html +=
    '<img src="' +
    vehicle.inv_image +
    '" alt="Full size image of ' +
    vehicle.inv_year +
    " " +
    vehicle.inv_make +
    " " +
    vehicle.inv_model +
    '" width="800" height="500">';
  html += "</div>";

  // Vehicle info panel
  html += '<div id="vehicle-info">';
  html +=
    "<h2>" +
    vehicle.inv_year +
    " " +
    vehicle.inv_make +
    " " +
    vehicle.inv_model +
    " Details</h2>";

  html += '<ul id="vehicle-specs">';
  html += "<li><span class='spec-label'>Price:</span> <strong class='spec-price'>" + formattedPrice + "</strong></li>";
  html += "<li><span class='spec-label'>Year:</span> " + vehicle.inv_year + "</li>";
  html += "<li><span class='spec-label'>Make:</span> " + vehicle.inv_make + "</li>";
  html += "<li><span class='spec-label'>Model:</span> " + vehicle.inv_model + "</li>";
  html += "<li><span class='spec-label'>Color:</span> " + vehicle.inv_color + "</li>";
  html += "<li><span class='spec-label'>Mileage:</span> " + formattedMiles + " miles</li>";
  html += "<li><span class='spec-label'>Description:</span> " + vehicle.inv_description + "</li>";
  html += "</ul>";

  html +=
    '<a href="/contact" class="btn-own">Contact Us About This Vehicle</a>';
  html += "</div>"; // end #vehicle-info

  html += "</section>"; // end #vehicle-detail

  return html;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for general error handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
