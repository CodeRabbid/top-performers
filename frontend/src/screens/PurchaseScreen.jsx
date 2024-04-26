import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from "react-redux";
import { Col, Form } from "react-bootstrap";
import {
  useAllPurchasesMutation,
  useGetFiltersMutation,
} from "../slices/api/purchaseApiSlice.js";
import { Navbar, Nav, Container } from "react-bootstrap";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-daterangepicker/daterangepicker.css";

import "dayjs/locale/de";

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

  const [earliestPurchaseDate, setEarlierstPurchaseDate] = useState(
    dayjs("2000-01-01")
  );
  const [latestPurchaseDate, setLatestPurchaseDate] = useState(
    dayjs("2024-04-26")
  );

  useEffect(() => {
    (async () => {
      const result = await getFilters({
        selectedFilters,
        earliestPurchaseDate,
        latestPurchaseDate,
      }).unwrap();
      setFilters(result);
    })();
  }, [selectedFilters, earliestPurchaseDate, latestPurchaseDate]);

  useEffect(() => {
    (async () => {
      const result = await allPurchases({
        sortBy,
        selectedFilters,
        earliestPurchaseDate,
        latestPurchaseDate,
      }).unwrap();
      setPurchases(result.purchase);
    })();
  }, [sortBy, selectedFilters, earliestPurchaseDate, latestPurchaseDate]);

  const handleSort = (field) => {
    setSortBy(field);
  };

  const filterHandler = (event, values, column) => {
    const selected = values.map((value) => value.name);
    setSelectedFilters((selectedFilters) => ({
      ...selectedFilters,
      [column]: selected,
    }));
  };

  const handleEarliestPurchaseDate = (value) => {
    setEarlierstPurchaseDate(value);
    if (value > latestPurchaseDate) {
      setLatestPurchaseDate(value);
    }
  };
  const handleLatestPurchaseDate = (value) => {
    setLatestPurchaseDate(value);
    if (value < earliestPurchaseDate) {
      setEarlierstPurchaseDate(value);
    }
  };

  return (
    <Container>
      <div style={{ float: "left", margin: "0 5px 0 0" }}>
        <Autocomplete
          multiple
          limitTags={1}
          id="categories-filter"
          isOptionEqualToValue={(option, value) => option.name === value.name}
          options={filters.categories}
          disableCloseOnSelect
          getOptionLabel={(option) => option.name}
          renderOption={(props, option, { selected }) => {
            const { key, ...restProps } = props;
            const prop = { ...restProps };
            return (
              <li {...restProps} key={key}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option.name}
                <span style={{ position: "absolute", right: "10px" }}>
                  {option.count}
                </span>
              </li>
            );
          }}
          style={{ width: 220 }}
          onChange={(event, values) =>
            filterHandler(event, values, "categories")
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Categories"
              placeholder="Search ..."
            />
          )}
        />
      </div>
      <div style={{ float: "left", margin: "0 5px 0 0" }}>
        <Autocomplete
          multiple
          limitTags={1}
          id="types-filter"
          isOptionEqualToValue={(option, value) => option.name === value.name}
          options={filters.types}
          disableCloseOnSelect
          getOptionLabel={(option) => option.name}
          renderOption={(props, option, { selected }) => {
            const { key, ...restProps } = props;
            const prop = { ...restProps };
            return (
              <li {...restProps} key={key}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option.name}
                <span style={{ position: "absolute", right: "10px" }}>
                  {option.count}
                </span>
              </li>
            );
          }}
          style={{ width: 220 }}
          onChange={(event, values) => filterHandler(event, values, "types")}
          renderInput={(params) => (
            <TextField {...params} label="Types" placeholder="Search ..." />
          )}
        />
      </div>
      <div style={{ float: "left", margin: "0 5px 0 0" }}>
        <Autocomplete
          multiple
          limitTags={1}
          id="brands-filter"
          isOptionEqualToValue={(option, value) => option.name === value.name}
          options={filters.brands}
          disableCloseOnSelect
          getOptionLabel={(option) => option.name}
          renderOption={(props, option, { selected }) => {
            const { key, ...restProps } = props;
            const prop = { ...restProps };
            return (
              <li {...restProps} key={key}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option.name}
                <span style={{ position: "absolute", right: "10px" }}>
                  {option.count}
                </span>
              </li>
            );
          }}
          style={{ width: 220 }}
          onChange={(event, values) => filterHandler(event, values, "brands")}
          renderInput={(params) => (
            <TextField {...params} label="Brands" placeholder="Search ..." />
          )}
        />
      </div>
      <div
        id="earliest-purchase-date-picker"
        style={{ width: "220px", float: "left", margin: "0 5px 0 0" }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
          <DatePicker
            label="Earliest purchase date"
            value={earliestPurchaseDate}
            onChange={(newValue) => handleEarliestPurchaseDate(newValue)}
          />
        </LocalizationProvider>
      </div>
      <div
        id="latest-purchase-date-picker"
        style={{ width: "220px", float: "left", margin: "0 5px 0 0" }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
          <DatePicker
            label="Latest purchase date"
            value={latestPurchaseDate}
            onChange={(newValue) => handleLatestPurchaseDate(newValue)}
          />
        </LocalizationProvider>
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
