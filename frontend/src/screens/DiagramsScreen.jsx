import { useEffect, useState, useRef } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts";
import {
  useGetDiagramMutation,
  useGetDiagramsMutation,
} from "../slices/api/itemsApiSlice";
import {
  useSaveSelectedFiltersMutation,
  useLoadSelectedFiltersMutation,
} from "../slices/api/userPresetApiSlice";
import DiagramFilters from "../components/DiagramFilters";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ConfirmationDialogue from "../components/ConfirmationDialogue";
import Tooltip from "@mui/material/Tooltip";
import { faTrashCan, faSave } from "@fortawesome/free-solid-svg-icons";

const defaultChartSetting = {
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
  const [open, setOpen] = useState(false);

  const [changesMade, setChangesMade] = useState(false);

  const [fetchDiagram] = useGetDiagramMutation();
  const [fetchDiagrams] = useGetDiagramsMutation();
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

  const handleUnload = (event) => {
    if (changesMade) {
      event.preventDefault();
      event.returnValue = "";
    }
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleUnload);
  }, []);

  const constructDiagram = (diagram) => {
    const valueFormatter = (value) =>
      diagram.yUnits == "items_sold"
        ? `${value} items`
        : `${formatter.format(value)}`;
    const series = diagram.comparee.map((comparee) => {
      return {
        dataKey: comparee,
        label: comparee,
        valFormatter: valueFormatter,
      };
    });
    return {
      data: diagram.diagram,
      series: series,
      yUnits: diagram.yUnits == "items_sold" ? "Items sold" : "Total sales",
    };
  };

  useEffect(() => {
    (async () => {
      try {
        const selectedFilters_result = await loadSelectedFilters({
          user_id: userInfo.user_info._id,
        }).unwrap();
        const diagramData_result = await fetchDiagrams({
          multipleSelectedFilters: selectedFilters_result.selectedFilters,
        }).unwrap();
        const newDiagramData = [];

        for (const diagram of diagramData_result.diagrams) {
          const diagData = constructDiagram(diagram);
          newDiagramData.push(diagData);
        }
        setSelectedFilters(selectedFilters_result.selectedFilters);
        setDiagramData(newDiagramData);
        setSelectedDiagram(0);
      } catch (err) {
        console.log(err);
        toast.error("Error loading diagrams");
      }
    })();
  }, []);

  useEffect(() => {
    myRef.current[selectedDiagram].scrollIntoView();
  }, [selectedDiagram]);

  useEffect(() => {
    setChangesMade(true);
  }, [selectedFilters]);

  const fetchData = async () => {
    const result = await fetchDiagram({
      selectedFilters: selectedFilters[selectedDiagram],
    }).unwrap();
    const diagData = constructDiagram(result);

    const diagramDataCopy = [...diagramData];
    diagramDataCopy[selectedDiagram] = diagData;

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

  const handleConfirm = () => {
    removeSelectedDiagram();
    setOpen(false);
  };

  const removeSelectedDiagram = () => {
    setSelectedDiagram(0);
    const selectedFiltersCopy = [...selectedFilters];
    selectedFiltersCopy.splice(selectedDiagram, 1);
    if (selectedFiltersCopy.length == 0) {
      selectedFiltersCopy.push(initialSelectedFilter);
    }
    setSelectedFilters(selectedFiltersCopy);
    const diagramDataCopy = [...diagramData];
    diagramDataCopy.splice(selectedDiagram, 1);
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
      setChangesMade(false);
      toast.success("Diagrams saved successfully");
    } catch (err) {
      toast.success("Error saving diagrams");
    }
  };

  const formatter = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  });

  return (
    <div
      id="filtered-table"
      style={{
        postiion: "relative",
      }}
    >
      <ConfirmationDialogue
        open={open}
        handleConfirm={() => handleConfirm()}
        handleCancel={() => setOpen(false)}
      />
      <Tooltip title="Save progress" enterDelay={800} placement="left">
        <button
          style={{
            position: "absolute",
            right: "20px",
            top: "10px",
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
      </Tooltip>
      <Tooltip title="Add diagram" enterDelay={800} placement="left">
        <button
          style={{
            position: "absolute",
            right: "20px",
            top: "70px",
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
      </Tooltip>
      <Tooltip title="Remove diagram" enterDelay={800} placement="left">
        <button
          style={{
            position: "absolute",
            right: "20px",
            top: "130px",
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
          onClick={() => setOpen(true)}
        >
          <FontAwesomeIcon icon={faTrashCan} />
        </button>
      </Tooltip>
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
                yAxis={[{ label: data.yUnits }]}
                {...defaultChartSetting}
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
