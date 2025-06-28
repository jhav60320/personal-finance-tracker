import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import budgetService from './budgetService'

const initialState = {
  budgets: [],
  loading: false,
  error: null
}

export const getBudgets = createAsyncThunk(
  'budgets/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userToken
      return await budgetService.getBudgets(token)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

export const saveBudget = createAsyncThunk(
  'budgets/save',
  async (budgetData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userToken
      return await budgetService.saveBudget(token, budgetData)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

export const deleteBudget = createAsyncThunk(
  'budgets/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userToken
      await budgetService.deleteBudget(token, id)
      return id
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

const budgetSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    reset: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBudgets.pending, (state) => {
        state.loading = true
      })
      .addCase(getBudgets.fulfilled, (state, action) => {
        state.loading = false
        state.budgets = action.payload
      })
      .addCase(getBudgets.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(saveBudget.fulfilled, (state, action) => {
        const index = state.budgets.findIndex(
          (budget) => budget._id === action.payload._id
        )
        if (index !== -1) {
          state.budgets[index] = action.payload
        } else {
          state.budgets.push(action.payload)
        }
      })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.budgets = state.budgets.filter(
          (budget) => budget._id !== action.payload
        )
      })
  }
})

export const { reset } = budgetSlice.actions
export default budgetSlice.reducer