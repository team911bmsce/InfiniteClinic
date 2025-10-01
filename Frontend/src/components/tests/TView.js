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
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  AccessTime as ClockIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const TView = () => {
  const [tests, setTests] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const [formData, setFormData] = useState({
    testid: "",
    name: "",
    description: "",
    price: "",
    branch: "",
  });

  const navigate = useNavigate();

  // Fetch tests
  const fetchTests = () => {
    setLoading(true);
    AxiosInstance.get("test/")
      .then((res) => setTests(res.data))
      .catch((err) =>
        console.error("Error fetching tests:", err.response?.data || err)
      )
      .finally(() => setLoading(false));
  };

  // Fetch branches
  const fetchBranches = () => {
    AxiosInstance.get("branch/")
      .then((res) => setBranches(res.data))
      .catch((err) =>
        console.error("Error fetching branches:", err.response?.data || err)
      );
  };

  useEffect(() => {
    fetchTests();
    fetchBranches();
  }, []);

  // Modal handlers
  const openModal = (test = null) => {
    setEditingTest(test);
    setErrorMsg(null);
    if (test) {
      setFormData({
        testid: test.testid || "",
        name: test.name || "",
        description: test.description || "",
        price: test.price || "",
        branch: test.branch || "",
      });
    } else {
      setFormData({
        testid: "",
        name: "",
        description: "",
        price: "",
        branch: "",
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTest(null);
    setErrorMsg(null);
  };

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validation
  const validateForm = () => {
    if (!formData.testid) return "Test ID is required.";
    if (isNaN(formData.testid)) return "Test ID must be a number.";
    if (!formData.name.trim()) return "Name is required.";
    if (formData.price && isNaN(formData.price))
      return "Price must be a number.";
    return null;
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg(null);

    const validationError = validateForm();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    const payload = {
      testid: parseInt(formData.testid, 10),
      name: formData.name,
      description: formData.description || null,
      price: formData.price ? parseFloat(formData.price) : null,
      branch: formData.branch ? parseInt(formData.branch, 10) : null,
    };

    setSubmitting(true);

    const request = editingTest
      ? AxiosInstance.put(`test/${editingTest.id}/`, payload)
      : AxiosInstance.post("test/", payload);

    request
      .then(() => {
        fetchTests();
        closeModal();
      })
      .catch((err) => {
        console.error("Error saving test:", err.response?.data || err);
        setErrorMsg(err.response?.data?.detail || "Failed to save test.");
      })
      .finally(() => setSubmitting(false));
  };

  // Delete test
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this test?")) {
      AxiosInstance.delete(`test/${id}/`)
        .then(() => fetchTests())
        .catch((err) => {
          console.error("Error deleting test:", err.response?.data || err);
          alert("Failed to delete test.");
        });
    }
  };

  // Table columns
  const columns = useMemo(
    () => [
      { accessorKey: "testid", header: "Test ID", size: 100 },
      { accessorKey: "name", header: "Test Name", size: 200 },
      { accessorKey: "description", header: "Description", size: 300 },
      {
        accessorKey: "price",
        header: "Price (₹)",
        size: 120,
        Cell: ({ cell }) =>
          cell.getValue() ? `₹${parseFloat(cell.getValue()).toFixed(2)}` : "-",
      },
      {
        accessorKey: "branch",
        header: "Branch",
        size: 150,
        Cell: ({ cell }) => {
          const branchObj = branches.find((b) => b.id === cell.getValue());
          return branchObj ? branchObj.name : "-";
        },
      },
    ],
    [branches]
  );

  return (
    <div>
      {/* Top Bar */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5">Manage Tests</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => openModal()}
        >
          Add Test
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <MaterialReactTable
          columns={columns}
          data={tests}
          enableRowActions
          renderRowActions={({ row }) => (
            <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
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
              <IconButton
                color="primary"
                onClick={() => navigate(`/tests/${row.original.id}/timeslots`)}
              >
                <ClockIcon />
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
            width: 450,
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
            {editingTest ? "Edit Test" : "Add Test"}
          </Typography>

          {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

          <TextField
            label="Test ID"
            name="testid"
            value={formData.testid}
            onChange={handleChange}
            type="number"
            required
          />
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={2}
          />
          <TextField
            label="Price (₹)"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
          />

          <TextField
            select
            label="Branch"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
          >
            <MenuItem value="">-- Select Branch --</MenuItem>
            {branches.map((branch) => (
              <MenuItem key={branch.id} value={branch.id}>
                {branch.name}
              </MenuItem>
            ))}
          </TextField>

          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            startIcon={submitting && <CircularProgress size={20} />}
          >
            {editingTest ? "Update Test" : "Add Test"}
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default TView;
