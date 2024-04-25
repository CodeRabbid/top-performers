import asyncHandler from "express-async-handler";
import { client as postgres } from "../config/postgres.js";

// @desc    Fetch purchases
// @route   GET /api/purchase
// @access  Private
const allPurchases = asyncHandler(async (req, res) => {
  const sortBy = req.body.sortBy;
  const filters = req.body.selectedFilters;
  try {
    const result = await postgres.query(
      `
    SELECT 
      COUNT(product.image) as items_sold, 
	    SUM(product.price) as total_sales,
      product.category as category, 
      product.type as type, 
      product.brand as brand, 
      product.price as price,
	    product.image as image
    FROM purchase 
    JOIN product ON purchase.product_id=product.id
    WHERE category = ANY($1::VARCHAR[]) OR $2
    GROUP BY 
      product.category, 
      product.type, 
      product.brand, 
      product.price, 
      product.image
    ORDER BY ${sortBy} DESC
    LIMIT 20
    `,
      [filters.categories, filters.categories.length == 0]
    );
    res.json({ purchase: result.rows });
  } catch (err) {
    console.log(err);
  }
});

// @desc    Fetch purchases
// @route   GET /api/purchase
// @access  Private
const getFilters = asyncHandler(async (req, res) => {
  try {
    const filters = {};
    let result = await postgres.query(
      `SELECT 
          count(category) as count,
          category
      FROM product 
      GROUP BY 
        category
      ORDER BY category ASC
      `
    );
    filters.categories = result.rows;
    result = await postgres.query(
      `SELECT 
        count(type) as count,
        type
      FROM product 
      GROUP BY 
        type
      ORDER BY type ASC
      `
    );
    filters.types = result.rows;
    result = await postgres.query(
      `SELECT 
        count(brand) as count,
        brand
      FROM product 
      GROUP BY 
        brand
      ORDER BY brand ASC
      `
    );
    filters.brands = result.rows;

    res.json(filters);
  } catch (err) {
    console.log(err);
  }
});

export { allPurchases, getFilters };
