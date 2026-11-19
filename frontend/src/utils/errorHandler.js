/**
 * Extracts a user-friendly error message from FastAPI responses,
 * handling Pydantic 422 validation structures, detail strings, and network errors.
 * 
 * @param {Error|Object} error - Axios error or generic Error
 * @returns {string} Human-readable message
 */
export const getErrorMessage = (error) => {
  if (!error) return 'An unexpected error occurred.';

  // If response received from backend
  if (error.response) {
    const data = error.response.data;

    // Standard FastAPI HTTPException structure { detail: "..." }
    if (typeof data?.detail === 'string') {
      return data.detail;
    }

    // Pydantic validation errors { detail: [ { loc: [...], msg: "..." } ] }
    if (Array.isArray(data?.detail)) {
      const messages = data.detail.map((err) => {
        const field = Array.isArray(err.loc) ? err.loc[err.loc.length - 1] : '';
        return field ? `${field}: ${err.msg}` : err.msg;
      });
      return messages.join(', ');
    }

    // Direct message property
    if (data?.message) {
      return data.message;
    }

    // Fallback based on HTTP status codes
    switch (error.response.status) {
      case 400:
        return 'Bad request. Please verify your input.';
      case 401:
        return 'Session expired or unauthenticated. Please log in again.';
      case 403:
        return 'Access denied. You do not have permission to perform this action.';
      case 404:
        return 'Requested resource was not found.';
      case 409:
        return 'A conflict occurred. The record may already exist.';
      case 422:
        return 'Validation failed. Please verify the form fields.';
      case 500:
        return 'Internal server error. Please try again later.';
      default:
        return `Request failed with status ${error.response.status}.`;
    }
  }

  // Network or connection failure
  if (error.request) {
    return 'Unable to reach the server. Please check your internet connection or backend server status.';
  }

  return error.message || 'An unexpected error occurred.';
};
