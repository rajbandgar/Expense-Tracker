const Income = require("../models/Income");
const Expense = require("../models/Expense");
const {isValidObjectId, Types } = require("mongoose");

// Dashboard data
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;
    const userIdObject = new Types.ObjectId(String(userId));

    // Fetch total income and expenses
    const totalIncome = await Income.aggregate([
      { $match: { userId: userIdObject } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const totalExpenses = await Expense.aggregate([
      { $match: { userId: userIdObject } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    // Income in last 60 days
    const last60DaysIncomeTransactions = await Income.find({
      userId,
      date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) }
    }).sort({ date: -1 });

    const incomeLast60Days = last60DaysIncomeTransactions.reduce((sum, txn) => sum + txn.amount, 0);

    // Expenses in last 30 days
    const last30DaysExpenseTransactions = await Expense.find({
      userId,
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    }).sort({ date: -1 });

    const expenseLast30Days = last30DaysExpenseTransactions.reduce((sum, txn) => sum + txn.amount, 0);

    // Fetch last 5 combined transactions (income + expense)
    const lastTransactions = [
      ...(await Income.find({ userId }).sort({ date: -1 }).limit(5)).map(txn => ({
        ...txn.toObject(),
        type: "income"
      })),
      ...(await Expense.find({ userId }).sort({ date: -1 }).limit(5)).map(txn => ({
        ...txn.toObject(),
        type: "expense"
      }))
    ].sort((a, b) => b.date - a.date).slice(0, 5);

    // Final response
    res.json({
      totalBalance: (totalIncome[0]?.total || 0) - (totalExpenses[0]?.total || 0),
      totalIncome: totalIncome[0]?.total || 0,
      totalExpenses: totalExpenses[0]?.total || 0,
      last30DaysExpenses: {
        total: expenseLast30Days,
        transactions: last30DaysExpenseTransactions
      },
      last60DaysIncome: {
        total: incomeLast60Days,
        transactions: last60DaysIncomeTransactions
      },
      recentTransactions: lastTransactions
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
