import axios from 'axios'

const API_URL = '/api/expenses'

// Get all expenses
const getExpenses = async (token, filters = {}) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: filters
  }
  const response = await axios.get(API_URL, config)
  return response.data
}

// Add new expense
const addExpense = async (token, expenseData) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.post(API_URL, expenseData, config)
  return response.data
}

// Update expense
const updateExpense = async (token, id, expenseData) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.put(`${API_URL}/${id}`, expenseData, config)
  return response.data
}

// Delete expense
const deleteExpense = async (token, id) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  await axios.delete(`${API_URL}/${id}`, config)
}

export default {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense
}