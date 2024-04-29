import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from "react-redux";
import { Col, Form } from "react-bootstrap";
import { useAllPurchasesMutation } from "../slices/api/purchaseApiSlice.js";
import { Container } from "react-bootstrap";

import dayjs from "dayjs";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-daterangepicker/daterangepicker.css";
import { DataGrid } from "@mui/x-data-grid";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

import "dayjs/locale/de";

import TopSellersFilters from "../components/TopSellerFilters.jsx";

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

const PurchaseScreen = () => {
  const [purchases, setPurchases] = useState([]);

  const [allPurchases, { isLoading }] = useAllPurchasesMutation();

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
      await fetchItems();
    })();
  }, []);

  const fetchItems = async () => {
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
  };

  const handleApply = async () => {
    await fetchItems();
  };

  return (
    <div style={{ width: "100%" }}>
      <Container style={{ width: "100%", maxWidth: "100%" }}>
        <TopSellersFilters
          earliestPurchaseDate={earliestPurchaseDate}
          setEarlierstPurchaseDate={setEarlierstPurchaseDate}
          latestPurchaseDate={latestPurchaseDate}
          setLatestPurchaseDate={setLatestPurchaseDate}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          handleApply={handleApply}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
        />

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
