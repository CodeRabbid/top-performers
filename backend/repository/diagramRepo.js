import { client as postgres } from "../config/postgres.js";
import { full_time_unit_year_ago } from "../utils/helpers.js";
import { generate_select } from "../utils/sql_generator.js";

const getDiagramData = async (selectedFilters) => {
  const comparee = selectedFilters.comparee;
  const xUnits = selectedFilters.xUnits;
  const yUnits = selectedFilters.yUnits;
  const categories = selectedFilters.categories;
  const types = selectedFilters.types;
  const brands = selectedFilters.brands;

  const year_ago = full_time_unit_year_ago(new Date(), xUnits);
  let select_y_value = "";
  if (yUnits == "items_sold") {
    select_y_value = "COUNT(*)::INT as y_value";
  } else if (yUnits == "total_sales") {
    select_y_value = "SUM(product.price) as y_value";
  }

  let select_x_value = `${comparee} as comparee`;
  let comparees = selectedFilters[comparee + "s"];

  if (comparee == "age_group") {
    comparees = selectedFilters.age_group.split(",");
    select_x_value = generate_select(comparees, new Date());
  }

  const result = await postgres.query(
    ` SELECT  
            ${select_x_value},
            ${select_y_value},
            extract(${xUnits} from purchase_time) as time
          FROM customer
          JOIN purchase ON purchase.customer_id=customer.id 
          JOIN product ON purchase.product_id=product.id 
          WHERE ( category = ANY($1::VARCHAR[]) OR $2 )
          AND ( type = ANY($3::VARCHAR[]) OR $4 )
          AND ( brand = ANY($5::VARCHAR[]) OR $6 )
          AND purchase_time >= $7
          GROUP BY comparee, time
          `,
    [
      categories,
      categories.length == 0,
      types,
      types.length == 0,
      brands,
      brands.length == 0,
      year_ago,
    ]
  );
  return result.rows;
};

export { getDiagramData };
