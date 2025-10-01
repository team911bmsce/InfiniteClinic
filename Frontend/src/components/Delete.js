import { React, useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import AxiosInstance from "./Axios";
import Dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useNavigate, useParams } from "react-router-dom";

Dayjs.extend(utc);

const Delete = () => {
  const MyParams = useParams();
  const MyId = MyParams.id;

  const [myData, setMyData] = useState();
  const [loading, setLoading] = useState(true);
  const GetData = () => {
    AxiosInstance.get(`test/${MyId}`).then((res) => {
      setMyData(res.data);
      console.log(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    GetData();
  }, []);
  const navigate = useNavigate();

  const submission = (data) => {
    AxiosInstance.delete(`test/${MyId}/`)
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
        <div>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              backgroundColor: "#00003f",
              marginBottom: "10px",
            }}
          >
            <Typography sx={{ marginLeft: "20px", color: "#ffff" }}>
              Delete test:{myData.name}
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
              Are you sure you want to delete {myData.name}
              <Button
                variant="contained"
                color="error"
                onClick={submission}
                sx={{ width: "50%" }}
              >
                Delete
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate("/")}
                sx={{ width: "50%" }}
              >
                No
              </Button>
            </Box>
          </Box>
        </div>
      )}
    </div>
  );
};

export default Delete;
