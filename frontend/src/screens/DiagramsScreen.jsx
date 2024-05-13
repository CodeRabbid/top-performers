import { useEffect, useState, useRef } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts";
import { useGetDiagramMutation } from "../slices/api/itemsApiSlice";
import {
  useSaveSelectedFiltersMutation,
  useLoadSelectedFiltersMutation,
} from "../slices/api/userPresetApiSlice";
import DiagramFilters from "../components/DiagramFilters";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faTrashCan, faSave } from "@fortawesome/free-solid-svg-icons";

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

const initialSelectedFilter = {
  xUnits: "month",
  yUnits: "items_sold",
  comparee: "age_group",
  age_group: "18-24,25-35",
  categories: [],
  types: [],
  brands: [],
  price_range: [],
  genders: ["male", "female", "diverse"],
  earliest_purchase_date: new Date(2000, 1, 1),
  latest_purchase_date: new Date(),
};
const initialDiagramData = {
  data: [],
  series: [],
};

const DiagramsScreen = () => {
  const [fetchDiagram] = useGetDiagramMutation();
  const [saveSelectedFilters] = useSaveSelectedFiltersMutation();
  const [loadSelectedFilters] = useLoadSelectedFiltersMutation();
  const [selectedDiagram, setSelectedDiagram] = useState(0);
  const { userInfo } = useSelector((state) => state.auth);

  const myRef = useRef([]);

  const [diagramData, setDiagramData] = useState([
    initialDiagramData,
    initialDiagramData,
  ]);

  const [selectedFilters, setSelectedFilters] = useState([
    initialSelectedFilter,
    initialSelectedFilter,
  ]);

  useEffect(() => {
    (async () => {
      console.log(userInfo.user_info);
      try {
        const result = await loadSelectedFilters({
          user_id: userInfo.user_info._id,
        }).unwrap();
        console.log(result);
      } catch (err) {
        console.log(err);
        toast.success("Error loading diagrams");
      }
    })();
  }, []);

  useEffect(() => {
    myRef.current[selectedDiagram].scrollIntoView();
  }, [selectedDiagram]);

  const fetchData = async () => {
    const result = await fetchDiagram({
      selectedFilters: selectedFilters[selectedDiagram],
    }).unwrap();

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

  const addDiagram = () => {
    const selectedFiltersCopy = [...selectedFilters];
    selectedFiltersCopy.push(initialSelectedFilter);
    setSelectedFilters(selectedFiltersCopy);
    const diagramDataCopy = [...diagramData];
    diagramDataCopy.push(initialDiagramData);
    setDiagramData(diagramDataCopy);
    setSelectedDiagram(diagramData.length);
  };

  const remveDiagram = (index) => {
    setSelectedDiagram(0);
    const selectedFiltersCopy = [...selectedFilters];
    selectedFiltersCopy.splice(index, 1);
    if (selectedFiltersCopy.length == 0) {
      selectedFiltersCopy.push(initialSelectedFilter);
    }
    setSelectedFilters(selectedFiltersCopy);
    const diagramDataCopy = [...diagramData];
    diagramDataCopy.splice(index, 1);
    if (diagramDataCopy.length == 0) {
      diagramDataCopy.push(initialDiagramData);
    }
    setDiagramData(diagramDataCopy);
  };

  const saveDiagrams = async () => {
    try {
      const result = await saveSelectedFilters({
        selectedFilters,
        user_id: userInfo.user_info._id,
      }).unwrap();
      toast.success("Diagrams saved successfully");
    } catch (err) {
      toast.success("Error saving diagrams");
    }
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
      id="filtered-table"
      style={{
        postiion: "relative",
      }}
    >
      <button
        style={{
          position: "absolute",
          right: "20px",
          top: "15px",
          borderRadius: "50%",
          height: "50px",
          width: "50px",
          border: "none",
          backgroundColor: "rgb(0, 99, 242)",
          color: "white",
          fontSize: "30px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={saveDiagrams}
      >
        <FontAwesomeIcon icon={faSave} />
      </button>
      <button
        style={{
          position: "absolute",
          right: "20px",
          top: "75px",
          borderRadius: "50%",
          height: "50px",
          width: "50px",
          border: "none",
          backgroundColor: "rgb(0, 99, 242)",
          color: "white",
          fontSize: "30px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "bold",
        }}
        onClick={addDiagram}
      >
        &#65291;
      </button>

      <button
        style={{
          position: "absolute",
          right: "20px",
          top: "135px",
          borderRadius: "50%",
          height: "50px",
          width: "50px",
          border: "none",
          backgroundColor: "rgb(0, 99, 242)",
          color: "white",
          fontSize: "30px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "bold",
        }}
        onClick={addDiagram}
      ></button>
      <div
        style={{
          flex: "1 1 auto",
          height: "0%",
          overflowY: "scroll",
          postiion: "relative ",
          display: "box",
        }}
      >
        {diagramData.map((data, index) => (
          <div
            style={{
              position: "relative",
              margin: "0px auto 0px 100px",
              width: "500px",
            }}
            key={index}
          >
            <button
              style={{
                position: "absolute",
                right: "-55px",
                bottom: "20px",
                borderRadius: "50%",
                height: "50px",
                width: "50px",
                border: "none",
                backgroundColor: "#DCDCDC",
                color: "white",
                fontSize: "30px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => remveDiagram(index)}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
            <div
              style={{
                display: "block",
                position: "relative",
                // margin: "0px auto 0px 100px",
                backgroundColor: index == selectedDiagram ? "#ebf2ff" : "",
                width: "500px",
              }}
              ref={(el) => (myRef.current[index] = el)}
              onClick={() => setSelectedDiagram(index)}
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
