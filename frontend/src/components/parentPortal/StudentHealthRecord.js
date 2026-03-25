import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
} from "@mui/material";
import {
  MedicalServices,
  Person,
  Favorite,
  Medication,
  Shield,
  Warning,
  EventNote,
  ArrowBack,
} from "@mui/icons-material";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_DEPLOYED_URL
    : process.env.REACT_APP_API_URL;

// Reusable function to get auth config with token
const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("Please log in to access this feature");
    throw new Error("No token found");
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// Configure Axios with base URL
const api = axios.create({
  baseURL: `${BASE_URL}`,
  validateStatus: (status) => status >= 200 && status < 500,
});

const StudentHealthRecord = () => {
  const [healthRecord, setHealthRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const studentId = localStorage.getItem("selectedChild")

  useEffect(() => {
    const fetchHealthRecord = async () => {
      if (!studentId || studentId === "undefined") {
        setError("No student ID provided");
        setLoading(false);
        return;
      }

      try {
        const config = getAuthConfig();
        // console.log("Fetching health record with token:", localStorage.getItem("token"));
        const response = await api.get(`/api/healthrecord/${studentId}`, config);

        if (response.status === 200) {
          setHealthRecord(response.data);
          // console.log("⭐ Health Record:", response.data);
        } else if (response.status === 404) {
          setHealthRecord(null);
        } else {
          setError("Unexpected response status: " + response.status);
          toast.error("Unexpected response from server");
        }
      } catch (err) {
        // console.error("Error fetching health record:", {
        //   message: err.message,
        //   status: err.response?.status,
        //   data: err.response?.data,
        // });
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          toast.error("Session expired or unauthorized. Please log in again.");
          navigate("/login");
        } else if (err.response?.status === 403) {
          setError("Access denied: You do not have permission to view this health record.");
          toast.error("Access denied");
        } else {
          setError(
            err.response?.data?.message || "Failed to fetch health record"
          );
          toast.error("Failed to load health record");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHealthRecord();
  }, [studentId, navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#e3e6eb",
        }}
      >
        <Box
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderRadius: "15px",
            padding: "2rem",
            boxShadow: "0 4px 16px rgba(31, 38, 135, 0.1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CircularProgress sx={{ color: "#6366f1" }} />
          <Typography sx={{ color: "#4b5563", mt: 2 }}>
            Loading health record...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, backgroundColor: "#e3e6eb", p: 4 }}>
        <Box sx={{ mb: 2, textAlign: "right" }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack sx={{ color: "#6366f1" }} />}
            onClick={handleBack}
            sx={{
              borderColor: "#6366f1",
              color: "#6366f1",
              borderRadius: "12px",
              textTransform: "none",
              "&:hover": {
                background: "linear-gradient(145deg, #6366f1, #a855f7)",
                color: "#fff",
                borderColor: "transparent",
              },
            }}
          >
            Back
          </Button>
        </Box>
        <Alert
          severity="error"
          icon={<Warning sx={{ color: "#b91c1c" }} />}
          sx={{
            backgroundColor: "#fee2e2",
            color: "#b91c1c",
            borderRadius: "10px",
            boxShadow: "0 4px 16px rgba(31, 38, 135, 0.1)",
          }}
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6, px: 2, backgroundColor: "transparent" }}>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            // background: "linear-gradient(90deg, #6366f1, #a855f7)",
            color:"white",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
          }}
        >
          <MedicalServices sx={{ mr: 1, color: "#6366f1" }} />
          Student Health Record
        </Typography>
      </Box>

      {healthRecord ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: "100%",
                backgroundColor: "#f0f7ff",
                border: "1px solid rgba(99, 102, 241, 0.2)",
                boxShadow: "0 4px 16px rgba(31, 38, 135, 0.1)",
                borderRadius: "15px",
                transition: "transform 0.3s ease",
                "&:hover": { transform: "translateY(-4px)" },
              }}
            >
              <CardHeader
                title="Health Summary"
                avatar={<Person sx={{ color: "#6366f1" }} />}
                titleTypographyProps={{ variant: "h6", color: "#2e1065" }}
                sx={{
                  background: "linear-gradient(145deg, #e0e7ff 0%, #f5f3ff 100%)",
                  py: 1,
                  borderRadius: "15px 15px 0 0",
                }}
              />
              <CardContent sx={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ color: "#4b5563" }}>
                      Blood Group
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#2e1065" }}>
                      {healthRecord.bloodGroup || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ color: "#4b5563" }}>
                      Height
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#2e1065" }}>
                      {healthRecord.height?.value
                        ? `${healthRecord.height.value} ${healthRecord.height.unit}`
                        : "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ color: "#4b5563" }}>
                      Weight
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#2e1065" }}>
                      {healthRecord.weight?.value
                        ? `${healthRecord.weight.value} ${healthRecord.weight.unit}`
                        : "N/A"}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card
              sx={{
                height: "100%",
                backgroundColor: "transparent",
                border: "1px solid rgba(99, 102, 241, 0.2)",
                boxShadow: "0 4px 16px rgba(31, 38, 135, 0.1)",
                borderRadius: "15px",
                transition: "transform 0.3s ease",
                "&:hover": { transform: "translateY(-4px)" },
              }}
            >
              <CardHeader
                title="Medical Conditions"
                avatar={<Favorite sx={{ color: "#6366f1" }} />}
                titleTypographyProps={{ variant: "h6", color: "#2e1065" }}
                sx={{
                  background: "linear-gradient(145deg, #e0e7ff 0%, #f5f3ff 100%)",
                  py: 1,
                  borderRadius: "15px 15px 0 0",
                }}
              />
              <CardContent sx={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}>
                {healthRecord.allergies?.length > 0 && (
                  <>
                    <Typography
                      variant="subtitle1"
                      sx={{ color: "#b91c1c", mb: 1 }}
                    >
                      Allergies
                    </Typography>
                    <List dense>
                      {healthRecord.allergies.map((allergy, index) => (
                        <ListItem
                          key={index}
                          sx={{
                            backgroundColor: "#fee2e2",
                            color: "#b91c1c",
                            borderRadius: "8px",
                            mb: 0.5,
                          }}
                        >
                          <ListItemText primary={allergy} />
                        </ListItem>
                      ))}
                    </List>
                    <Divider sx={{ my: 2, backgroundColor: "rgba(99, 102, 241, 0.2)" }} />
                  </>
                )}
                {healthRecord.chronicConditions?.length > 0 && (
                  <TableContainer
                    component={Paper}
                    sx={{ boxShadow: "none", backgroundColor: "transparent" }}
                  >
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ backgroundColor: "#e0e7ff" }}>
                          <TableCell sx={{ color: "#2e1065" }}>Condition</TableCell>
                          <TableCell sx={{ color: "#2e1065" }}>
                            Diagnosed Date
                          </TableCell>
                          <TableCell sx={{ color: "#2e1065" }}>Notes</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {healthRecord.chronicConditions.map((condition, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              backgroundColor: "rgba(255, 255, 255, 0.8)",
                              "&:hover": { backgroundColor: "#e0f2fe" },
                            }}
                          >
                            <TableCell sx={{ color: "#4b5563" }}>
                              {condition.condition}
                            </TableCell>
                            <TableCell sx={{ color: "#4b5563" }}>
                              {condition.diagnosedDate
                                ? new Date(condition.diagnosedDate).toLocaleDateString()
                                : "N/A"}
                            </TableCell>
                            <TableCell sx={{ color: "#4b5563" }}>
                              {condition.notes || "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
                {!healthRecord.allergies?.length &&
                  !healthRecord.chronicConditions?.length && (
                    <Typography
                      variant="body2"
                      sx={{ color: "#4b5563", textAlign: "center" }}
                    >
                      No medical conditions recorded
                    </Typography>
                  )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: "100%",
                backgroundColor: "#f0f7ff",
                border: "1px solid rgba(99, 102, 241, 0.2)",
                boxShadow: "0 4px 16px rgba(31, 38, 135, 0.1)",
                borderRadius: "15px",
                transition: "transform 0.3s ease",
                "&:hover": { transform: "translateY(-4px)" },
              }}
            >
              <CardHeader
                title="Medications"
                avatar={<Medication sx={{ color: "#6366f1" }} />}
                titleTypographyProps={{ variant: "h6", color: "#2e1065" }}
                sx={{
                  background: "linear-gradient(145deg, #e0e7ff 0%, #f5f3ff 100%)",
                  py: 1,
                  borderRadius: "15px 15px 0 0",
                }}
              />
              <CardContent sx={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}>
                {healthRecord.medications?.length > 0 ? (
                  <TableContainer
                    component={Paper}
                    sx={{ boxShadow: "none", backgroundColor: "transparent" }}
                  >
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ backgroundColor: "#e0e7ff" }}>
                          <TableCell sx={{ color: "#2e1065" }}>Medication</TableCell>
                          <TableCell sx={{ color: "#2e1065" }}>Dosage</TableCell>
                          <TableCell sx={{ color: "#2e1065" }}>Frequency</TableCell>
                          <TableCell sx={{ color: "#2e1065" }}>Duration</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {healthRecord.medications.map((med, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              backgroundColor: "rgba(255, 255, 255, 0.8)",
                              "&:hover": { backgroundColor: "#e0f2fe" },
                            }}
                          >
                            <TableCell sx={{ color: "#4b5563" }}>{med.name}</TableCell>
                            <TableCell sx={{ color: "#4b5563" }}>{med.dosage}</TableCell>
                            <TableCell sx={{ color: "#4b5563" }}>
                              {med.frequency}
                            </TableCell>
                            <TableCell sx={{ color: "#4b5563" }}>
                              {med.startDate
                                ? `${new Date(med.startDate).toLocaleDateString()} - ${
                                    med.endDate
                                      ? new Date(med.endDate).toLocaleDateString()
                                      : "Ongoing"
                                  }`
                                : "N/A"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography
                    variant="body2"
                    sx={{ color: "#4b5563", textAlign: "center" }}
                  >
                    No medications recorded
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {(healthRecord.lastCheckup || healthRecord.emergencyNotes) && (
            <Grid item xs={12}>
              <Grid container spacing={3}>
                {healthRecord.lastCheckup && (
                  <Grid item xs={12} md={8}>
                   <Card
  sx={{
    height: "100%",
    backgroundColor: "#f0f7ff",
    border: "1px solid rgba(99, 102, 241, 0.2)",
    boxShadow: "0 4px 16px rgba(31, 38, 135, 0.1)",
    borderRadius: "15px",
    transition: "transform 0.3s ease",
    px: { xs: 1, sm: 2, md: 3 }, // Responsive padding
    py: { xs: 1, sm: 2 },
    "&:hover": {
      transform: "translateY(-4px)",
    },
  }}
>
  <CardHeader
    title="Last Checkup"
    avatar={<EventNote sx={{ color: "#6366f1" }} />}
    titleTypographyProps={{
      variant: "h6",
      sx: {
        fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
        color: "#2e1065",
      },
    }}
    sx={{
      background: "linear-gradient(145deg, #e0e7ff 0%, #f5f3ff 100%)",
      py: { xs: 0.5, sm: 1 },
      px: { xs: 1, sm: 2 },
      borderRadius: "15px 15px 0 0",
    }}
  />
  <CardContent
    sx={{
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      px: { xs: 1, sm: 2 },
      py: { xs: 1.5, sm: 2 },
    }}
  >
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <Typography
          variant="body2"
          sx={{
            fontSize: { xs: "0.75rem", sm: "0.85rem" },
            color: "#4b5563",
          }}
        >
          Date
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: "0.85rem", sm: "1rem" },
            color: "#2e1065",
            fontWeight: 600,
          }}
        >
          {healthRecord.lastCheckup.date
            ? new Date(healthRecord.lastCheckup.date).toLocaleDateString()
            : "N/A"}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Typography
          variant="body2"
          sx={{
            fontSize: { xs: "0.75rem", sm: "0.85rem" },
            color: "#4b5563",
          }}
        >
          Doctor
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: "0.85rem", sm: "1rem" },
            color: "#2e1065",
            fontWeight: 600,
          }}
        >
          {healthRecord.lastCheckup.doctor || "N/A"}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Typography
          variant="body2"
          sx={{
            fontSize: { xs: "0.75rem", sm: "0.85rem" },
            color: "#4b5563",
          }}
        >
          Findings
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: "0.85rem", sm: "1rem" },
            color: "#2e1065",
            fontWeight: 600,
          }}
        >
          {healthRecord.lastCheckup.findings || "N/A"}
        </Typography>
      </Grid>
    </Grid>
  </CardContent>
