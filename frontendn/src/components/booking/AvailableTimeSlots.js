import { React, useEffect, useState, useMemo } from "react";
import AxiosInstance from "../Axios";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Typography,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const AvailableSlotsView = () => {
  const [tests, setTests] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    test: "",
    date: "",
    start_time: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  // Fetch tests
  const fetchTests = async () => {
    try {
      const res = await AxiosInstance.get("test/");
      setTests(res.data);
    } catch (err) {
      console.error(err.response?.data);
      showSnackbar("Failed to fetch tests", "error");
    }
  };

  // Fetch available timeslots
  const fetchSlots = async () => {
    setLoading(true);
    try {
      let url = "timeslot/?available=true";
      if (filters.test) url += `&test_id=${filters.test}`;
      if (filters.date) url += `&date=${filters.date}`;

      const res = await AxiosInstance.get(url);
      setSlots(res.data);
    } catch (err) {
      console.error(err.response?.data);
      showSnackbar("Failed to fetch slots", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
    fetchSlots();
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    fetchSlots();
  };

  // Navigate to confirm booking page
  const handleBook = (slot) => {
    navigate("/confirm-booking", { state: { slot } });
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} mb={2}>
        Available Time Slots
      </Typography>

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <TextField
          select
          label="Test"
          name="test"
          value={filters.test}
          onChange={handleFilterChange}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">-- All Tests --</MenuItem>
          {tests.map((t) => (
            <MenuItem key={t.id} value={t.id}>
              {t.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Date"
          type="date"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
          InputLabelProps={{ shrink: true }}
        />

        <Button variant="contained" onClick={applyFilters}>
          Apply Filters
        </Button>
      </Box>

      {/* Slots Table */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : slots.length === 0 ? (
        <Typography>No available slots found.</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Test</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Available Slots</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {slots.map((slot) => (
              <TableRow key={slot.id}>
                <TableCell>{slot.test_name}</TableCell>
                <TableCell>{slot.date}</TableCell>
                <TableCell>
                  {slot.start_time} - {slot.end_time}
                </TableCell>
                <TableCell>
                  {slot.unlimited_patients ? "Unlimited" : slot.available_slots}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleBook(slot)}
                  >
                    Book
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

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

export default AvailableSlotsView;
