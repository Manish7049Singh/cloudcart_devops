import api from './api';

export const categoryService = {
  /**
   * Fetch paginated categories with optional search query
   */
  async getCategories({ page = 1, limit = 100, search = '' } = {}) {
    const params = { page, limit };
    if (search) params.search = search;
    const response = await api.get('/categories/', { params });
    return response.data; // { message, data: CategoryBase[] }
  },

  /**
   * Retrieve specific category by ID
   */
  async getCategoryById(categoryId) {
    const response = await api.get(`/categories/${categoryId}`);
    return response.data;
  },

  /**
   * Admin: Create new category
   * Schema: { name }
   */
  async createCategory(categoryData) {
    const response = await api.post('/categories/', categoryData);
    return response.data;
  },

  /**
   * Admin: Update category by ID
   */
  async updateCategory(categoryId, categoryData) {
    const response = await api.put(`/categories/${categoryId}`, categoryData);
    return response.data;
  },

  /**
   * Admin: Delete category by ID
   */
  async deleteCategory(categoryId) {
    const response = await api.delete(`/categories/${categoryId}`);
    return response.data;
  },
};

export default categoryService;
