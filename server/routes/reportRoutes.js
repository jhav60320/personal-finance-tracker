const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');
const { db } = require('../index');
const axios = require('axios');

// ... (previous imports and other routes remain the same)

// @desc    Get dashboard data
// @route   GET /api/reports/dashboard
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
  try {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
    
    // Total spent this month
    const totalSpent = await Expense.aggregate([
      {
        $match: {
          user: req.user.id,
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Category with most spending
    const topCategory = await Expense.aggregate([
      {
        $match: {
          user: req.user.id,
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      },
      {
        $sort: { total: -1 }
      },
      {
        $limit: 1
      }
    ]);

    // Top 3 payment methods
    const topPaymentMethods = await Expense.aggregate([
      {
        $match: {
          user: req.user.id,
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: '$paymentMethod',
          total: { $sum: '$amount' }
        }
      },
      {
        $sort: { total: -1 }
      },
      {
        $limit: 3
      }
    ]);

    // Category-wise spending for pie chart
    const categorySpending = await Expense.aggregate([
      {
        $match: {
          user: req.user.id,
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Daily spending for line chart
    const dailySpending = await Expense.aggregate([
      {
        $match: {
          user: req.user.id,
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          total: { $sum: '$amount' }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    res.json({
      totalSpent: totalSpent.length > 0 ? totalSpent[0].total : 0,
      topCategory: topCategory.length > 0 ? topCategory[0] : null,
      topPaymentMethods,
      categorySpending,
      dailySpending
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @desc    Get smart suggestions
// @route   GET /api/reports/suggestions
// @access  Private
router.get('/suggestions', protect, async (req, res) => {
  try {
    // Get last 30 days of expenses
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const expenses = await Expense.find({
      user: req.user.id,
      date: { $gte: thirtyDaysAgo }
    });

    // Send to Python service
    const response = await axios.post(`${process.env.PYTHON_SERVICE_URL}/analyze`, {
      expenses
    });

    res.json(response.data.suggestions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @desc    Generate monthly report
// @route   POST /api/reports/monthly
// @access  Private
router.post('/monthly', protect, async (req, res) => {
  try {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    
    const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfMonth = new Date(currentYear, currentMonth, 0);
    
    // Get total spent
    const totalSpentResult = await Expense.aggregate([
      {
        $match: {
          user: req.user.id,
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);
    
    const totalSpent = totalSpentResult.length > 0 ? totalSpentResult[0].total : 0;
    
    // Get top category
    const topCategoryResult = await Expense.aggregate([
      {
        $match: {
          user: req.user.id,
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      },
      {
        $sort: { total: -1 }
      },
      {
        $limit: 1
      }
    ]);
    
    const topCategory = topCategoryResult.length > 0 ? topCategoryResult[0]._id : null;
    
    // Get overbudget categories
    const budgets = await Budget.find({ user: req.user.id });
    const overbudgetCategories = [];
    
    for (const budget of budgets) {
      const categorySpentResult = await Expense.aggregate([
        {
          $match: {
            user: req.user.id,
            category: budget.category,
            date: { $gte: startOfMonth, $lte: endOfMonth }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]);
      
      const categorySpent = categorySpentResult.length > 0 ? categorySpentResult[0].total : 0;
      
      if (categorySpent > budget.limit) {
        overbudgetCategories.push({
          category: budget.category,
          spent: categorySpent,
          limit: budget.limit
        });
      }
    }
    
    // Save to SQLite
    const query = `
      INSERT INTO monthly_reports 
        (user_id, month, year, total_spent, top_category, overbudget_categories)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id, month, year) 
      DO UPDATE SET 
        total_spent = excluded.total_spent,
        top_category = excluded.top_category,
        overbudget_categories = excluded.overbudget_categories
    `;
    
    db.run(query, [
      req.user.id,
      currentMonth,
      currentYear,
      totalSpent,
      topCategory,
      JSON.stringify(overbudgetCategories)
    ], function(err) {
      if (err) {
        console.error('Error saving monthly report:', err.message);
        return res.status(500).send('Server error');
      }
      
      res.json({ 
        message: 'Monthly report generated successfully',
        totalSpent,
        topCategory,
        overbudgetCategories
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @desc    Get past reports
// @route   GET /api/reports/history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const query = `
      SELECT * FROM monthly_reports 
      WHERE user_id = ?
      ORDER BY year DESC, month DESC
      LIMIT 3
    `;
    
    db.all(query, [req.user.id], (err, rows) => {
      if (err) {
        console.error('Error fetching report history:', err.message);
        return res.status(500).send('Server error');
      }
      
      // Parse the overbudget_categories JSON string
      const reports = rows.map(row => ({
        ...row,
        overbudget_categories: row.overbudget_categories 
          ? JSON.parse(row.overbudget_categories)
          : []
      }));
      
      res.json(reports);
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @desc    Get all users reports (admin only)
// @route   GET /api/reports/admin
// @access  Private/Admin
router.get('/admin', protect, admin, async (req, res) => {
  try {
    const query = `
      SELECT 
        mr.*,
        u.name as user_name,
        u.email as user_email
      FROM monthly_reports mr
      JOIN users u ON mr.user_id = u.id
      ORDER BY mr.year DESC, mr.month DESC
    `;
    
    db.all(query, [], (err, rows) => {
      if (err) {
        console.error('Error fetching admin reports:', err.message);
        return res.status(500).send('Server error');
      }
      
      // Parse the overbudget_categories JSON string
      const reports = rows.map(row => ({
        ...row,
        overbudget_categories: row.overbudget_categories 
          ? JSON.parse(row.overbudget_categories)
          : []
      }));
      
      res.json(reports);
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

// This file defines the report routes for the personal finance tracker application.
// It includes endpoints for generating dashboard data, smart suggestions, monthly reports,