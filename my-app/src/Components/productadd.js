import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    pharmacy_id: '',
    seller_id: '',
    productName: '',
    category: '',
    quantity: '',
    moreInfo: '',
    price: '',
    discount: '',
    keywords: '',
    images: [],
  });
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/api/products/${id}`).then(response => {
        setProduct(response.data);
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(product).forEach(key => {
      formData.append(key, product[key]);
    });
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    if (id) {
      axios.put(`http://localhost:5000/api/products/${id}`, formData)
        .then(() => navigate('/products'))
        .catch(error => console.error(error));
    } else {
      axios.post('http://localhost:5000/api/products', formData)
        .then(() => navigate('/products'))
        .catch(error => console.error(error));
    }
  };

  return (
    <div>
      <h2>{id ? 'Update Product' : 'Add Product'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="pharmacy_id"
          value={product.pharmacy_id}
          onChange={handleChange}
          placeholder="Pharmacy ID"
          required
        />
        <input
          type="text"
          name="seller_id"
          value={product.seller_id}
          onChange={handleChange}
          placeholder="Seller ID"
          required
        />
        <input
          type="text"
          name="productName"
          value={product.productName}
          onChange={handleChange}
          placeholder="Product Name"
          required
        />
        <input
          type="text"
          name="category"
          value={product.category}
          onChange={handleChange}
          placeholder="Category"
          required
        />
        <input
          type="number"
          name="quantity"
          value={product.quantity}
          onChange={handleChange}
          placeholder="Quantity"
          required
        />
        <input
          type="text"
          name="moreInfo"
          value={product.moreInfo}
          onChange={handleChange}
          placeholder="More Info"
          required
        />
        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
          placeholder="Price"
          required
        />
        <input
          type="number"
          name="discount"
          value={product.discount}
          onChange={handleChange}
          placeholder="Discount"
          required
        />
        <input
          type="text"
          name="keywords"
          value={product.keywords}
          onChange={handleChange}
          placeholder="Keywords (comma separated)"
          required
        />
        <input
          type="file"
          name="images"
          multiple
          onChange={handleFileChange}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ProductForm;
