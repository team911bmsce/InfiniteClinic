import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AxiosInstance from "../Axios";
import { Box, Typography, Button, CircularProgress } from "@mui/material";

const BookingConfirmation = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBooking = async () => {
    try {
      const res = await AxiosInstance.get(`booking/${id}/`);
      setBooking(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );

  if (!booking) return <Typography>Booking not found</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Booking Confirmed!
      </Typography>
      <Typography>
        Test: <strong>{booking.test_name}</strong>
      </Typography>
      <Typography>
        Date: <strong>{booking.slot_date}</strong>
      </Typography>
      <Typography>
        Time: <strong>{booking.slot_time}</strong>
      </Typography>
      <Typography>
        Patient: <strong>{booking.patient_name}</strong>
      </Typography>
      <Button
        component={Link}
        to="/my-bookings"
        variant="contained"
        sx={{ mt: 3 }}
      >
        Go to My Bookings
      </Button>
    </Box>
  );
};

export default BookingConfirmation;
