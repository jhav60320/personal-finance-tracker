const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  paymentMethod: {
    type: String,
    required: true
  },
  notes: {
    type: String
  },
  budgetAlert: {
    type: String,
    enum: [null, 'warning', 'exceeded'],
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Expense', ExpenseSchema);