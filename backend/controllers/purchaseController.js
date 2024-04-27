import asyncHandler from "express-async-handler";
import { client as postgres } from "../config/postgres.js";

// @desc    Fetch purchases
// @route   GET /api/purchase
// @access  Private
const allPurchases = asyncHandler(async (req, res) => {
  const filters = req.body.selectedFilters;
  const earliestPuchaseDate = req.body.earliestPurchaseDate;
  const latestPurchaseDate = req.body.latestPurchaseDate;
  try {
    const result = await postgres.query(
      `
    SELECT 
      row_number() OVER () as id,
      COUNT(product.image) as items_sold, 
	    SUM(product.price) as total_sales,
      product.category as category, 
      product.type as type, 
      product.brand as brand, 
      product.price as price,
	    product.image as image 
    FROM purchase 
    JOIN product ON purchase.product_id=product.id
    WHERE ( category = ANY($1::VARCHAR[]) OR $2 )
    AND ( type = ANY($3::VARCHAR[]) OR $4 )
    AND ( brand = ANY($5::VARCHAR[]) OR $6 )
    AND purchase_time BETWEEN $7 AND $8
    GROUP BY 
      product.category, 
      product.type, 
      product.brand, 
      product.price, 
      product.image 
    LIMIT 20
    `,
      [
        filters.categories,
        filters.categories.length == 0,
        filters.types,
        filters.types.length == 0,
        filters.brands,
        filters.brands.length == 0,
        earliestPuchaseDate,
        latestPurchaseDate,
      ]
    );
    // console.log(result.rows);
    res.json({ purchase: result.rows });
  } catch (err) {
    console.log(err);
  }
});

// @desc    Fetch filters
// @route   GET /api/filters
// @access  Private
const getFilters = asyncHandler(async (req, res) => {
  const selectedFilters = req.body.selectedFilters;
  const earliestPuchaseDate = req.body.earliestPurchaseDate;
  const latestPurchaseDate = req.body.latestPurchaseDate;
  try {
    const filters = {};
    let result = await postgres.query(
      `
      SELECT 
        COUNT(DISTINCT image) as count,
        category as name
      FROM purchase 
      JOIN product ON purchase.product_id=product.id  
      WHERE ( type = ANY($1::VARCHAR[]) OR $2 )
      AND ( brand = ANY($3::VARCHAR[]) OR $4 )
      AND purchase_time BETWEEN $5 AND $6
      GROUP BY 
        name
      ORDER BY name ASC
      `,
      [
        selectedFilters.types,
        selectedFilters.types.length == 0,
        selectedFilters.brands,
        selectedFilters.brands.length == 0,
        earliestPuchaseDate,
        latestPurchaseDate,
      ]
    );
    filters.categories = result.rows;
    result = await postgres.query(
      `SELECT 
        COUNT(DISTINCT image) as count,
        type as name
      FROM purchase 
      JOIN product ON purchase.product_id=product.id  
      WHERE ( type = ANY($1::VARCHAR[]) OR $2 )
      AND ( brand = ANY($3::VARCHAR[]) OR $4 )
      AND purchase_time BETWEEN $5 AND $6
      GROUP BY 
        name
      ORDER BY name ASC
      `,
      [
        selectedFilters.categories,
        selectedFilters.categories.length == 0,
        selectedFilters.brands,
        selectedFilters.brands.length == 0,
        earliestPuchaseDate,
        latestPurchaseDate,
      ]
    );
    filters.types = result.rows;
    result = await postgres.query(
      `SELECT 
        COUNT(DISTINCT image) as count,
        brand as name
      FROM purchase 
      JOIN product ON purchase.product_id=product.id  
      WHERE ( category = ANY($1::VARCHAR[]) OR $2 )
      AND ( type = ANY($3::VARCHAR[]) OR $4 )
      AND purchase_time BETWEEN $5 AND $6
      GROUP BY 
        name
      ORDER BY name ASC
      `,
      [
        selectedFilters.categories,
        selectedFilters.categories.length == 0,
        selectedFilters.types,
        selectedFilters.types.length == 0,
        earliestPuchaseDate,
        latestPurchaseDate,
      ]
    );
    filters.brands = result.rows;

    res.json(filters);
  } catch (err) {
    console.log(err);
  }
});

export { allPurchases, getFilters };
