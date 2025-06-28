import axios from 'axios'

const API_URL = '/api/reports'

// Get dashboard data
const getDashboardData = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.get(`${API_URL}/dashboard`, config)
  return response.data
}

// Get smart suggestions
const getSmartSuggestions = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.get(`${API_URL}/suggestions`, config)
  console.log(response.data);
  
  return response.data
}

// Generate monthly report
const generateMonthlyReport = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.post(`${API_URL}/monthly`, {}, config)
  return response.data
}

// Get report history
const getReportHistory = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.get(`${API_URL}/history`, config)
  return response.data
}

export default {
  getDashboardData,
  getSmartSuggestions,
  generateMonthlyReport,
  getReportHistory
}