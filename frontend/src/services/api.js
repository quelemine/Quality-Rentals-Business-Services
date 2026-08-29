import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response) {
      // Server responded with error status
      console.error('Response Error Data:', error.response.data);
      console.error('Response Error Status:', error.response.status);
    } else if (error.request) {
      // Request made but no response received
      console.error('No Response:', error.request);
    } else {
      // Error in request setup
      console.error('Request Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const fetchCategories = async () => {
  try {
    const response = await api.get('/categories.php');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const fetchProducts = async (categoryId = null) => {
  try {
    const params = categoryId ? { category_id: categoryId } : {};
    const response = await api.get('/products.php', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchProduct = async (productId) => {
  try {
    const response = await api.get('/products.php', { params: { id: productId } });
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export const submitQuoteRequest = async (quoteData) => {
  try {
    console.log('=== API Quote Request Debug ===');
    console.log('Endpoint:', '/quote-requests.php');
    console.log('Data:', quoteData);
    
    const response = await api.post('/quote-requests.php', quoteData);
    console.log('Response Status:', response.status);
    console.log('Response Data:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('=== API Quote Request Error ===');
    console.error('Error:', error);
    console.error('Error Response:', error.response);
    console.error('Error Message:', error.message);
    
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', error.response.data);
    }
    
    throw error;
  }
};

export const fetchGallery = async () => {
  try {
    const response = await api.get('/gallery.php');
    return response.data;
  } catch (error) {
    console.error('Error fetching gallery:', error);
    throw error;
  }
};

export default api;
