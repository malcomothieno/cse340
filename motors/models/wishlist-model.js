const pool = require("../database")

async function addToWishlist(account_id, inv_id) {
  try {
    const sql = `INSERT INTO wishlist (account_id, inv_id)
      VALUES ($1, $2)
      RETURNING *`
    const result = await pool.query(sql, [account_id, inv_id])
    return result.rows[0]
  } catch (error) {
    // Unique violation = already saved
    if (error.code === "23505") {
      return { duplicate: true }
    }
    console.error("addToWishlist error: " + error)
    return null
  }
}
async function getWishlistByAccountId(account_id) {
  try {
    const sql = `
      SELECT
        w.wishlist_id,
        w.added_date,
        i.inv_id,
        i.inv_make,
        i.inv_model,
        i.inv_year,
        i.inv_price,
        i.inv_thumbnail,
        i.inv_color,
        i.inv_miles,
        c.classification_name
      FROM wishlist w
      JOIN inventory i ON w.inv_id = i.inv_id
      JOIN classification c ON i.classification_id = c.classification_id
      WHERE w.account_id = $1
      ORDER BY w.added_date DESC`
    const result = await pool.query(sql, [account_id])
    return result.rows
  } catch (error) {
    console.error("getWishlistByAccountId error: " + error)
    return []
  }
}


async function removeFromWishlist(wishlist_id, account_id) {
  try {
    const sql = `DELETE FROM wishlist
      WHERE wishlist_id = $1 AND account_id = $2
      RETURNING *`
    const result = await pool.query(sql, [wishlist_id, account_id])
    return result.rows[0]
  } catch (error) {
    console.error("removeFromWishlist error: " + error)
    return null
  }
}


async function checkWishlistItem(account_id, inv_id) {
  try {
    const sql = `SELECT wishlist_id FROM wishlist
      WHERE account_id = $1 AND inv_id = $2`
    const result = await pool.query(sql, [account_id, inv_id])
    return result.rowCount > 0
  } catch (error) {
    console.error("checkWishlistItem error: " + error)
    return false
  }
}

module.exports = {
  addToWishlist,
  getWishlistByAccountId,
  removeFromWishlist,
  checkWishlistItem,
}
