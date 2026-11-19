import api from './api';

export const userService = {
  /**
   * Fetch current authenticated user's account info
   */
  async getMyInfo() {
    const response = await api.get('/me/');
    return response.data; // { message, data: AccountBase }
  },

  /**
   * Update authenticated user's profile
   * Schema: { username, email, full_name }
   */
  async updateMyInfo(updateData) {
    const response = await api.put('/me/', updateData);
    return response.data;
  },

  /**
   * Delete current authenticated user's account
   */
  async deleteMyAccount() {
    const response = await api.delete('/me/');
    return response.data;
  },

  /**
   * Admin: List users with pagination and search
   */
  async getAllUsers({ page = 1, limit = 10, search = '', role = 'user' } = {}) {
    const params = { page, limit, role };
    if (search) params.search = search;
    const response = await api.get('/users/', { params });
    return response.data;
  },

  /**
   * Admin: Retrieve specific user by ID
   */
  async getUserById(userId) {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  /**
   * Admin: Create new user
   */
  async createUser(userData) {
    const response = await api.post('/users/', userData);
    return response.data;
  },

  /**
   * Admin: Update user by ID
   */
  async updateUser(userId, userData) {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  },

  /**
   * Admin: Delete user by ID
   */
  async deleteUser(userId) {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },
};

export default userService;
