import { React, useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import AxiosInstance from "../Axios";

const ConfirmBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const slot = location.state?.slot;

  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  if (!slot) {
    navigate("/available-slots");
  }

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  // Fetch patients
  const fetchPatients = async () => {
    try {
      const res = await AxiosInstance.get("patients/");
      setPatients(res.data);
    } catch (err) {
      console.error(err.response?.data);
      showSnackbar("Failed to fetch patients", "error");
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Submit booking
  const handleBooking = async () => {
    if (!selectedPatient) {
      showSnackbar("Please select a patient", "error");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        patient: selectedPatient,
        test: slot.test,
        timeslot: slot.id,
      };

      await AxiosInstance.post("booking/", payload);
      showSnackbar("Booking successful!", "success");
      setTimeout(() => navigate("/available-slots"), 1500);
    } catch (err) {
      console.error(err.response?.data);
      const message =
        err.response?.data?.timeslot || "Failed to create booking";
      showSnackbar(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 5 }}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Confirm Booking
      </Typography>

      {/* Test */}
      <TextField
        label="Test"
        fullWidth
        margin="normal"
        value={slot?.test_name || ""}
        InputProps={{ readOnly: true }}
      />

      {/* Date */}
      <TextField
        label="Date"
        fullWidth
        margin="normal"
        value={slot?.date || ""}
        InputProps={{ readOnly: true }}
      />

      {/* Time */}
      <TextField
        label="Time"
        fullWidth
        margin="normal"
        value={`${slot?.start_time} - ${slot?.end_time}` || ""}
        InputProps={{ readOnly: true }}
      />

      {/* Patient */}
      <TextField
        select
        label="Select Patient"
        fullWidth
        margin="normal"
        value={selectedPatient}
        onChange={(e) => setSelectedPatient(e.target.value)}
      >
        <MenuItem value="">-- Select Patient --</MenuItem>
        {patients.map((p) => (
          <MenuItem key={p.id} value={p.id}>
            {p.first_name} {p.last_name || ""}
          </MenuItem>
        ))}
      </TextField>

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 3 }}
        onClick={handleBooking}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : "Confirm Booking"}
      </Button>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ConfirmBooking;
