import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Box,
  Typography,
  Button,
  Collapse,
  Switch,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputLabel,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#006EBE", // Primary color
    },
    secondary: {
      main: "#EB2026", // Secondary color
    },
  },
});

const PrescriptionStatusPage = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [openComments, setOpenComments] = useState({});
  const [openFullDetails, setOpenFullDetails] = useState(null);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    pharmacy_id: localStorage.getItem("PharmacyId") || "",
    seller_id: localStorage.getItem("PharmacyId") || "",
    productName: "",
    category: "",
    quantity: 0,
    moreInfo: "",
    images: "",
    price: 0,
    discount: 0,
    keywords: [],
    uses: [],
    howItWorks: "",
    sideEffects: [],
    storage: "",
    alternateBrands: [],
  });
  const [pharmacyDetails, setpharmacyDetails] = useState("");
  const [pharmacyComment, setPharmacyComment] = useState("");
  const [pharmacyStatus, setPharmacyStatus] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [error, setError] = useState("");
  const [storeTimings, setStoreTimings] = useState("");
  const [availableDelivery, setAvailableDelivery] = useState(false);

  useEffect(() => {
    const fetchPharmacyDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/pharmacies/${localStorage.getItem(
            "PharmacyId"
          )}`
        );
        const pharmacyDetails = response.data;
        setAvailableDelivery(pharmacyDetails.availableDelivery);
        setStoreTimings(pharmacyDetails.storeTimings);
        console.log(pharmacyDetails);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPharmacyDetails();
  });

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/prescriptions"
        );
        setPrescriptions(response.data);
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
        setError("Failed to fetch prescriptions.");
        toast.error("Failed to fetch prescriptions.");
      }
    };
    fetchPrescriptions();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products.");
      }
    };
    fetchProducts();
  }, []);

  const handleSelectPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setPharmacyComment(prescription.Pharmacy_Comment || "");
    setPharmacyStatus(prescription.Pharmacy_Status || "");
    setShowModal(true);
    setIsAddingProduct(false);
  };

  const handleAddNewProduct = () => {
    setShowModal(true);
    setIsAddingProduct(true);
  };

  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]:
        name === "keywords" ||
        name === "uses" ||
        name === "sideEffects" ||
        name === "alternateBrands"
          ? value.split(",").map((item) => item.trim())
          : value,
    }));
  };

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/products", newProduct, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success("Product added successfully!");
      setShowModal(false);
      setNewProduct({
        pharmacy_id: localStorage.getItem("PharmacyId") || "",
        seller_id: localStorage.getItem("PharmacyId") || "",
        productName: "",
        category: "",
        quantity: 0,
        moreInfo: "",
        images: "",
        price: 0,
        discount: 0,
        keywords: [],
        uses: [],
        howItWorks: "",
        sideEffects: [],
        storage: "",
        alternateBrands: [],
      });
    } catch (error) {
      console.error("Error adding product:", error);
      setError("Failed to add product.");
      toast.error("Failed to add product.");
    }
  };

  const handleUpdatePharmacyDetails = async (e) => {
    e.preventDefault();
    const updateData = {
      pharmacyComment,
      pharmacyStatus,
    };
    try {
      await axios.patch(
        `http://localhost:5000/api/prescriptions/${selectedPrescription._id}/pharmacy`,
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Pharmacy details updated successfully!");
      const response = await axios.get(
        "http://localhost:5000/api/prescriptions"
      );
      setPrescriptions(response.data);
      setSelectedPrescription(null);
      setPharmacyComment("");
      setPharmacyStatus("");
      setShowModal(false);
    } catch (error) {
      console.error("Error updating pharmacy details:", error);
      setError("Failed to update pharmacy details.");
      toast.error("Failed to update pharmacy details.");
    }
  };

  const handleOpenFullDetails = (prescriptionId) => {
    setOpenFullDetails(prescriptionId);
  };

  const handleCloseFullDetails = () => {
    setOpenFullDetails(null);
  };

  const handleToggle = async (event) => {
    const newAvailability = event.target.checked;

    try {
      const resp = await axios.patch(
        `http://localhost:5000/api/pharmacies/${localStorage.getItem(
          "PharmacyId"
        )}/delivery-available`,
        {
          availableDelivery: newAvailability,
        }
      );
      setAvailableDelivery(newAvailability);
      toast.success('Delivery availability updated successfully');
      console.log("Delivery availability updated successfully");
    } catch (error) {
      console.log("Error updating delivery availability");
    }
  };

  const findProductName = (productID) => {
    const product = products.find((p) => p._id === productID);
    return product ? product.productName : "";
  };

  const findProductImg = (productID) => {
    const product = products.find((p) => p._id === productID);
    return product ? product.images[0] : "";
  };

  const handleTimingsChange = (event) => {
    setStoreTimings(event.target.value);
  };

  const handleSaveTimings = async () => {
    try {
      await axios.patch(
        `http://localhost:5000/api/pharmacies/${localStorage.getItem(
          "PharmacyId"
        )}/store-timings`,
        {
          storeTimings,
        }
      );
      toast.success('Store timings saved successfully');
      console.log("Store timings saved successfully");
    } catch (error) {
      console.log("Error saving store timings");
    }
  };

  const pharmacyStatusOptions = [
    "Pending",
    "Waiting for Doctor Review",
    "Order Accepted",
    "Out for Delivery",
    "Delivered",
  ]; // Example status options

  return (
    <ThemeProvider theme={theme}>
       <ToastContainer />
      <Box sx={{ padding: 4, backgroundColor: "#FFFFFF" }}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-evenly"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-evenly",gap:"10px"}}>
            <TextField
              label="Store Timings"
              variant="outlined"
              value={storeTimings}
              onChange={handleTimingsChange}
              fullWidth
              style={{ marginTop: 20 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveTimings}
              style={{ marginTop: 20,height:"50px" }}
            >
              Save Timings
            </Button>
          </div>
          <Paper sx={{height:"50px",display:"flex",alignItems:"center",justifyContent:"space-evenly",margin:"10px",padding:"10px"}}>
          {availableDelivery ? "Delivery Available" : "Delivery Not Available"}
          <Switch
            checked={availableDelivery}
            onChange={handleToggle}
            color="primary"
          />
          </Paper>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h4"
            sx={{ color: "#006EBE", marginBottom: 3, fontWeight: 700 }}
          >
            Pharmacy Order Management
          </Typography>
          <Button
            onClick={handleAddNewProduct}
            variant="contained"
            color="secondary"
            style={{ height: "40px" }}
          >
            Add New Product
          </Button>
        </div>
        {error && <Typography color="error">{error}</Typography>}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ color: "#006EBE" }}>
            Prescription List
          </Typography>
          {prescriptions.map((prescription) => (
            <Paper
              key={prescription._id}
              sx={{
                marginBottom: 3,
                padding: 3,
                backgroundColor: "#F9F9F9",
                boxShadow: 3,
                borderRadius: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: "#006EBE", fontWeight: 600 }}
              >
                Prescription ID: {prescription._id}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSelectPrescription(prescription)}
              >
                Update Status
              </Button>

              {/* Doctor Status Box */}
              <Paper
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 2,
                  padding: 2,
                  backgroundColor: "#E3F2FD",
                  borderRadius: 2,
                  boxShadow: 2,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 600, color: "#006EBE" }}
                >
                  Doctor Status: {prescription.Doctors_Status[0]}
                </Typography>
                <Button
                  onClick={() => handleOpenFullDetails(prescription._id)}
                  sx={{
                    backgroundColor: "#EB2026",
                    color: "#FFFFFF",
                    "&:hover": {
                      backgroundColor: "#C21A1E",
                    },
                  }}
                >
                  {openFullDetails === prescription._id
                    ? "Hide Full Prescription"
                    : "View Full Prescription"}
                </Button>
              </Paper>

              {/* Full Prescription Details Modal */}
              <Dialog
                open={openFullDetails === prescription._id}
                onClose={handleCloseFullDetails}
                fullWidth
                maxWidth="md"
              >
                <DialogTitle
                  sx={{
                    backgroundColor: "#006EBE",
                    color: "#FFFFFF",
                    fontWeight: 600,
                  }}
                >
                  Full Prescription Details
                  <IconButton
                    edge="end"
                    color="inherit"
                    onClick={handleCloseFullDetails}
                    sx={{ position: "absolute", right: 8, top: 8 }}
                  >
                    <CloseIcon />
                  </IconButton>
                </DialogTitle>
                <DialogContent>
                  <Paper
                    sx={{
                      padding: 3,
                      backgroundColor: "#F0F8FF",
                      borderRadius: 2,
                      boxShadow: 2,
                    }}
                  >
                    <Typography variant="body1">
                      <strong>Order ID:</strong> {prescription.Order_id}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Patient Name:</strong> {prescription.Patient_Name}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Patient Phone Number:</strong>{" "}
                      {prescription.Patient_Phone_Number}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Patient Email:</strong>{" "}
                      {prescription.Patient_Email}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Patient Address:</strong>{" "}
                      {prescription.Patient_Address}
                    </Typography>
                    <Typography variant="body1">
                    <Typography variant="body1">
                      <strong>Doctor Status:</strong>{" "}
                      {prescription.Doctors_Status[0]}
                    </Typography>
                      <strong>Doctor Comment:</strong>{" "}
                      {prescription.Doctor_Comment}
                    </Typography>
                 
                  
                    <Typography variant="body1">
                      <strong>Pharmacy Status:</strong>{" "}
                      {prescription.Pharmacy_Status}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Pharmacy Comment:</strong>{" "}
                      {prescription.Pharmacy_Comment}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Total Cost:</strong> ${prescription.totalCost}
                    </Typography>

                    {/* Products in Prescription */}
                    <Box sx={{ marginTop: 2 }}>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Products:
                      </Typography>
                      {prescription.products.map((product) => (
                        <Box
                          key={product.productID}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            marginY: 1,
                          }}
                        >
                          <img
                            src={findProductImg(product.productID)}
                            alt={findProductName(product.productID)}
                            style={{
                              width: 50,
                              height: 50,
                              objectFit: "cover",
                              borderRadius: 5,
                              marginRight: 10,
                            }}
                          />
                          <Typography variant="body1">
                            {findProductName(product.productID)} - Quantity:{" "}
                            {product.quantity}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseFullDetails} color="secondary">
                    Close
                  </Button>
                </DialogActions>
              </Dialog>
            </Paper>
          ))}
        </Box>
        <ToastContainer />
        {showModal && (
          <Dialog
            open={showModal}
            onClose={() => setShowModal(false)}
            fullWidth
            maxWidth="md"
          >
            <DialogTitle
              sx={{
                backgroundColor: "#006EBE",
                color: "#FFFFFF",
                fontWeight: 600,
              }}
            >
              {isAddingProduct ? "Add New Product" : "Update Pharmacy Details"}
              <IconButton
                edge="end"
                color="inherit"
                onClick={() => setShowModal(false)}
                sx={{ position: "absolute", right: 8, top: 8 }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              {isAddingProduct ? (
                <form onSubmit={handleAddProductSubmit}>
                  <Box sx={{ mb: 2 }}>
                    <InputLabel>Product Name</InputLabel>
                    <TextField
                      name="productName"
                      value={newProduct.productName}
                      onChange={handleNewProductChange}
                      required
                      fullWidth
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <InputLabel>Category</InputLabel>
                    <TextField
                      name="category"
                      value={newProduct.category}
                      onChange={handleNewProductChange}
                      fullWidth
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <InputLabel>Quantity</InputLabel>
                    <TextField
                      type="number"
                      name="quantity"
                      value={newProduct.quantity}
                      onChange={handleNewProductChange}
                      required
                      fullWidth
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <InputLabel>More Info</InputLabel>
                    <TextField
                      name="moreInfo"
                      value={newProduct.moreInfo}
                      onChange={handleNewProductChange}
                      multiline
                      rows={4}
                      fullWidth
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <InputLabel>Images URL</InputLabel>
                    <TextField
                      name="images"
                      value={newProduct.images}
                      onChange={handleNewProductChange}
                      fullWidth
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <InputLabel>Price</InputLabel>
                    <TextField
                      type="number"
                      name="price"
                      value={newProduct.price}
                      onChange={handleNewProductChange}
                      required
                      fullWidth
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <InputLabel>Discount</InputLabel>
                    <TextField
                      type="number"
                      name="discount"
                      value={newProduct.discount}
                      onChange={handleNewProductChange}
                      fullWidth
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <InputLabel>Keywords</InputLabel>
                    <TextField
                      name="keywords"
                      value={newProduct.keywords.join(",")}
                      onChange={handleNewProductChange}
                      fullWidth
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <InputLabel>Uses</InputLabel>
                    <TextField
                      name="uses"
                      value={newProduct.uses.join(",")}
                      onChange={handleNewProductChange}
                      fullWidth
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <InputLabel>How It Works</InputLabel>
                    <TextField
                      name="howItWorks"
                      value={newProduct.howItWorks}
                      onChange={handleNewProductChange}
                      multiline
                      rows={4}
                      fullWidth
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <InputLabel>Side Effects</InputLabel>
                    <TextField
                      name="sideEffects"
                      value={newProduct.sideEffects.join(",")}
                      onChange={handleNewProductChange}
                      fullWidth
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <InputLabel>Storage</InputLabel>
                    <TextField
                      name="storage"
                      value={newProduct.storage}
                      onChange={handleNewProductChange}
                      fullWidth
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <InputLabel>Alternate Brands</InputLabel>
                    <TextField
                      name="alternateBrands"
                      value={newProduct.alternateBrands.join(",")}
                      onChange={handleNewProductChange}
                      fullWidth
                    />
                  </Box>
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    sx={{ marginTop: 2 }}
                  >
                    Add Product
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleUpdatePharmacyDetails}>
                  <Box sx={{ mb: 2 }}>
                    <InputLabel>Pharmacy Comment</InputLabel>
                    <TextField
                      name="pharmacyComment"
                      value={pharmacyComment}
                      onChange={(e) => setPharmacyComment(e.target.value)}
                      multiline
                      rows={4}
                      fullWidth
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <InputLabel>Pharmacy Status</InputLabel>
                    <Select
                      value={pharmacyStatus}
                      onChange={(e) => setPharmacyStatus(e.target.value)}
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: theme.palette.primary.main,
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: theme.palette.primary.main,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: theme.palette.primary.main,
                        },
                      }}
                    >
                      {pharmacyStatusOptions.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    sx={{ marginTop: 2 }}
                  >
                    Update Status
                  </Button>
                </form>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowModal(false)} color="secondary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default PrescriptionStatusPage;
