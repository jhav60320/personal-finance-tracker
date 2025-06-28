import axios from 'axios'

const API_URL = '/api/users'

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL, userData)
  if (response.data.token) {
    localStorage.setItem('userToken', response.data.token)
  }
  return response.data
}

// Login user
const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData)
  if (response.data.token) {
    localStorage.setItem('userToken', response.data.token)
  }
  return response.data
}

// Get user profile
const getUserProfile = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.get(`${API_URL}/profile`, config)
  return response.data
}

export default {
  register,
  login,
  getUserProfile
}