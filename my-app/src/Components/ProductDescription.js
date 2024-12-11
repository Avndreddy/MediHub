import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Typography, Button, CardMedia, Grid, Divider, Box, Paper } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReviewForm from './sellerreview';

const ProductDescription = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [sellerId, setSellerId] = useState('');
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [pharmacyDetails, setPharmacyDetails] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
        setSellerId(response.data.seller_id);
        const customerIdFromStorage = localStorage.getItem('customerId');
        setCustomerId(customerIdFromStorage || '');
        if (customerIdFromStorage) {
          const cnameResponse = await axios.get(`http://localhost:5000/api/users/${customerIdFromStorage}`);
          setCustomerName(cnameResponse.data.userName);
        }
      } catch (error) {
        console.error('Error fetching product or customer:', error);
      }
    };

    const fetchReviews = async () => {
      try {
        const reviewsResponse = await axios.get('http://localhost:5000/api/reviews');
        if (reviewsResponse && reviewsResponse.data) {
          const filteredReviews = reviewsResponse.data.filter(review => review.seller_id === sellerId);
          const totalRating = filteredReviews.reduce((sum, review) => sum + review.rating, 0);
          const avgRating = filteredReviews.length > 0 ? (totalRating / filteredReviews.length).toFixed(1) : 0;
          setReviews(filteredReviews);
          setAverageRating(avgRating);
        } else {
          console.log('No reviews found');
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    const fetchPharmacyDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/pharmacies/${sellerId}`);
        setPharmacyDetails(response.data);
      } catch (error) {
        console.error('Error fetching pharmacy details:', error);
      }
    };

    fetchProduct();
    if (sellerId) {
      fetchReviews();
      fetchPharmacyDetails();
    }
  }, [id, sellerId]);

  const addToCart = async () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || {
      customerID: localStorage.getItem('customerId') || '',
      products: [],
      totalCost: 0,
    };

    const existingProductIndex = cart.products.findIndex(p => p.productID === product._id);

    if (existingProductIndex > -1) {
      cart.products[existingProductIndex].quantity += 1;
    } else {
      cart.products.push({ productID: product._id, quantity: 1 });
    }

    cart.totalCost += product.price;

    localStorage.setItem('cart', JSON.stringify(cart));

    try {
      const customerID = localStorage.getItem('customerId');
      if (!customerID) {
        throw new Error('Customer ID not found');
      }

      await axios.post(`http://localhost:5000/api/cart/${customerID}`, cart);
      toast.success('Cart updated successfully');
    } catch (error) {
      console.error('Error updating cart in backend:', error);
      toast.error('Failed to update cart. Please try again.');
    }
  };

  if (!product) return <Typography variant="h6" align="center">Loading...</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <ToastContainer />
      <div container spacing={4} >
        {/* Product Image */}
        <Grid item xs={12} md={7}>
          
          <Paper elevation={3} sx={{ borderRadius: 2, padding: 3, backgroundColor: '#F9F9F9' ,display:"flex",justifyContent:"center",gap:"50px",alignContent:"center",alignItems:"center"}}>
          <Grid item xs={12} md={5}>
            <CardMedia
              component="img"
              sx={{ height: 'auto',width:'400px', objectFit: 'cover', borderRadius: 2 }}
              image={product.images[0] || 'https://via.placeholder.com/300'}
              alt={product.productName}
            />
          
        </Grid>
        <div>
           {/* Product Details */}
            <Typography variant="h4" component="div" gutterBottom sx={{ color: '#006EBE', fontWeight: 700 }}>
              {product.productName}
            </Typography>
            <Typography variant="h5" component="div" color="textPrimary">
              Price: ${product.price}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <strong>Category:</strong> {product.category}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <strong>{product.quantity > 0 ? 'In Stock' : 'Out of Stock'}</strong>
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
              <strong>Description:</strong> {product.moreInfo}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body1" color="textSecondary">
              <strong>How It Works:</strong> {product.howItWorks}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <strong>Uses:</strong> {product.uses.join(', ')}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <strong>Side Effects:</strong> {product.sideEffects.join(', ')}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <strong>Storage Instructions:</strong> {product.storage}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <strong>Alternate Brands:</strong> {product.alternateBrands.join(', ')}
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                sx={{ backgroundColor: '#EB2026', color: '#FFFFFF', '&:hover': { backgroundColor: '#C21A1E' } }}
                onClick={addToCart}
              >
                Add to Cart
              </Button>
            </Box>
            </div>
          </Paper>
        </Grid>
      </div>

      <Grid container spacing={4} sx={{ mt: 4 }}>

         {/* Pharmacy Details */}
         <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ borderRadius: 2, padding: 3, backgroundColor: '#F9F9F9' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#006EBE', fontWeight: 700 }}>
              Pharmacy Details
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <strong>Name:</strong> {pharmacyDetails.sellerName || 'N/A'}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <strong>Address:</strong> {pharmacyDetails.location || 'N/A'} - {pharmacyDetails.pinCode}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <strong>Contact:</strong> {pharmacyDetails.contactInfo || 'N/A'}
            </Typography>
          </Paper>
        </Grid>

        {/* Review Form */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ borderRadius: 2, padding: 3, backgroundColor: '#F9F9F9' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#006EBE', fontWeight: 700 }}>
              Leave a Review
            </Typography>
            <ReviewForm customerName={customerName} sellerId={sellerId} />
          </Paper>
        </Grid>
      </Grid>

      {/* Reviews */}
      <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ borderRadius: 2, padding: 3, backgroundColor: '#F9F9F9' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#006EBE', fontWeight: 700 }}>
              Customer Reviews
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
              Average Rating: {averageRating} / 5
            </Typography>
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <Box key={index} sx={{ mb: 2, borderBottom: '1px solid #E0E0E0', pb: 2 }}>
                  <Typography variant="body1" color="textPrimary">
                    <strong>{review.customerName}</strong> - Rated: {review.rating} / 5
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {review.comment}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body1" color="textSecondary">
                No reviews yet.
              </Typography>
            )}
          </Paper>
        </Grid>
    </Container>
  );
};

export default ProductDescription;
