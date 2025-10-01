import { React, useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import MyTextField from "./forms/MyTextField";
import MyMultiLineField from "./forms/MyMultiLineField";
import MyDatePickerField from "./forms/MyDatePickerField";
import { useForm } from "react-hook-form";
import AxiosInstance from "./Axios";
import Dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useNavigate, useParams } from "react-router-dom";
import MySelectField from "./forms/MySelectField";
Dayjs.extend(utc);

const Create = () => {
  const [branch, setBranch] = useState();
  const [loading, setLoading] = useState(true);

  const hardcoded_options = [
    { id: "", name: "None" },
    { id: "Open", name: "Open" },
    { id: "In progress", name: "In progress" },
    { id: "Completed", name: "Completed" },
  ];
  const GetData = () => {
    AxiosInstance.get(`branch/`).then((res) => {
      setBranch(res.data);
      console.log(res.data);
      setLoading(false);
    });
  };
  useEffect(() => {
    GetData();
  }, []);

  const navigate = useNavigate();
  const defaultValues = {
    name: "",
    testid: "",
    description: "",
    category: "",
    branch: "",
    price: "",
    available_time: null,
  };
  const { handleSubmit, reset, control } = useForm({
    defaultValues: defaultValues,
  });
  const submission = (data) => {
    const availableTime = data.available_time
      ? data.available_time.toISOString()
      : null;

    AxiosInstance.post("test/", {
      testid: data.testid ? parseInt(data.testid, 10) : null, // must be integer
      name: data.name,
      available_time: availableTime,
      description: data.description || null,
      category: data.category || null,
      branch: data.branch ? parseInt(data.branch, 10) : null,
      price: data.price ? parseFloat(data.price) : null, // must be number
    })
      .then((res) => {
        console.log("Success:", res.data);
        navigate(`/`);
      })
      .catch((err) => console.error("Error:", err.response?.data || err));
  };

  return (
    <div>
      {loading ? (
        <p>Loading!</p>
      ) : (
        <form onSubmit={handleSubmit(submission)}>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              backgroundColor: "#00003f",
              marginBottom: "10px",
            }}
          >
            <Typography sx={{ marginLeft: "20px", color: "#ffff" }}>
              Create Tests
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              boxShadow: 3,
              padding: 4,
              flexDirection: "column",
              borderRadius: "20px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
                marginBottom: "40px",
              }}
            >
              <MyTextField
                label="Test ID"
                name="testid"
                control={control}
                placeholder="Enter test ID"
                width={"20%"}
              />
              <MyTextField
                label="Test Name"
                name="name"
                control={control}
                placeholder="Enter test name"
                width={"30%"}
              />
              <MyDatePickerField
                label="Enter Available date"
                name="available_time"
                control={control}
                width={"25%"}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <MyMultiLineField
                label="Description"
                name="description"
                control={control}
                placeholder="Enter test description"
                width={"30%"}
              />
              <MyTextField
                label="Category"
                name="category"
                control={control}
                placeholder="Enter test category"
                width={"30%"}
              />
              <MySelectField
                label="Branch"
                name="branch"
                control={control}
                width={"30%"}
                options={branch}
              />
              <MyTextField
                label="Price"
                name="price"
                control={control}
                placeholder="Enter test price"
                width={"15%"}
              />
            </Box>
            <Box sx={{ width: "30%", marginTop: "20px" }}>
              <Button variant="contained" type="submit" sx={{ width: "50%" }}>
                Submit
              </Button>
            </Box>
          </Box>
        </form>
      )}
    </div>
  );
};

export default Create;
