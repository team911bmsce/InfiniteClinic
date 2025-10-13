import React, { useEffect, useState } from "react";
import AxiosInstance from "../Axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await AxiosInstance.get("booking/?mine=true");
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        My Bookings
      </Typography>
      {bookings.length === 0 ? (
        <Typography>No bookings yet.</Typography>
      ) : (
        bookings.map((b) => (
          <Card key={b.id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography>
                Test: <strong>{b.test_name}</strong>
              </Typography>
              <Typography>
                Date: <strong>{b.slot_date}</strong>
              </Typography>
              <Typography>
                Time: <strong>{b.slot_time}</strong>
              </Typography>
              <Typography>
                Booking Date: <strong>{b.booking_date}</strong>
              </Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default MyBookings;
