import api from './api';

export const authService = {
  /**
   * Register a new user
   * Schema: { full_name, username, email, password }
   */
  async signup(userData) {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  /**
   * Authenticate user with OAuth2 password request form
   * Schema: application/x-www-form-urlencoded with username and password
   */
  async login(credentials) {
    const params = new URLSearchParams();
    params.append('username', credentials.username.trim());
    params.append('password', credentials.password);

    const response = await api.post('/auth/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data; // { access_token, refresh_token, token_type, expires_in }
  },

  /**
   * Refresh expired access token
   * Header: refresh-token
   */
  async refreshToken(refreshToken) {
    const response = await api.post(
      '/auth/refresh',
      {},
      {
        headers: {
          'refresh-token': refreshToken,
        },
      }
    );
    return response.data;
  },
};

export default authService;
