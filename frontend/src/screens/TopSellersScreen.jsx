import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from "react-redux";
import { Col, Form } from "react-bootstrap";
import { useGetItemsMutation } from "../slices/api/itemsApiSlice.js";
import { Container } from "react-bootstrap";

import dayjs from "dayjs";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-daterangepicker/daterangepicker.css";
import { DataGrid } from "@mui/x-data-grid";

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
  const [items, setItems] = useState([]);

  const [fetchTopSellers, { isLoading }] = useGetItemsMutation();

  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    types: [],
    brands: [],
    price_range: [],
    earliest_purchase_date: dayjs("2000-01-01"),
    latest_purchase_date: dayjs("2024-04-26"),
  });

  const [maxCount, setMaxcount] = useState(0);
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
  }, [paginationModel, setPaginationModel]);

  const fetchItems = async () => {
    const result = await fetchTopSellers({
      selectedFilters,
      sortModel,
      paginationModel,
    }).unwrap();
    setItems(result.purchase);
    setMaxcount(result.count);
  };

  const handleApply = async () => {
    await fetchItems();
  };

  return (
    <div id="filtered-table" style={{}}>
      <TopSellersFilters
        handleApply={handleApply}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
      />
      <div
        id="table"
        style={{ flex: "1 1 auto", height: "0%", width: "99%", maxWidth: 900 }}
      >
        <DataGrid
          columns={columns}
          rows={items}
          loading={isLoading}
          onSortModelChange={(newSortModel) => setSortModel(newSortModel)}
          onPaginationModelChange={setPaginationModel}
          rowCount={maxCount}
          pageSizeOptions={[5, 25, 50, 100]}
          paginationModel={paginationModel}
          paginationMode="server"
        />
      </div>
    </div>
  );
};

export default PurchaseScreen;
