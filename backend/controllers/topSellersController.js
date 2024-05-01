import asyncHandler from "express-async-handler";
import { client as postgres } from "../config/postgres.js";
import { format_as_diagram } from "../utils/converter.js";

// @desc    Fetch purchases
// @route   GET /api/purchase
// @access  Private
const allPurchases = asyncHandler(async (req, res) => {
  const filters = req.body.selectedFilters;
  const earliestPuchaseDate = req.body.selectedFilters.earliest_purchase_date;
  const latestPurchaseDate = req.body.selectedFilters.latest_purchase_date;
  const priceRange = req.body.selectedFilters.price_range;
  const paginationModel = req.body.paginationModel;
  const sortModel = req.body.sortModel;
  const sorting = sortModel.length
    ? `ORDER BY ${sortModel[0].field} ${sortModel[0].sort}`
    : "";
  try {
    const result = await postgres.query(
      `
    SELECT 
      row_number() OVER () as id,
      COUNT(product.image)::INT as items_sold, 
	    SUM(product.price) as total_sales,
      product.category as category, 
      product.type as type, 
      product.brand as brand, 
      product.price as price,
	    product.model as model, 
      product.image_url as image_url, 
      COUNT(*) as count
    FROM purchase 
    JOIN product ON purchase.product_id=product.id
    WHERE ( category = ANY($1::VARCHAR[]) OR $2 )
    AND ( type = ANY($3::VARCHAR[]) OR $4 )
    AND ( brand = ANY($5::VARCHAR[]) OR $6 )
    AND purchase_time BETWEEN $7 AND $8
    AND ( price BETWEEN $9 AND $10 OR $11)
    GROUP BY 
      product.category, 
      product.type, 
      product.brand, 
      product.model, 
      product.price, 
      product.image,
      product.image_url
    ${sorting}
    LIMIT $12
    OFFSET $13
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
        priceRange[0],
        priceRange[1],
        priceRange.length == 0,
        paginationModel.pageSize,
        paginationModel.pageSize * paginationModel.page,
      ]
    );

    const count_result = await postgres.query(
      `
    SELECT 
      COUNT(DISTINCT image)::INT as count
    FROM purchase 
    JOIN product ON purchase.product_id=product.id
    WHERE ( category = ANY($1::VARCHAR[]) OR $2 )
    AND ( type = ANY($3::VARCHAR[]) OR $4 )
    AND ( brand = ANY($5::VARCHAR[]) OR $6 )
    AND purchase_time BETWEEN $7 AND $8
    AND ( price BETWEEN $9 AND $10 OR $11)
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
        priceRange[0],
        priceRange[1],
        priceRange.length == 0,
      ]
    );

    res.json({ purchase: result.rows, count: count_result.rows[0].count });
  } catch (err) {
    console.log(err);
  }
});

// @desc    Fetch filters
// @route   GET /api/filters
// @access  Private
const getFilters = asyncHandler(async (req, res) => {
  const selectedFilters = req.body.selectedFilters;
  const earliestPuchaseDate = req.body.selectedFilters.earliest_purchase_date;
  const latestPurchaseDate = req.body.selectedFilters.latest_purchase_date;
  const priceRange = req.body.selectedFilters.price_range;
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
      AND ( price BETWEEN $7 AND $8 OR $9)
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
        priceRange[0],
        priceRange[1],
        priceRange.length == 0,
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
      AND ( price BETWEEN $7 AND $8 OR $9)
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
        priceRange[0],
        priceRange[1],
        priceRange.length == 0,
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
      AND ( price BETWEEN $7 AND $8 OR $9)
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
        priceRange[0],
        priceRange[1],
        priceRange.length == 0,
      ]
    );
    filters.brands = result.rows;

    result = await postgres.query(
      `SELECT 
        MIN(price) as min_price,
        MAX(price) as max_price
      FROM purchase 
      JOIN product ON purchase.product_id=product.id  
      WHERE ( category = ANY($1::VARCHAR[]) OR $2 )
      AND ( type = ANY($3::VARCHAR[]) OR $4 )
      AND ( brand = ANY($5::VARCHAR[]) OR $6 )
      AND purchase_time BETWEEN $7 AND $8
      `,
      [
        selectedFilters.categories,
        selectedFilters.categories.length == 0,
        selectedFilters.types,
        selectedFilters.types.length == 0,
        selectedFilters.brands,
        selectedFilters.brands.length == 0,
        earliestPuchaseDate,
        latestPurchaseDate,
      ]
    );
    filters.price_bounds = [result.rows[0].min_price, result.rows[0].max_price];

    res.json(filters);
  } catch (err) {
    console.log(err);
  }
});

// @desc    Fetch diagram
// @route   GET /api/diagram
// @access  Private
const getDiagram = asyncHandler(async (req, res) => {
  const selectedFilters = req.body.selectedFilters;
  const comparee = selectedFilters.comparee;

  try {
    let result = await postgres.query(
      `
      SELECT 
        ${comparee} as comparee,
        COUNT(product.id)::INT as items_sold,
        date_trunc('month', purchase_time) AS month
      FROM purchase 
      JOIN product ON purchase.product_id=product.id 
      JOIN customer ON purchase.customer_id=customer.id
      WHERE ${comparee} = ANY($1::VARCHAR[])   
      AND purchase_time >= '2023-04-01'
      GROUP BY ${comparee}, month
      ORDER BY items_sold DESC
      `,
      [selectedFilters[comparee + "s"]]
    );

    res.json({
      diagram: format_as_diagram(
        result.rows,
        selectedFilters[comparee + "s"],
        "Month",
        new Date()
      ),
      comparee: selectedFilters[comparee + "s"],
    });
  } catch (err) {
    console.log(err);
  }
});

export { allPurchases, getFilters, getDiagram };
