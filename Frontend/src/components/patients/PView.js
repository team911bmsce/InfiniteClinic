import { React, useEffect, useMemo, useState } from "react";
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

const PView = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal state
  const [open, setOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);

  const [formData, setFormData] = useState({
    pid: "",
    first_name: "",
    last_name: "",
    age: "",
    gender: "M",
    phone_number: "",
    email: "",
    address: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Snackbar feedback
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Fetch patients
  const GetPatients = () => {
    setLoading(true);
    AxiosInstance.get(`patients/`)
      .then((res) => {
        setPatients(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching patients:", err.response?.data);
        showSnackbar("Error fetching patients", "error");
        setLoading(false);
      });
  };

  useEffect(() => {
    GetPatients();
  }, []);

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Form validation
  const validateForm = () => {
    let errors = {};

    if (!formData.pid) errors.pid = "Patient ID is required";
    if (!formData.first_name) errors.first_name = "First name is required";
    if (!formData.age || formData.age <= 0)
      errors.age = "Valid age is required";
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Invalid email format";
    if (formData.phone_number && !/^\d{10}$/.test(formData.phone_number))
      errors.phone_number = "Phone number must be 10 digits";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Open modal (for create or edit)
  const handleOpen = (patient = null) => {
    if (patient) {
      setEditingPatient(patient);
      setFormData({ ...patient });
    } else {
      setEditingPatient(null);
      setFormData({
        pid: "",
        first_name: "",
        last_name: "",
        age: "",
        gender: "M",
        phone_number: "",
        email: "",
        address: "",
      });
    }
    setFormErrors({});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingPatient(null);
  };

  // Submit (Create or Update)
  const handleSubmit = () => {
    if (!validateForm()) return;

    setSaving(true);
    if (editingPatient) {
      AxiosInstance.put(`patients/${editingPatient.id}/`, formData)
        .then(() => {
          GetPatients();
          handleClose();
          showSnackbar("Patient updated successfully!");
        })
        .catch((err) => {
          console.error("Error updating patient:", err.response?.data);
          showSnackbar("Error updating patient", "error");
        })
        .finally(() => setSaving(false));
    } else {
      AxiosInstance.post("patients/", formData)
        .then(() => {
          GetPatients();
          handleClose();
          showSnackbar("Patient created successfully!");
        })
        .catch((err) => {
          console.error("Error creating patient:", err.response?.data);
          showSnackbar("Error creating patient", "error");
        })
        .finally(() => setSaving(false));
    }
  };

  // Table columns
  const columns = useMemo(
    () => [
      { accessorKey: "pid", header: "PID", size: 80 },
      { accessorKey: "first_name", header: "First Name", size: 150 },
      { accessorKey: "last_name", header: "Last Name", size: 150 },
      { accessorKey: "age", header: "Age", size: 80 },
      {
        accessorKey: "gender",
        header: "Gender",
        size: 100,
        Cell: ({ cell }) => {
          const val = cell.getValue();
          if (val === "M") return "Male";
          if (val === "F") return "Female";
          return "Other";
        },
      },
      { accessorKey: "phone_number", header: "Phone", size: 150 },
      { accessorKey: "email", header: "Email", size: 200 },
    ],
    []
  );

  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Patient
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <MaterialReactTable
          enableRowActions
          renderRowActions={({ row }) => (
            <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
              <IconButton
                color="secondary"
                onClick={() => handleOpen(row.original)}
              >
                <EditIcon />
              </IconButton>
            </Box>
          )}
          columns={columns}
          data={patients}
        />
      )}

      {/* Modal for Create / Edit */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingPatient ? "Edit Patient" : "Add Patient"}
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            margin="dense"
            label="Patient ID"
            name="pid"
            value={formData.pid}
            onChange={handleChange}
            fullWidth
            required
            error={!!formErrors.pid}
            helperText={formErrors.pid}
          />
          <TextField
            margin="dense"
            label="First Name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            fullWidth
            required
            error={!!formErrors.first_name}
            helperText={formErrors.first_name}
          />
          <TextField
            margin="dense"
            label="Last Name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Age"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            fullWidth
            required
            error={!!formErrors.age}
            helperText={formErrors.age}
          />
          <TextField
            select
            margin="dense"
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            fullWidth
            required
          >
            <MenuItem value="M">Male</MenuItem>
            <MenuItem value="F">Female</MenuItem>
            <MenuItem value="O">Other</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            label="Phone Number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            fullWidth
            error={!!formErrors.phone_number}
            helperText={formErrors.phone_number}
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            error={!!formErrors.email}
            helperText={formErrors.email}
          />
          <TextField
            margin="dense"
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={saving}>
            {saving ? (
              <CircularProgress size={20} />
            ) : editingPatient ? (
              "Update"
            ) : (
              "Create"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for alerts */}
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

export default PView;
