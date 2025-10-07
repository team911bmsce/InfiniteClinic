import { React, useEffect, useState } from "react";
import AxiosInstance from "../Axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  CircularProgress,
  Grid,
  Chip,
  Button,
} from "@mui/material";

const UTestView = () => {
  const [tests, setTests] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: "", package: "" });

  // Fetch packages
  const fetchPackages = () => {
    AxiosInstance.get("packages/")
      .then((res) => setPackages(res.data))
      .catch((err) => console.error(err));
  };

  // Fetch tests with filters
  const fetchTests = () => {
    setLoading(true);
    let query = "?";
    if (filters.name) query += `name=${filters.name}&`;
    if (filters.package) query += `package=${filters.package}&`;

    AxiosInstance.get(`test/${query}`)
      .then((res) => setTests(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPackages();
    fetchTests();
  }, []);

  useEffect(() => {
    fetchTests();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleBook = (test) => {
    alert(`Booking test: ${test.name}`);
    // Replace alert with actual booking navigation or API call
  };

  return (
    <Box
      sx={{ p: { xs: 2, md: 4 }, background: "#f5f5f5", minHeight: "100vh" }}
    >
      {/* Filters */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          mb: 4,
          justifyContent: { xs: "center", md: "flex-start" },
        }}
      >
        <TextField
          label="Search by Name"
          name="name"
          value={filters.name}
          onChange={handleFilterChange}
          size="small"
          variant="outlined"
          sx={{ minWidth: 200 }}
        />
        <TextField
          select
          label="Filter by Package"
          name="package"
          value={filters.package}
          onChange={handleFilterChange}
          size="small"
          variant="outlined"
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">-- All Packages --</MenuItem>
          {packages.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Loading / Empty */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
          <CircularProgress />
        </Box>
      ) : tests.length === 0 ? (
        <Typography align="center" variant="h6" sx={{ mt: 4 }}>
          No tests found.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {tests.map((test) => (
            <Grid item xs={12} sm={6} md={4} key={test.id}>
              <Card
                sx={{
                  height: "100%",
                  width: "100%",
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 6,
                  },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                {/* Header */}
                <Box
                  sx={{
                    background:
                      "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
                    p: 2,
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ color: "white", fontWeight: 600 }}
                  >
                    {test.name}
                  </Typography>
                </Box>

                {/* Content */}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Test ID: {test.testid}
                  </Typography>

                  <Box sx={{ mt: 1, mb: 1 }}>
                    <Chip
                      label={test.package ? test.package.name : "No Package"}
                      color="primary"
                      size="small"
                    />
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ minHeight: 50 }}
                  >
                    {test.description || "No description available."}
                  </Typography>

                  <Typography
                    variant="subtitle1"
                    sx={{ mt: 2, fontWeight: 500 }}
                  >
                    Price: ₹{parseFloat(test.price).toFixed(2)}
                  </Typography>
                </CardContent>

                {/* Book Button */}
                <Box sx={{ p: 2, textAlign: "center" }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={() => handleBook(test)}
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      "&:hover": { backgroundColor: "#ff4081" },
                    }}
                  >
                    Book Now
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default UTestView;
