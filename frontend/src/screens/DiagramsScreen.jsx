import { useEffect, useState, useRef } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { ChartContainer } from "@mui/x-charts";
import { axisClasses } from "@mui/x-charts";
import { useGetDiagramMutation } from "../slices/api/itemsApiSlice";
import DiagramFilters from "../components/DiagramFilters";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import dayjs from "dayjs";

const chartSetting = {
  yAxis: [
    {
      label: "Items sold",
    },
  ],
  width: 500,
  height: 300,
  sx: {
    [`.${axisClasses.left} .${axisClasses.label}`]: {
      transform: "translate(-20px, 0)",
    },
  },
};

const DiagramsScreen = () => {
  const [fetchDiagram, { isLoading }] = useGetDiagramMutation();
  const [selectedDiagram, setSelectedDiagram] = useState(1);
  const [diagramData, setDiagramData] = useState([
    {
      data: [],
      series: [],
    },
    {
      data: [],
      series: [],
    },
  ]);

  const [selectedFilters, setSelectedFilters] = useState([
    {
      xUnits: "month",
      yUnits: "items_sold",
      comparee: "age_group",
      age_group: "18-24,25-35",
      categories: [],
      types: [],
      brands: [],
      price_range: [],
      genders: ["male", "female", "diverse"],
      earliest_purchase_date: dayjs("2000-01-01"),
      latest_purchase_date: dayjs("2024-04-26"),
    },
    {
      xUnits: "month",
      yUnits: "items_sold",
      comparee: "age_group",
      age_group: "18-24,25-35",
      categories: [],
      types: [],
      brands: [],
      price_range: [],
      genders: ["male", "female", "diverse"],
      earliest_purchase_date: dayjs("2000-01-01"),
      latest_purchase_date: dayjs("2024-04-26"),
    },
  ]);

  const fetchData = async () => {
    const result = await fetchDiagram({
      selectedFilters: selectedFilters[selectedDiagram],
    }).unwrap();
    console.log(result);
    const series = result.comparee.map((comparee) => {
      return { dataKey: comparee, label: comparee, valueFormatter };
    });
    const diagramDataCopy = [...diagramData];
    diagramDataCopy[selectedDiagram] = {
      data: result.diagram,
      series: series,
    };
    setDiagramData(diagramDataCopy);
  };

  const handleApply = async () => {
    await fetchData();
  };

  const formatter = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  });

  const valueFormatter = (value) =>
    selectedFilters.yUnits == "items_sold"
      ? `${value} items`
      : `${formatter.format(value)}`;
  return (
    <div id="filtered-table">
      <div
        style={{
          flex: "1 1 auto",
          height: "0%",
          overflowY: "scroll",
        }}
      >
        <FormControl fullWidth>
          <InputLabel id="selected-diagram-select">Diagram</InputLabel>
          <Select
            value={selectedDiagram}
            label="selected-diagram"
            onChange={(e) => setSelectedDiagram(e.target.value)}
            style={{ width: 102 }}
          >
            <MenuItem value={0}>0</MenuItem>
            <MenuItem value={1}>1</MenuItem>
          </Select>
        </FormControl>
        {diagramData.map((data, index) => (
          <div
            style={{
              display: "block",
              margin: "0px auto 0px auto",
              position: "relative",
              width: "500px",
            }}
            key={0}
          >
            <BarChart
              margin={{
                left: 70,
                right: 20,
                top: 20,
                bottom: 30,
              }}
              dataset={data.data}
              xAxis={[{ scaleType: "band", dataKey: "time_unit" }]}
              series={data.series}
              {...chartSetting}
            />
          </div>
        ))}
      </div>
      <div style={{}}>
        <DiagramFilters
          selectedDiagram={selectedDiagram}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          handleApply={handleApply}
        />
      </div>
    </div>
  );
};

export default DiagramsScreen;
