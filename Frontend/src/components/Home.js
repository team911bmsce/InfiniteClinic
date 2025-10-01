import { React, useEffect, useMemo, useState } from "react";
import AxiosInstance from "./Axios";
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_ColumnDef,
} from "material-react-table";
import { Box, IconButton } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";

const Home = () => {
  const [myData, setMyData] = useState();
  const [loading, setLoading] = useState(true);
  const GetData = () => {
    AxiosInstance.get(`test/`).then((res) => {
      setMyData(res.data);
      console.log(res.data);
      setLoading(false);
    });
  };
  useEffect(() => {
    GetData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "testid",
        header: "Test ID",
        size: 100,
      },
      {
        accessorKey: "name",
        header: "Test Name",
        size: 200,
      },
      {
        accessorKey: "available_time",
        header: "Available Time",
        size: 200,
        Cell: ({ cell }) => new Date(cell.getValue()).toLocaleString(), // ✅ format date nicely
      },
      {
        accessorKey: "description",
        header: "Description",
        size: 300,
      },
      {
        accessorKey: "category",
        header: "Category",
        size: 150,
      },
      {
        accessorKey: "price",
        header: "Price (₹)",
        size: 120,
        Cell: ({ cell }) => `₹${parseFloat(cell.getValue()).toFixed(2)}`, // ✅ format as currency
      },
    ],
    []
  );

  return (
    <div>
      {loading ? (
        <p>Loading!</p>
      ) : (
        <MaterialReactTable
          enableRowActions
          renderRowActions={({ row }) => (
            <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
              <IconButton
                color="secondary"
                component={Link}
                to={`edit/${row.original.id}`} // ✅ use correct field
              >
                <EditIcon />
              </IconButton>
              <IconButton
                color="error"
                component={Link}
                to={`delete/${row.original.id}`}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
          columns={columns}
          data={myData}
        />
      )}
    </div>
  );
};

export default Home;
