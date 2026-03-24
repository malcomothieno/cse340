const { pool } = require("../database");

/* *****************************
 * Get all classification data
 * Used to build the navigation bar
 ***************************** */
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}

/* *****************************
 * Get all inventory items by classification_id
 * Uses a parameterized (prepared) statement
 ***************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const sql = `
      SELECT * FROM public.inventory AS i
      JOIN public.classification AS c
        ON i.classification_id = c.classification_id
      WHERE i.classification_id = $1`;
    const data = await pool.query(sql, [classification_id]);
    return data.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error: " + error);
    throw error;
  }
}

/* *****************************
 * Get a single inventory item by inv_id
 * Uses a parameterized (prepared) statement
 ***************************** */
async function getInventoryById(inv_id) {
  try {
    const sql = `
      SELECT * FROM public.inventory AS i
      JOIN public.classification AS c
        ON i.classification_id = c.classification_id
      WHERE i.inv_id = $1`;
    const data = await pool.query(sql, [inv_id]);
    return data.rows[0]; // single row object
  } catch (error) {
    console.error("getInventoryById error: " + error);
    throw error;
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById,
};
