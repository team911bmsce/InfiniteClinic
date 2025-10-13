import React, { useEffect, useMemo, useState } from "react";
import AxiosInstance from "../Axios";
import { MaterialReactTable } from "material-react-table";
import {
  Box,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Edit as EditIcon, Add as AddIcon } from "@mui/icons-material";

const BookingsView = () => {
  const [bookings, setBookings] = useState([]);
  const [patients, setPatients] = useState([]);
  const [tests, setTests] = useState([]);
  const [timeslots, setTimeslots] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [formData, setFormData] = useState({
    patient: "",
    test: "",
    timeslot: "",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };
  const handleSnackbarClose = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  // ------------------ Fetch Data ------------------
  const fetchBookings = () => {
    setLoading(true);
    AxiosInstance.get("booking/") // adjust endpoint
      .then((res) => setBookings(res.data))
      .catch((err) => {
        console.error(err);
        showSnackbar("Error fetching bookings", "error");
      })
      .finally(() => setLoading(false));
  };

  const fetchPatients = () => {
    AxiosInstance.get("patients/").then((res) => setPatients(res.data));
  };
  const fetchTests = () => {
    AxiosInstance.get("test/").then((res) => setTests(res.data));
  };
  const fetchTimeslots = () => {
    AxiosInstance.get("timeslot/").then((res) => setTimeslots(res.data));
  };

  useEffect(() => {
    fetchBookings();
    fetchPatients();
    fetchTests();
    fetchTimeslots();
  }, []);

  // ------------------ Form Handlers ------------------
  const handleOpen = (booking = null) => {
    if (booking) {
      setEditingBooking(booking);
      setFormData({
        patient: booking.patient,
        test: booking.test,
        timeslot: booking.timeslot,
      });
    } else {
      setEditingBooking(null);
      setFormData({ patient: "", test: "", timeslot: "" });
    }
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setEditingBooking(null);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.patient || !formData.test || !formData.timeslot) {
      showSnackbar("Please fill all fields", "error");
      return;
    }
    setSaving(true);
    const payload = {
      patient: formData.patient,
      test: formData.test,
      timeslot: formData.timeslot,
    };
    const request = editingBooking
      ? AxiosInstance.put(`booking/${editingBooking.id}/`, payload)
      : AxiosInstance.post("booking/", payload);

    request
      .then(() => {
        fetchBookings();
        handleClose();
        showSnackbar(editingBooking ? "Booking updated!" : "Booking created!");
      })
      .catch((err) => {
        console.error(err);
        showSnackbar("Error saving booking", "error");
      })
      .finally(() => setSaving(false));
  };

  // ------------------ Columns ------------------
  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "ID", size: 80 },
      { accessorKey: "patient_name", header: "Patient", size: 150 },
      { accessorKey: "test_name", header: "Test", size: 150 },
      { accessorKey: "slot_date", header: "Date", size: 120 },
      { accessorKey: "slot_time", header: "Time", size: 120 },
      { accessorKey: "booking_date", header: "Booking Date", size: 150 },
    ],
    []
  );

  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Booking
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <MaterialReactTable
          columns={columns}
          data={bookings}
          enableRowActions
          renderRowActions={({ row }) => (
            <Box sx={{ display: "flex", gap: "8px" }}>
              <IconButton
                color="secondary"
                onClick={() => handleOpen(row.original)}
              >
                <EditIcon />
              </IconButton>
            </Box>
          )}
        />
      )}

      {/* ------------------ Dialog Form ------------------ */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingBooking ? "Edit Booking" : "Add Booking"}
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            select
            label="Patient"
            name="patient"
            fullWidth
            margin="dense"
            value={formData.patient}
            onChange={handleChange}
          >
            <MenuItem value="">-- Select Patient --</MenuItem>
            {patients.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.first_name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Test"
            name="test"
            fullWidth
            margin="dense"
            value={formData.test}
            onChange={handleChange}
          >
            <MenuItem value="">-- Select Test --</MenuItem>
            {tests.map((t) => (
              <MenuItem key={t.id} value={t.id}>
                {t.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Timeslot"
            name="timeslot"
            fullWidth
            margin="dense"
            value={formData.timeslot}
            onChange={handleChange}
          >
            <MenuItem value="">-- Select Timeslot --</MenuItem>
            {timeslots.map((ts) => (
              <MenuItem key={ts.id} value={ts.id}>
                {ts.test_name} — {ts.date} {ts.start_time}–{ts.end_time}{" "}
                {ts.unlimited_patients
                  ? "(Unlimited)"
                  : `(${ts.available_slots} left)`}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={saving}>
            {saving ? (
              <CircularProgress size={20} />
            ) : editingBooking ? (
              "Update"
            ) : (
              "Create"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ------------------ Snackbar ------------------ */}
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
    </div>
  );
};

export default BookingsView;
