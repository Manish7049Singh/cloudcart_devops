import api from './api';

export const cartService = {
  /**
   * Fetch current user's carts
   */
  async getAllCarts({ page = 1, limit = 10 } = {}) {
    const response = await api.get('/carts/', { params: { page, limit } });
    return response.data; // { message, data: CartBase[] }
  },

  /**
   * Retrieve single cart by ID
   */
  async getCartById(cartId) {
    const response = await api.get(`/carts/${cartId}`);
    return response.data; // { message, data: CartBase }
  },

  /**
   * Create new cart with item list
   * Schema: { cart_items: [ { product_id: int, quantity: int } ] }
   */
  async createCart(cartItems) {
    const payload = {
      cart_items: cartItems.map((item) => ({
        product_id: Number(item.product_id || item.productId || item.id),
        quantity: Number(item.quantity || 1),
      })),
    };
    const response = await api.post('/carts/', payload);
    return response.data; // { message, data: CartBase }
  },

  /**
   * Update existing cart's items
   * Schema: { cart_items: [ { product_id: int, quantity: int } ] }
   */
  async updateCart(cartId, cartItems) {
    const payload = {
      cart_items: cartItems.map((item) => ({
        product_id: Number(item.product_id || item.productId || item.id),
        quantity: Number(item.quantity || 1),
      })),
    };
    const response = await api.put(`/carts/${cartId}`, payload);
    return response.data; // { message, data: CartBase }
  },

  /**
   * Delete cart by ID
   */
  async deleteCart(cartId) {
    const response = await api.delete(`/carts/${cartId}`);
    return response.data;
  },
};

export default cartService;
