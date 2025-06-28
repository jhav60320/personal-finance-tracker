import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import expenseService from './expenseService'

const initialState = {
  expenses: [],
  loading: false,
  error: null
}

export const getExpenses = createAsyncThunk(
  'expenses/getAll',
  async (filters, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userToken
      return await expenseService.getExpenses(token, filters)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

export const addExpense = createAsyncThunk(
  'expenses/add',
  async (expenseData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userToken
      return await expenseService.addExpense(token, expenseData)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

export const updateExpense = createAsyncThunk(
  'expenses/update',
  async ({ id, expenseData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userToken
      return await expenseService.updateExpense(token, id, expenseData)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

export const deleteExpense = createAsyncThunk(
  'expenses/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userToken
      await expenseService.deleteExpense(token, id)
      return id
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    reset: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(getExpenses.pending, (state) => {
        state.loading = true
      })
      .addCase(getExpenses.fulfilled, (state, action) => {
        state.loading = false
        state.expenses = action.payload
      })
      .addCase(getExpenses.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.expenses.unshift(action.payload)
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        const index = state.expenses.findIndex(
          (expense) => expense._id === action.payload._id
        )
        if (index !== -1) {
          state.expenses[index] = action.payload
        }
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.expenses = state.expenses.filter(
          (expense) => expense._id !== action.payload
        )
      })
  }
})

export const { reset } = expenseSlice.actions
export default expenseSlice.reducer