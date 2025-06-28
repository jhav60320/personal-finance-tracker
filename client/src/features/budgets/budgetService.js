import axios from 'axios'

const API_URL = '/api/budgets'

// Get all budgets
const getBudgets = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.get(API_URL, config)
  return response.data
}

// Add or update budget
const saveBudget = async (token, budgetData) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.post(API_URL, budgetData, config)
  return response.data
}

// Delete budget
const deleteBudget = async (token, id) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  await axios.delete(`${API_URL}/${id}`, config)
}

export default {
  getBudgets,
  saveBudget,
  deleteBudget
}