import React, { useEffect, useState } from "react";
import AxiosInstance from "../Axios";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import TimeSlotModal from "./TimeSlotModal";
import { useNavigate } from "react-router-dom";

const TestList = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchTests = async () => {
    try {
      const res = await AxiosInstance.get("test/");
      setTests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handleBookClick = (test) => {
    setSelectedTest(test);
    setModalOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {tests.map((test) => (
            <Grid item xs={12} md={6} lg={4} key={test.id}>
              <Card sx={{ minHeight: 200 }}>
                <CardContent>
                  <Typography variant="h6">{test.name}</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {test.description}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ mt: 2 }}>
                    ₹{test.price}
                  </Typography>
                  {test.package && (
                    <Typography variant="body2" color="text.secondary">
                      Package: {test.package.name}
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    onClick={() => handleBookClick(test)}
                  >
                    Book
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {selectedTest && (
        <TimeSlotModal
          open={modalOpen}
          setOpen={setModalOpen}
          test={selectedTest}
          onBookingConfirmed={(bookingId) =>
            navigate(`/booking/confirm/${bookingId}`)
          }
        />
      )}
    </Box>
  );
};

export default TestList;
