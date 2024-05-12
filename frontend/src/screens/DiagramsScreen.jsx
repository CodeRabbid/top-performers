import { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts";
import { useGetDiagramMutation } from "../slices/api/itemsApiSlice";
import DiagramFilters from "../components/DiagramFilters";

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
  const [diagramData, setDiagramData] = useState({
    data: [],
    series: [],
  });

  const [selectedFilters, setSelectedFilters] = useState({
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
  });

  const fetchData = async () => {
    const result = await fetchDiagram({ selectedFilters }).unwrap();
    console.log(result);
    const series = result.comparee.map((comparee) => {
      return { dataKey: comparee, label: comparee, valueFormatter };
    });
    setDiagramData({
      data: result.diagram,
      series: series,
    });
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
    <div
      style={{
        height: "100%",
        flex: "1 1 auto",
        pointerEvents: isLoading ? "none" : "",
      }}
    >
      <BarChart
        dataset={diagramData.data}
        xAxis={[{ scaleType: "band", dataKey: "time_unit" }]}
        series={diagramData.series}
        {...chartSetting}
      />

      <DiagramFilters
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
        handleApply={handleApply}
      />
    </div>
  );
};

export default DiagramsScreen;
