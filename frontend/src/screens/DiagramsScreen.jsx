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

const valueFormatter = (value) => `${value} items`;

const DiagramsScreen = () => {
  //   console.error("Failed prop typ");

  const [fetchDiagram, { isLoading }] = useGetDiagramMutation();
  const [diagramData, setDiagramData] = useState({
    data: [
      {
        Item: 0,
        time_unit: "All time",
      },
    ],
    series: [{ dataKey: "Item", label: "Item", valueFormatter }],
  });

  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    types: [],
    brands: [],
    price_range: [],
    earliest_purchase_date: dayjs("2000-01-01"),
    latest_purchase_date: dayjs("2024-04-26"),
  });

  useEffect(() => {
    (async () => {
      await fetchData();
    })();
  }, []);

  const fetchData = async () => {
    const result = await fetchDiagram({ selectedFilters }).unwrap();
    setDiagramData({
      data: result.diagram,
      series: [
        { dataKey: "adidas", label: "adidas", valueFormatter },
        { dataKey: "UGG", label: "UGG", valueFormatter },
        { dataKey: "UGG Kids", label: "UGG Kids", valueFormatter },
      ],
    });
    console.log(result.diagram);
  };

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
      />
    </div>
  );
};

export default DiagramsScreen;
