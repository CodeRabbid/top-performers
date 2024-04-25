import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from "react-redux";
import { Col, Form } from "react-bootstrap";
import {
  useAllPurchasesMutation,
  useGetFiltersMutation,
} from "../slices/api/purchaseApiSlice.js";
import { Navbar, Nav, Container, Dropdown, Button } from "react-bootstrap";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

function valuetext(value) {
  return `${value}°C`;
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const PurchaseScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [purchases, setPurchases] = useState();

  const [allPurchases, { isLoading }] = useAllPurchasesMutation();
  const [getFilters] = useGetFiltersMutation();

  const [sortBy, setSortBy] = useState("total_sales");
  const [filters, setFilters] = useState({
    categories: [],
    types: [],
    brands: [],
  });

  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    types: [],
    brands: [],
  });

  useEffect(() => {
    (async () => {
      const result = await getFilters().unwrap();
      setFilters(result);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const result = await allPurchases({ sortBy, selectedFilters }).unwrap();
      setPurchases(result.purchase);
    })();
  }, [sortBy, selectedFilters]);

  const handleSort = (field) => {
    setSortBy(field);
  };

  const categoriesFilterHandler = (event, values) => {
    const selected = values.map((value) => value.category);
    setSelectedFilters((selectedFilters) => ({
      ...selectedFilters,
      categories: selected,
    }));
  };

  return (
    <Container>
      <div style={{ float: "left", margin: "0 5px 0 0" }}>
        <Autocomplete
          multiple
          limitTags={1}
          id="categories-filter"
          options={filters.categories}
          disableCloseOnSelect
          getOptionLabel={(option) => option.category}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option.category}
              <span style={{ position: "absolute", right: "10px" }}>
                {option.count}
              </span>
            </li>
          )}
          style={{ width: 220 }}
          onChange={categoriesFilterHandler}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Categories"
              placeholder="Search ..."
            />
          )}
        />
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Category</th>
            <th>Type</th>
            <th>Brand</th>
            <th>Price</th>
            <th>Product</th>
            <th>
              Items Sold
              <button
                id="items_sold_sort"
                onClick={() => handleSort("items_sold")}
              >
                &#9660;
              </button>
            </th>
            <th>
              Total Sales{" "}
              <button
                id="total_sales_sort"
                onClick={() => handleSort("total_sales")}
              >
                &#9660;
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {purchases ? (
            purchases.map((purchase, index) => (
              <tr key={index} id={"row_" + index}>
                <td>{purchase.category}</td>
                <td>{purchase.type}</td>
                <td>{purchase.brand}</td>
                <td>{purchase.price}</td>
                <td>{purchase.image}</td>
                <td>{purchase.items_sold}</td>
                <td>{purchase.total_sales}</td>
              </tr>
            ))
          ) : (
            <></>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default PurchaseScreen;
