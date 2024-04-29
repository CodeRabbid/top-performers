import { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Slider from "@mui/material/Slider";
import Checkbox from "@mui/material/Checkbox";
import {
  useAllPurchasesMutation,
  useGetFiltersMutation,
} from "../slices/api/purchaseApiSlice.js";
import dayjs from "dayjs";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const TopSellersFilters = ({
  earliestPurchaseDate,
  setEarlierstPurchaseDate,
  latestPurchaseDate,
  setLatestPurchaseDate,
  priceRange,
  setPriceRange,
  handleApply,
  selectedFilters,
  setSelectedFilters,
}) => {
  const [filters, setFilters] = useState({
    categories: [],
    types: [],
    brands: [],
    price_bounds: [],
  });

  const [getFilters] = useGetFiltersMutation();

  useEffect(() => {
    (async () => {
      const result = await getFilters({
        selectedFilters,
        earliestPurchaseDate,
        latestPurchaseDate,
        priceRange,
      }).unwrap();
      setFilters(result);
      setPriceRange(result.price_bounds);
      setSelectedFilters({
        ...selectedFilters,
        price_range: result.price_bounds,
      });
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
    })();
  }, [selectedFilters, earliestPurchaseDate, latestPurchaseDate, priceRange]);

  const handleEarliestPurchaseDate = (value) => {
    if (value > latestPurchaseDate) setLatestPurchaseDate(value);
    setEarlierstPurchaseDate(value);
  };

  const handleLatestPurchaseDate = (value) => {
    if (value < earliestPurchaseDate) setEarlierstPurchaseDate(value);
    setLatestPurchaseDate(value);
  };

  const filterHandler = (event, values, column) => {
    const selected = values.map((value) => value.name);
    setSelectedFilters((selectedFilters) => ({
      ...selectedFilters,
      [column]: selected,
    }));
  };

  const handlePriceRange = (event, newPriceRange) => {
    setPriceRange(newPriceRange);
    setSelectedFilters({ ...selectedFilters, price_range: newPriceRange });
  };

  return (
    <>
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
          style={{
            maxWidth: "200px",
            minWidth: "150px",
            float: "left",
            margin: "0px 25px 0 10px",
          }}
        >
          <div>Price Range</div>
          <Slider
            min={filters.price_bounds[0]}
            max={filters.price_bounds[1]}
            getAriaLabel={() => "Temperature range"}
            value={selectedFilters.price_range}
            onChange={handlePriceRange}
            valueLabelDisplay="auto"
            // getAriaValueText={valuetext}
          />
        </div>
        <div>
          <Button
            id="apply"
            style={{ height: 56, width: 100 }}
            variant="contained"
            onClick={handleApply}
          >
            Apply
          </Button>
        </div>
      </Box>
    </>
  );
};

export default TopSellersFilters;