</Card>

                  </Grid>
                )}

                {healthRecord.emergencyNotes && (
                  <Grid item xs={12} md={4}>
                    <Card
                      sx={{
                        height: "100%",
                        backgroundColor: "#f0f7ff",
                        border: "1px solid rgba(185, 28, 28, 0.3)",
                        boxShadow: "0 4px 16px rgba(31, 38, 135, 0.1)",
                        borderRadius: "15px",
                        transition: "transform 0.3s ease",
                        "&:hover": { transform: "translateY(-4px)" },
                      }}
                    >
                      <CardHeader
                        title="Emergency Notes"
                        avatar={<Warning sx={{ color: "#b91c1c" }} />}
                        titleTypographyProps={{
                          variant: "h6",
                          color: "#b91c1c",
                        }}
                        sx={{
                          backgroundColor: "#fee2e2",
                          py: 1,
                          borderRadius: "15px 15px 0 0",
                        }}
                      />
                      <CardContent sx={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}>
                        <Typography variant="body1" sx={{ color: "#b91c1c" }}>
                          {healthRecord.emergencyNotes}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </Grid>
          )}
        </Grid>
      ) : (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Alert
            severity="info"
            sx={{
              justifyContent: "center",
              backgroundColor: "#e0f2fe",
              color: "#1e40af",
              borderRadius: "10px",
              boxShadow: "0 4px 16px rgba(31, 38, 135, 0.1)",
            }}
          >
            No health records found for this student.
          </Alert>
        </Box>
      )}
    </Container>
  );
};

export default StudentHealthRecord;