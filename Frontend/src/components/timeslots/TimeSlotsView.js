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
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useParams } from "react-router-dom";

const TimeSlotsView = () => {
  const { id: testId } = useParams(); // test ID from URL
  const [test, setTest] = useState(null); // ✅ test details
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    start_time: "",
    end_time: "",
    max_patients: 1,
  });

  // Fetch test details
  const fetchTest = () => {
    AxiosInstance.get(`test/${testId}/`)
      .then((res) => setTest(res.data))
      .catch((err) =>
        console.error("Error fetching test:", err.response?.data || err)
      );
  };

  // Fetch slots for this test
  const fetchSlots = () => {
    AxiosInstance.get(`timeslot/?test_id=${testId}`)
      .then((res) => {
        setSlots(res.data);
        setLoading(false);
      })
      .catch((err) =>
        console.error("Error fetching slots:", err.response?.data || err)
      );
  };

  useEffect(() => {
    fetchTest();
    fetchSlots();
  }, []);

  // Modal open/close
  const openModal = (slot = null) => {
    setEditingSlot(slot);
    if (slot) {
      setFormData({
        date: slot.date,
        start_time: slot.start_time,
        end_time: slot.end_time,
        max_patients: slot.max_patients,
      });
    } else {
      setFormData({
        date: "",
        start_time: "",
        end_time: "",
        max_patients: 1,
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingSlot(null);
  };

  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Overlap check
  const checkOverlap = (newSlot) => {
    return slots.some((slot) => {
      if (editingSlot && slot.slotid === editingSlot.slotid) return false;
      return (
        slot.date === newSlot.date &&
        !(
          newSlot.end_time <= slot.start_time ||
          newSlot.start_time >= slot.end_time
        )
      );
    });
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      max_patients: parseInt(formData.max_patients, 10),
      test: parseInt(testId, 10),
    };

    if (checkOverlap(payload)) {
      alert(
        "⚠️ This time slot overlaps with an existing one on the same date!"
      );
      return;
    }

    if (editingSlot) {
      AxiosInstance.put(`timeslot/${editingSlot.slotid}/`, payload)
        .then(() => {
          fetchSlots();
          closeModal();
        })
        .catch((err) =>
          console.error("Error updating slot:", err.response?.data || err)
        );
    } else {
      AxiosInstance.post("timeslot/", payload)
        .then(() => {
          fetchSlots();
          closeModal();
        })
        .catch((err) =>
          console.error("Error creating slot:", err.response?.data || err)
        );
    }
  };

  // Delete slot
  const handleDelete = (slotId) => {
    if (window.confirm("Are you sure you want to delete this slot?")) {
      AxiosInstance.delete(`timeslot/${slotId}/`)
        .then(() => fetchSlots())
        .catch((err) =>
          console.error("Error deleting slot:", err.response?.data || err)
        );
    }
  };

  // Table columns
  const columns = useMemo(
    () => [
      { accessorKey: "slotid", header: "Slot ID", size: 80 },
      { accessorKey: "date", header: "Date", size: 150 },
      { accessorKey: "start_time", header: "Start Time", size: 100 },
      { accessorKey: "end_time", header: "End Time", size: 100 },
      { accessorKey: "max_patients", header: "Capacity", size: 120 },
      {
        accessorKey: "booked_patients",
        header: "Booked",
        size: 100,
        Cell: ({ row }) => row.original.booked_patients || 0,
      },
      {
        header: "Available",
        size: 120,
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

  return (
    <div>
      {/* ✅ Show test name */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5">
          <b>{test ? `${test.name}` : ""}</b> Time Slots:
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => openModal()}
        >
          Add Slot
        </Button>
      </Box>

      {loading ? (
        <p>Loading slots...</p>
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
                onClick={() => handleDelete(row.original.slotid)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        />
      )}

      {/* Modal for Add/Edit */}
      <Modal open={modalOpen} onClose={closeModal}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6">
            {editingSlot ? "Edit Slot" : "Add Slot"}
          </Typography>
          <TextField
            label="Date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="Start Time"
            type="time"
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="End Time"
            type="time"
            name="end_time"
            value={formData.end_time}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="Max Patients"
            type="number"
            name="max_patients"
            value={formData.max_patients}
            onChange={handleChange}
            inputProps={{ min: 1 }}
            required
          />
          <Button type="submit" variant="contained">
            {editingSlot ? "Update Slot" : "Add Slot"}
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default TimeSlotsView;
