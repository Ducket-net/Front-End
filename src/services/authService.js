// authService.js
import axios from 'axios';
import store from '../store';
import router from '../router';

const clientId = process.env.VUE_APP_CLIENT_ID;
const clientSecret = process.env.VUE_APP_CLIENT_SECRET;
const ducketUrl = process.env.VUE_APP_API_URL;
// const appUrl = process.env.VUE_APP_URL;
const redirectUri = process.env.VUE_APP_REDIRECT_URI;

const authService = {
  getAuthorizationCode() {
    const url =
      `${ducketUrl}/oauth/authorize?client_id=` +
      clientId +
      `&redirect_uri=${redirectUri}&response_type=code&scope=*`;
    window.location.replace(url);
  },

  async login(username, password) {
    try {
      const response = await axios.post(`${ducketUrl}/oauth/token`, {
        grant_type: 'password',
        client_id: clientId,
        client_secret: clientSecret,
        username,
        password,
      });

      if (response.status !== 200) {
        throw new Error('Invalid response from server');
      }
      const token = response.data.access_token;
      await store.dispatch('authenticate', token);

      return response.data;
    } catch (error) {
      // Laravel Passport standard error response handling
      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.error && data.error === 'invalid_credentials') {
          throw new Error('Invalid email or password');
        } else if (data.error && data.error === 'invalid_request') {
          throw new Error('Invalid request');
        } else if (data.message) {
          throw new Error(data.message);
        } else {
          throw new Error('An unknown error occurred');
        }
      } else {
        console.error('Error getting access token:', error);
      }
    }
  },

  async getUser(token) {
    try {
      const response = await axios.get(`${ducketUrl}/api/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const user = response.data;
      // Save user (e.g., in localStorage, Vuex, or cookies)
      return user;
    } catch (error) {
      console.error('Error getting user:', error);
    }
  },

  async logout() {
    try {
      //Clear Token from Store
      store.commit('setAccessTokenAndUser', { token: null, user: null });

      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      router.push('/');
    } catch (error) {
      console.error('Error getting access token:', error);
    }
  },
};

export default authService;
