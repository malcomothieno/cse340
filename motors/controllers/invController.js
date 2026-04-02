const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}


invCont.buildByClassificationId = utilities.handleErrors(
  async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  }
)


invCont.buildByInventoryId = utilities.handleErrors(
  async function (req, res, next) {
    const inv_id = req.params.inv_id
    const vehicle = await invModel.getInventoryById(inv_id)
    if (!vehicle) {
      const err = new Error("Vehicle not found")
      err.status = 404
      return next(err)
    }
    const vehicleDetail = utilities.buildVehicleDetail(vehicle)
    let nav = await utilities.getNav()
    const vehicleName = vehicle.inv_make + " " + vehicle.inv_model
    res.render("./inventory/detail", {
      title: vehicle.inv_year + " " + vehicleName,
      nav,
      vehicleDetail,
    })
  }
)


invCont.triggerError = utilities.handleErrors(
  async function (req, res, next) {
    throw new Error(
      "Intentional 500 error triggered from footer link – error handler test."
    )
  }
)

module.exports = invCont
