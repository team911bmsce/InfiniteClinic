import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  CircularProgress,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
} from "@mui/material";
import AxiosInstance from "../Axios";

const TimeSlotModal = ({ open, setOpen, test, onBookingConfirmed }) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Fetch available slots
  const fetchSlots = async () => {
    setLoading(true);
    try {
      const res = await AxiosInstance.get(
        `timeslot/?test_id=${test.id}&available=true`
      );
      setSlots(res.data);
    } catch (err) {
      console.error("Error fetching slots:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchSlots();
  }, [open]);

  // Handle booking click
  const handleBooking = async (slot) => {
    setBookingLoading(true);
    try {
      const payload = {
        test: test.id,
        timeslot: slot.id,
      };
      const res = await AxiosInstance.post("booking/", payload);
      setOpen(false);
      // Pass booking id to parent (confirmation page)
      onBookingConfirmed(res.data.id);
    } catch (err) {
      console.error("Booking error:", err.response || err);
      alert(err.response?.data?.detail || "Booking failed! Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 2,
          p: 3,
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Available Slots for {test.name}
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress />
          </Box>
        ) : slots.length === 0 ? (
          <Typography>No available slots</Typography>
        ) : (
          <List>
            {slots.map((slot) => (
              <ListItem key={slot.id} disablePadding>
                <ListItemButton
                  onClick={() => handleBooking(slot)}
                  disabled={!slot.available || bookingLoading}
                >
                  <ListItemText
                    primary={`${slot.date} ${slot.start_time}-${slot.end_time}`}
                    secondary={
                      slot.unlimited_patients
                        ? "Unlimited"
                        : `${slot.available_slots} left`
                    }
                  />
                  {!slot.available && (
                    <Chip label="Full" color="error" size="small" />
                  )}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}

        {bookingLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button onClick={() => setOpen(false)} disabled={bookingLoading}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default TimeSlotModal;
