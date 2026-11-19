import api from './api';

export const productService = {
  /**
   * Fetch paginated products with optional search query
   */
  async getProducts({ page = 1, limit = 10, search = '' } = {}) {
    const params = { page, limit };
    if (search) params.search = search;
    const response = await api.get('/products/', { params });
    return response.data; // { message, data: ProductBase[] }
  },

  /**
   * Retrieve single product details by ID
   */
  async getProductById(productId) {
    const response = await api.get(`/products/${productId}`);
    return response.data; // { message, data: ProductBase }
  },

  /**
   * Admin: Create new product
   * Required schema fields:
   * title, description, price, discount_percentage, rating, stock, brand,
   * thumbnail, images, is_published, created_at, category_id
   */
  async createProduct(productData) {
    const payload = {
      ...productData,
      created_at: productData.created_at || new Date().toISOString(),
    };
    const response = await api.post('/products/', payload);
    return response.data;
  },

  /**
   * Admin: Update product by ID
   */
  async updateProduct(productId, productData) {
    const payload = {
      ...productData,
      created_at: productData.created_at || new Date().toISOString(),
    };
    const response = await api.put(`/products/${productId}`, payload);
    return response.data;
  },

  /**
   * Admin: Delete product by ID
   */
  async deleteProduct(productId) {
    const response = await api.delete(`/products/${productId}`);
    return response.data;
  },
};

export default productService;
