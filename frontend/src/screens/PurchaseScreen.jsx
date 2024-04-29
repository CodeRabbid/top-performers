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
import { DataGrid } from "@mui/x-data-grid";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Slider from "@mui/material/Slider";
import "dayjs/locale/de";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const columns = [
  {
    field: "image_url",
    headerName: "",
    editable: true,
    renderCell: (params) => (
      <img src={params.value} style={{ maxHeight: "46px" }} />
    ),
    sortable: false,
  },
  {
    field: "category",
    headerName: "Category",
    editable: true,
  },
  {
    field: "type",
    headerName: "Type",
    editable: true,
  },
  {
    field: "brand",
    headerName: "Brand",
    editable: true,
  },
  {
    field: "model",
    headerName: "Model",
    editable: true,
  },
  {
    field: "price",
    headerName: "Price",
    editable: true,
  },
  {
    field: "items_sold",
    headerName: "Items Sold",
    editable: true,
  },
  {
    field: "total_sales",
    headerName: "Total Sales",
    editable: true,
  },
];

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const PurchaseScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [purchases, setPurchases] = useState([]);

  const [allPurchases, { isLoading }] = useAllPurchasesMutation();
  const [getFilters] = useGetFiltersMutation();

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

  const [maxCount, setMaxcount] = useState(0);

  const [priceRange, setPriceRange] = useState([]);
  const [priceRangeRange, setPriceRangeRange] = useState([18, 99]);
  const [sortModel, setSortModel] = useState([
    {
      field: "items_sold",
      sort: "desc",
    },
  ]);

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 25,
    page: 0,
  });

  useEffect(() => {
    (async () => {
      const result = await getFilters({
        selectedFilters,
        earliestPurchaseDate,
        latestPurchaseDate,
        priceRange,
      }).unwrap();
      setFilters(result);
      setPriceRangeRange(result.price_range);
      setPriceRange(result.price_range);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const result = await getFilters({
        selectedFilters,
        earliestPurchaseDate,
        latestPurchaseDate,
        priceRange,
      }).unwrap();
      setFilters(result);
      setPriceRangeRange(result.price_range);
    })();
  }, [selectedFilters, earliestPurchaseDate, latestPurchaseDate, priceRange]);

  useEffect(() => {
    (async () => {
      const result = await allPurchases({
        selectedFilters,
        earliestPurchaseDate,
        latestPurchaseDate,
        priceRange,
        sortModel,
        paginationModel,
      }).unwrap();
      setPurchases(result.purchase);
      setMaxcount(result.count);
      console.log(result);
    })();
  }, [
    selectedFilters,
    earliestPurchaseDate,
    latestPurchaseDate,
    priceRange,
    sortModel,
    paginationModel,
  ]);

  const filterHandler = (event, values, column) => {
    const selected = values.map((value) => value.name);
    setSelectedFilters((selectedFilters) => ({
      ...selectedFilters,
      [column]: selected,
    }));
  };

  const handleEarliestPurchaseDate = (value) => {
    if (value > latestPurchaseDate) setLatestPurchaseDate(value);
    setEarlierstPurchaseDate(value);
  };
  const handleLatestPurchaseDate = (value) => {
    if (value < earliestPurchaseDate) setEarlierstPurchaseDate(value);
    setLatestPurchaseDate(value);
  };

  function valuetext(value) {
    return `${value}°C`;
  }

  const handlePriceRange = (event, newPriceRange) => {
    setPriceRange(newPriceRange);
  };

  return (
    <div style={{ width: "100%" }}>
      <Container style={{ width: "100%", maxWidth: "100%" }}>
        <div style={{ width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              p: 1,
              m: 1,
              bgcolor: "background.paper",
              borderRadius: 1,
            }}
          >
            <div>
              <div style={{ float: "left", margin: "0 5px 0 0" }}>
                <Autocomplete
                  multiple
                  limitTags={1}
                  id="categories-filter"
                  isOptionEqualToValue={(option, value) =>
                    option.name === value.name
                  }
                  options={filters.categories}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.name}
                  renderOption={(props, option, { selected }) => {
                    const { k, ...restProps } = props;
                    const key = option.key;
                    const prop = { ...restProps };
                    return (
                      <li {...props} key={option.name}>
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
                  renderTags={(tagValue, getTagProps) => {
                    return tagValue.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={option.name}
                        label={option.name}
                      />
                    ));
                  }}
                  style={{ width: 240 }}
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
                  isOptionEqualToValue={(option, value) =>
                    option.name === value.name
                  }
                  options={filters.types}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.name}
                  renderOption={(props, option, { selected }) => {
                    const { key, ...restProps } = props;
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
                  renderTags={(tagValue, getTagProps) => {
                    return tagValue.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={option.name}
                        label={option.name}
                      />
                    ));
                  }}
                  style={{ width: 240 }}
                  onChange={(event, values) =>
                    filterHandler(event, values, "types")
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Types"
                      placeholder="Search ..."
                    />
                  )}
                />
              </div>
              <div style={{ float: "left", margin: "0 5px 0 0" }}>
                <Autocomplete
                  multiple
                  limitTags={1}
                  id="brands-filter"
                  isOptionEqualToValue={(option, value) =>
                    option.name === value.name
                  }
                  options={filters.brands}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.name}
                  renderOption={(props, option, { selected }) => {
                    const { key, ...restProps } = props;
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
                  renderTags={(tagValue, getTagProps) => {
                    return tagValue.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={option.name}
                        label={option.name}
                      />
                    ));
                  }}
                  style={{ width: 240 }}
                  onChange={(event, values) =>
                    filterHandler(event, values, "brands")
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Brands"
                      placeholder="Search ..."
                    />
                  )}
                />
              </div>
            </div>
          </Box>
        </div>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            p: 1,
            m: 1,
            bgcolor: "background.paper",
            borderRadius: 1,
          }}
        >
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
            style={{ width: "220px", float: "left", margin: "0 15px 0 0" }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
              <DatePicker
                label="Latest purchase date"
                value={latestPurchaseDate}
                onChange={(newValue) => handleLatestPurchaseDate(newValue)}
              />
            </LocalizationProvider>
          </div>
          <div
            id="price-range-slider"
            style={{ width: "220px", float: "left", margin: "0px 5px 0 10px" }}
          >
            <div>Price Range</div>
            <Slider
              min={priceRangeRange[0]}
              max={priceRangeRange[1]}
              getAriaLabel={() => "Temperature range"}
              value={priceRange}
              onChange={handlePriceRange}
              valueLabelDisplay="auto"
              getAriaValueText={valuetext}
            />
          </div>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            p: 1,
            m: 1,
            bgcolor: "background.paper",
            borderRadius: 1,
            width: "100%",
          }}
        >
          <div id="table" style={{ width: "100%", height: 450 }}>
            <DataGrid
              disableColumnFilter
              columns={columns}
              rows={purchases}
              loading={isLoading}
              onSortModelChange={(newSortModel) => setSortModel(newSortModel)}
              onPaginationModelChange={setPaginationModel}
              rowCount={maxCount}
              pageSizeOptions={[25, 50]}
              paginationModel={paginationModel}
              paginationMode="server"
            />
          </div>
        </Box>
      </Container>
    </div>
  );
};

export default PurchaseScreen;
