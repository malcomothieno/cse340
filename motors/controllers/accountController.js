const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const accountCont = {}


accountCont.buildLogin = utilities.handleErrors(async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email: "",
  })
})


accountCont.buildRegister = utilities.handleErrors(async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    account_firstname: "",
    account_lastname: "",
    account_email: "",
  })
})


accountCont.registerAccount = utilities.handleErrors(async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", "Sorry, there was an error processing the registration.")
    return res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations! You are registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email: "",
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
    })
  }
})

/* ****************************************
 * Process Login
 **************************************** */
accountCont.accountLogin = utilities.handleErrors(async function (req, res, next) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
  }

  try {
    const match = await bcrypt.compare(account_password, accountData.account_password)
    if (match) {
      delete accountData.account_password
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      )
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          maxAge: 3600 * 1000,
        })
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        })
      }
      return res.redirect("/account/")
    } else {
      req.flash("notice", "Please check your credentials and try again.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error("Access Forbidden")
  }
})

accountCont.buildAccountManagement = utilities.handleErrors(
  async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
    })
  }
)

accountCont.buildAccountUpdate = utilities.handleErrors(
  async function (req, res, next) {
    const account_id = parseInt(req.params.account_id)
    let nav = await utilities.getNav()
    const accountData = await accountModel.getAccountById(account_id)
    res.render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
      account_id: accountData.account_id,
    })
  }
)


accountCont.updateAccount = utilities.handleErrors(
  async function (req, res, next) {
    const { account_firstname, account_lastname, account_email, account_id } =
      req.body
    const updateResult = await accountModel.updateAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_id
    )

    if (updateResult) {
      // Refresh JWT with updated data
      const accountData = await accountModel.getAccountById(account_id)
      delete accountData.account_password
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      )
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        })
      }
      req.flash(
        "notice",
        `Your account was successfully updated, ${account_firstname}.`
      )
      let nav = await utilities.getNav()
      res.render("account/management", {
        title: "Account Management",
        nav,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, the account update failed.")
      let nav = await utilities.getNav()
      res.status(501).render("account/update", {
        title: "Update Account",
        nav,
        errors: null,
        account_firstname,
        account_lastname,
        account_email,
        account_id,
      })
    }
  }
)


accountCont.updatePassword = utilities.handleErrors(
  async function (req, res, next) {
    const { account_password, account_id } = req.body

    let hashedPassword
    try {
      hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
      req.flash("notice", "Sorry, there was an error hashing the password.")
      let nav = await utilities.getNav()
      const accountData = await accountModel.getAccountById(account_id)
      return res.status(500).render("account/update", {
        title: "Update Account",
        nav,
        errors: null,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
        account_id,
      })
    }

    const updateResult = await accountModel.updatePassword(
      hashedPassword,
      account_id
    )

    if (updateResult) {
      req.flash("notice", "Your password was successfully updated.")
      let nav = await utilities.getNav()
      res.render("account/management", {
        title: "Account Management",
        nav,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, the password update failed.")
      let nav = await utilities.getNav()
      const accountData = await accountModel.getAccountById(account_id)
      res.status(501).render("account/update", {
        title: "Update Account",
        nav,
        errors: null,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
        account_id,
      })
    }
  }
)


accountCont.logout = utilities.handleErrors(async function (req, res, next) {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out.")
  res.redirect("/")
})

module.exports = accountCont
