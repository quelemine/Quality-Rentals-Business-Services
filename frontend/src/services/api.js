import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
    const response = await api.post('/quote-requests.php', quoteData);
    return response.data;
  } catch (error) {
    console.error('Error submitting quote request:', error);
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
