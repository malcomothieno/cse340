const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}


invCont.buildManagement = utilities.handleErrors(async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
  })
})


invCont.buildByClassificationId = utilities.handleErrors(
  async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    if (!data || data.length === 0) {
      const err = new Error("No vehicles found for that classification.")
      err.status = 404
      return next(err)
    }
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("inventory/classification", {
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
    res.render("inventory/detail", {
      title: vehicle.inv_year + " " + vehicle.inv_make + " " + vehicle.inv_model,
      nav,
      vehicleDetail,
    })
  }
)


invCont.buildAddClassification = utilities.handleErrors(
  async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
      classification_name: "",
    })
  }
)


invCont.addClassification = utilities.handleErrors(
  async function (req, res, next) {
    const { classification_name } = req.body
    const result = await invModel.addClassification(classification_name)
    if (result) {
      req.flash(
        "notice",
        `The "${classification_name}" classification was successfully added.`
      )
      let nav = await utilities.getNav()
      res.status(201).render("inventory/management", {
        title: "Inventory Management",
        nav,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, the classification could not be added.")
      let nav = await utilities.getNav()
      res.status(501).render("inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: null,
        classification_name,
      })
    }
  }
)


invCont.buildAddInventory = utilities.handleErrors(
  async function (req, res, next) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList()
    res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      errors: null,
      inv_make: "", inv_model: "", inv_year: "",
      inv_description: "", inv_image: "/images/vehicles/no-image.png",
      inv_thumbnail: "/images/vehicles/no-image-tn.png",
      inv_price: "", inv_miles: "", inv_color: "",
      classification_id: "",
    })
  }
)


invCont.addInventory = utilities.handleErrors(
  async function (req, res, next) {
    const {
      inv_make, inv_model, inv_year, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_miles,
      inv_color, classification_id,
    } = req.body

    const result = await invModel.addInventory(
      inv_make, inv_model, inv_year, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_miles,
      inv_color, classification_id
    )

    if (result) {
      req.flash(
        "notice",
        `The ${inv_year} ${inv_make} ${inv_model} was successfully added to inventory.`
      )
      let nav = await utilities.getNav()
      res.status(201).render("inventory/management", {
        title: "Inventory Management",
        nav,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, the vehicle could not be added.")
      let nav = await utilities.getNav()
      let classificationList = await utilities.buildClassificationList(classification_id)
      res.status(501).render("inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classificationList,
        errors: null,
        inv_make, inv_model, inv_year, inv_description,
        inv_image, inv_thumbnail, inv_price, inv_miles,
        inv_color, classification_id,
      })
    }
  }
)


invCont.triggerError = utilities.handleErrors(async function (req, res, next) {
  throw new Error("Intentional 500 error – error handler test.")
})

module.exports = invCont
