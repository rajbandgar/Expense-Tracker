
const Income = require("../models/Income");
const xlsx = require("xlsx");

// Add income to the database
exports.addIncome = async (req, res) => {
    const userId = req.user._id;

    try{
    const {icon, source, amount,date} = req.body;

    //Validation
    if(  !source || !amount || !date){
        return res.status(400).json({message:"Please fill all the fields"})
    }

    const newIncome = new Income({
        userId,
        icon,
        source,
        amount,
        date:new Date(date)
    });
    await newIncome.save();
    return res.status(201).json(newIncome);

}catch(error){
    res.status(500).json({message:"Server error"});
}
}

exports.getAllIncome = async (req, res) => {
    const userId = req.user._id;

    try{
        const income = await Income.find({userId}).sort({date:-1});
        res.json(income);
    }catch(error){
        res.status(500).json({message:"Server error"});
    }
}


exports.deleteIncome = async (req, res) => {
    const userId = req.user._id;

    try{
        await Income.findOneAndDelete(req.params._id)
        res.json({message:"Income deleted successfully"});
    }catch(error){
        res.status(500).json({message:"Server error"});
    }
}

exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user._id;

    try{
        const income = await Income.find({userId}).sort({date:-1});


        //Preparing data for excel
        const data = income.map((item) => {
            return {
                Source: item.source,
                Amount: item.amount,
                Date: item.date,
            }});

            const wb =xlsx.utils.book_new();
            const ws =xlsx.utils.json_to_sheet(data);
            xlsx.utils.book_append_sheet(wb,ws,"Income");
            xlsx.writeFile(wb,"Income_details.xlsx");
            res.download("Income_details.xlsx")
    }catch(error){
        res.status(500).json({message:"Server error"});
    }
}
