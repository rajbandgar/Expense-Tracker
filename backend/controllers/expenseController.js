const Expense = require("../models/Expense");
const xlsx = require("xlsx");

// Add expense to the database
exports.addExpense = async (req, res) => {
    const userId = req.user._id;

    try {
        const { icon, category, amount, date } = req.body;

        // Validation
        if (!category || !amount || !date) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date)
        });
        await newExpense.save();
        return res.status(201).json(newExpense);

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Get all expenses
exports.getAllExpense = async (req, res) => {
    const userId = req.user._id;

    try {
        const expenses = await Expense.find({ userId }).sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Delete a specific expense
exports.deleteExpense = async (req, res) => {
    const userId = req.user._id;
    try {
        await Expense.findByIdAndDelete(req.params._id);
        res.json({ message: "Expense deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Download all expenses as Excel
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user._id;

    try {
        const expenses = await Expense.find({ userId }).sort({ date: -1 });

        // Preparing data for excel
        const data = expenses.map((item) => ({
            Category: item.category,
            Amount: item.amount,
            Date: item.date,
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Expenses");
        xlsx.writeFile(wb, "Expense_details.xlsx");
        res.download("Expense_details.xlsx");
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
