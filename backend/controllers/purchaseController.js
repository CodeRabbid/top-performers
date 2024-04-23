import asyncHandler from "express-async-handler";
import { client as postgres } from "../config/postgres.js";

// @desc    Fetch purchases
// @route   GET /api/purchase
// @access  Private
const allPurchases = asyncHandler(async (req, res) => {
  try {
    const result = await postgres.query(`
    SELECT 
      purchase.purchase_time as purchase_time, 
      customer.gender as gender, 
      customer.birthday as birthday, 
      product.type as type, 
      product.model as model, 
      product.brand as brand
    FROM purchase 
    JOIN customer ON purchase.customer_id=customer.id
    JOIN product ON purchase.product_id=product.id
    `);
    res.json({ purchase: result.rows });
  } catch (err) {
    console.log(err);
  }
});

export { allPurchases };
