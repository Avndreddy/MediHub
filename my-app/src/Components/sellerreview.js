import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Rating, Box, Typography } from '@mui/material';

const ReviewForm = ({ customerName, sellerId }) => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(1); // Default rating
  const [error, setError] = useState('');
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      // Check rating is between 1 and 5
      if (rating < 1 || rating > 5) {
        setError('Rating must be between 1 and 5.');
        return;
      }
      if(localStorage.getItem("customerId")){
      await axios.post('http://localhost:5000/api/reviews', {
        customer_id: localStorage.getItem("customerId")||'',
        customerName,
        comment,
        date: new Date(),
        seller_id: sellerId,
        rating,
      });

      alert('Review submitted successfully!');
      setComment('');
      setRating(1);
    }else{
        alert('Please login to submit a review');
    }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        mt: 1, // Reduced margin-top
        maxWidth: 400, // Reduced max-width
        mx: 'auto',
        p: 2, // Reduced padding
        border: '1px solid #EB2026',
        borderRadius: 1, // Reduced border-radius
        boxShadow: 1, // Optional: add a subtle shadow
      }}
    >
      <Typography
        variant="h6"
        sx={{ mb: 1, fontSize: '1rem', color: '#006EBE' }} // Reduced font size
      >
        Submit a Review
      </Typography>
      <TextField
        label="Comment"
        fullWidth
        margin="normal"
        multiline
        rows={2} // Reduced number of rows
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
        sx={{ mb: 1, '& .MuiInputBase-root': { fontSize: '0.875rem' } }} // Reduced font size
      />
      <Box sx={{ mb: 1 }}>
        <Typography
          variant="body2"
          sx={{ mb: 0.5, fontSize: '0.875rem' }} // Reduced font size
        >
          Rating:
        </Typography>
        <Rating
          name="rating"
          value={rating}
          onChange={(e, newValue) => setRating(newValue)}
          precision={0.5}
          sx={{ mb: 1, fontSize: '1rem' }} // Adjusted font size
        />
      </Box>
      {error && (
        <Typography variant="body2" color="error" sx={{ mb: 1, fontSize: '0.75rem' }}>
          {error}
        </Typography>
      )}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ fontSize: '0.875rem', padding: '6px 12px' }} // Adjusted font size and padding
      >
        Submit Review
      </Button>
    </Box>
  );
};

export default ReviewForm;
