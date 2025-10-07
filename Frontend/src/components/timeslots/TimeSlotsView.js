import { React, useEffect, useMemo, useState } from "react";
import AxiosInstance from "../Axios";
import { MaterialReactTable } from "material-react-table";
import {
  Box,
  IconButton,
  Button,
  Modal,
  Typography,
  TextField,
  Chip,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useParams } from "react-router-dom";

const TimeSlotsView = () => {
  const { id: testId } = useParams();
  const [test, setTest] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    date: "",
    start_time: "",
    end_time: "",
    max_patients: 1,
  });
  const [formErrors, setFormErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };
  const handleSnackbarClose = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  // ---------------- Fetch Data ----------------
  const fetchTest = async () => {
    try {
      const res = await AxiosInstance.get(`test/${testId}/`);
      setTest(res.data);
    } catch (err) {
      console.error("Error fetching test:", err);
      showSnackbar("Error fetching test details", "error");
    }
  };

  const fetchSlots = async () => {
    try {
      const res = await AxiosInstance.get(`timeslot/?test_id=${testId}`);
      setSlots(res.data);
    } catch (err) {
      console.error("Error fetching slots:", err);
      showSnackbar("Error fetching slots", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTest();
    fetchSlots();
  }, []);

  // ---------------- Modal Handling ----------------
  const openModal = (slot = null) => {
    setEditingSlot(slot);
    if (slot) {
      setFormData({
        id: slot.id,
        date: slot.date,
        start_time: slot.start_time,
        end_time: slot.end_time,
        max_patients: slot.max_patients,
      });
    } else {
      setFormData({
        id: null,
        date: "",
        start_time: "",
        end_time: "",
        max_patients: 1,
      });
    }
    setFormErrors({});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingSlot(null);
  };

  // ---------------- Form Validation ----------------
  const validateForm = () => {
    const errors = {};
    const { date, start_time, end_time, max_patients } = formData;

    if (!date) errors.date = "Date is required";
    if (!start_time) errors.start_time = "Start time is required";
    if (!end_time) errors.end_time = "End time is required";
    if (start_time && end_time && start_time >= end_time)
      errors.end_time = "End time must be after start time";
    if (!max_patients || isNaN(max_patients) || max_patients <= 0)
      errors.max_patients = "Enter a valid number of patients";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const checkOverlap = (newSlot) => {
    return slots.some((slot) => {
      if (editingSlot && slot.id === editingSlot.id) return false;
      return (
        slot.date === newSlot.date &&
        !(
          newSlot.end_time <= slot.start_time ||
          newSlot.start_time >= slot.end_time
        )
      );
    });
  };

  // ---------------- Submit ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      ...formData,
      max_patients: parseInt(formData.max_patients, 10),
      test: parseInt(testId, 10),
    };

    if (checkOverlap(payload)) {
      showSnackbar("This time slot overlaps with an existing one!", "warning");
      return;
    }

    setSaving(true);

    try {
      if (editingSlot && editingSlot.id) {
        await AxiosInstance.put(`timeslot/${editingSlot.id}/`, payload);
        showSnackbar("Slot updated successfully!");
      } else {
        await AxiosInstance.post("timeslot/", payload);
        showSnackbar("Slot created successfully!");
      }
      fetchSlots();
      closeModal();
    } catch (err) {
      console.error("Error saving slot:", err);
      showSnackbar("Error saving slot", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slotId) => {
    if (!window.confirm("Are you sure you want to delete this slot?")) return;
    try {
      await AxiosInstance.delete(`timeslot/${slotId}/`);
      fetchSlots();
      showSnackbar("Slot deleted successfully!");
    } catch (err) {
      console.error("Error deleting slot:", err);
      showSnackbar("Error deleting slot", "error");
    }
  };

  // ---------------- Table Columns ----------------
  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "ID", size: 80 },
      { accessorKey: "date", header: "Date", size: 150 },
      { accessorKey: "start_time", header: "Start Time", size: 120 },
      { accessorKey: "end_time", header: "End Time", size: 120 },
      { accessorKey: "max_patients", header: "Capacity", size: 120 },
      {
        header: "Available",
        size: 150,
        Cell: ({ row }) => {
          const available =
            (row.original.max_patients || 0) -
            (row.original.booked_patients || 0);
          return (
            <Chip
              label={available > 0 ? `${available} left` : "Full"}
              color={available > 0 ? "success" : "error"}
              size="small"
            />
          );
        },
      },
    ],
    []
  );

  // ---------------- JSX ----------------
  return (
    <Box sx={{ p: 3, bgcolor: "#f9fafc", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {test ? `${test.name}` : "Test"} — Time Slots
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => openModal()}
        >
          Add Slot
        </Button>
      </Box>

      {/* Table */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <MaterialReactTable
          columns={columns}
          data={slots}
          enableRowActions
          renderRowActions={({ row }) => (
            <Box sx={{ display: "flex", gap: "8px" }}>
              <IconButton
                color="secondary"
                onClick={() => openModal(row.original)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                color="error"
                onClick={() => handleDelete(row.original.id)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        />
      )}

      {/* Modal */}
      <Modal open={modalOpen} onClose={closeModal}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 420,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {editingSlot ? "Edit Slot" : "Add Slot"}
          </Typography>

          <TextField
            label="Date"
            type="date"
            name="date"
            value={formData.date}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, date: e.target.value }))
            }
            InputLabelProps={{ shrink: true }}
            error={!!formErrors.date}
            helperText={formErrors.date}
            required
          />

          <TextField
            label="Start Time"
            type="time"
            name="start_time"
            value={formData.start_time}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, start_time: e.target.value }))
            }
            InputLabelProps={{ shrink: true }}
            error={!!formErrors.start_time}
            helperText={formErrors.start_time}
            required
          />

          <TextField
            label="End Time"
            type="time"
            name="end_time"
            value={formData.end_time}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, end_time: e.target.value }))
            }
            InputLabelProps={{ shrink: true }}
            error={!!formErrors.end_time}
            helperText={formErrors.end_time}
            required
          />

          <TextField
            label="Max Patients"
            type="number"
            name="max_patients"
            value={formData.max_patients}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                max_patients: e.target.value,
              }))
            }
            inputProps={{ min: 1 }}
            error={!!formErrors.max_patients}
            helperText={formErrors.max_patients}
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={saving}
            sx={{ borderRadius: 2, fontWeight: 600 }}
          >
            {saving ? (
              <CircularProgress size={20} sx={{ color: "white" }} />
            ) : editingSlot ? (
              "Update Slot"
            ) : (
              "Add Slot"
            )}
          </Button>
        </Box>
      </Modal>

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

export default TimeSlotsView;
