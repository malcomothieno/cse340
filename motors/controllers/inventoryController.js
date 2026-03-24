const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

const invCont = {};

/* ***************************
 * Build inventory by classification view
 * nav is injected via res.locals in server.js middleware
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  const className = data.length > 0 ? data[0].classification_name : "Vehicles";
  res.render("./inventory/classification", {
    title: className + " vehicles",
    grid,
  });
};

/* ***************************
 * Build vehicle detail view
 * nav is injected via res.locals in server.js middleware
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId;
  const vehicle = await invModel.getInventoryById(inv_id);

  if (!vehicle) {
    const err = new Error("Vehicle not found.");
    err.status = 404;
    return next(err);
  }

  const vehicleHTML = utilities.buildVehicleDetailHTML(vehicle);

  res.render("./inventory/detail", {
    title:
      vehicle.inv_year + " " + vehicle.inv_make + " " + vehicle.inv_model,
    vehicleHTML,
  });
};

/* ***************************
 * Intentional Error — Task 3
 * Triggers a 500-type error to test error handling middleware
 * ************************** */
invCont.triggerError = async function (req, res, next) {
  throw new Error(
    "Intentional 500 Error — triggered to test error handling middleware."
  );
};

module.exports = invCont;
