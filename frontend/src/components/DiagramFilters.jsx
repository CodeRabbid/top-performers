import { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Chip from "@mui/material/Chip";
import Checkbox from "@mui/material/Checkbox";
import { useGetFiltersMutation } from "../slices/api/itemsApiSlice.js";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const DiagramFilters = ({ selectedFilters, setSelectedFilters }) => {
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
      }).unwrap();
      console.log(result);
      setFilters(result);
    })();
  }, []);

  const filterHandler = (event, values, column) => {
    const selected = values.map((value) => value.name);
    setSelectedFilters((selectedFilters) => ({
      ...selectedFilters,
      [column]: selected,
    }));
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
    </>
  );
};

export default DiagramFilters;
