// Authentication service for login, signup, password reset

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Sign up a new organization
 * @param {Object} signupData - Organization and admin data
 * @returns {Promise<Object>} Created organization and user
 */
export const signupOrganization = async (signupData) => {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(signupData),
    // });
    // return await response.json();
    
    // Create organization and user
    const { saveOrganization } = await import('./organizationStorage.js');
    
    const organization = {
      id: Date.now(),
      name: signupData.organizationName,
      description: signupData.organizationDescription,
    };
    
    const savedOrg = saveOrganization(organization);

    const user = {
      id: Date.now() + 1,
      email: signupData.email,
      firstName: signupData.firstName,
      lastName: signupData.lastName,
      phone: signupData.phone,
      role: 'organization_admin',
      organizationId: savedOrg.id,
    };

    // Store in localStorage
    localStorage.setItem('icepulse_current_user', JSON.stringify(user));
    localStorage.setItem('icepulse_current_organization', JSON.stringify(savedOrg));
    localStorage.setItem('icepulse_auth_token', 'token_' + Date.now());

    return { organization: savedOrg, user };
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

/**
 * Login user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} User and organization data
 */
export const login = async (email, password) => {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/auth/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password }),
    // });
    // const data = await response.json();
    // localStorage.setItem('icepulse_auth_token', data.token);
    // return data;
    
    // Mock response
    const user = {
      id: 1,
      email,
      firstName: 'Admin',
      lastName: 'User',
      role: 'organization_admin',
      organizationId: 1,
    };

    const organization = {
      id: 1,
      name: 'Edmonton Oilers',
      description: 'Hockey organization',
    };

    localStorage.setItem('icepulse_current_user', JSON.stringify(user));
    localStorage.setItem('icepulse_current_organization', JSON.stringify(organization));
    localStorage.setItem('icepulse_auth_token', 'mock_token_' + Date.now());

    return { user, organization };
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

/**
 * Request password reset
 * @param {string} email
 * @returns {Promise<boolean>} Success
 */
export const requestPasswordReset = async (email) => {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/auth/password-reset`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email }),
    // });
    // return response.ok;
    
    // Generate reset token (mock)
    const resetToken = Math.random().toString(36).substring(7) + Date.now();
    
    // Store reset token (in production, this would be in database)
    localStorage.setItem(`icepulse_reset_token_${email}`, resetToken);
    
    // Send email (or return link for notification)
    const { sendPasswordResetEmail } = await import('./emailService.js');
    await sendPasswordResetEmail(email, resetToken);
    
    // Return the reset link so it can be displayed
    return `${window.location.origin}/reset-password/${resetToken}`;
  } catch (error) {
    console.error('Error requesting password reset:', error);
    throw error;
  }
};

/**
 * Reset password with token
 * @param {string} token
 * @param {string} newPassword
 * @returns {Promise<boolean>} Success
 */
export const resetPassword = async (token, newPassword) => {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/auth/password-reset/${token}`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ password: newPassword }),
    // });
    // return response.ok;
    
    // Mock: In production, verify token and update password
    return true;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

/**
 * Get current user from localStorage
 * @returns {Object|null} Current user
 */
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('icepulse_current_user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    return null;
  }
};

/**
 * Get current organization from localStorage
 * @returns {Object|null} Current organization
 */
export const getCurrentOrganization = () => {
  try {
    const orgStr = localStorage.getItem('icepulse_current_organization');
    return orgStr ? JSON.parse(orgStr) : null;
  } catch (error) {
    return null;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('icepulse_auth_token');
};

/**
 * Logout user
 */
export const logout = () => {
  localStorage.removeItem('icepulse_current_user');
  localStorage.removeItem('icepulse_current_organization');
  localStorage.removeItem('icepulse_auth_token');
};

