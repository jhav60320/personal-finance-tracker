const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Budget = require('../models/Budget');

// @desc    Get all budgets for a user
// @route   GET /api/budgets
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id });
    res.json(budgets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @desc    Add or update budget
// @route   POST /api/budgets
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { category, limit } = req.body;

    let budget = await Budget.findOne({ user: req.user.id, category });

    if (budget) {
      budget.limit = limit;
    } else {
      budget = new Budget({
        user: req.user.id,
        category,
        limit
      });
    }

    await budget.save();
    res.json(budget);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ msg: 'Budget not found' });
    }

    // Make sure user owns the budget
    if (budget.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Budget.findByIdAndDelete(req.params.id); 
    res.json({ msg: 'Budget removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;