import React from 'react'
import CustomPieChart from '../Charts/CustomPieChart'


// This component is used to display the finance overview of the user. It shows the total balance, total income, and total expenses.
// It is a functional component that takes in props and returns a JSX element.

const COLORS = ["#875cf5","#fa2c37" , "#ff6900" , " "]

const FinanceOverview = ({totalBalance , totalIncome , totalExpenses}) => {

    const balaceData = [
        {name : "Total Balance" , amount :totalBalance},
        {name : "Total Expenses" , amount : totalExpenses},
        {name : "Total Income" , amount : totalIncome}
    ]
  return (
    <div className='card '>
        <div className='flex items-center justify-between   '>
            <h5 className='text-lg '>Financial Overview</h5>
        </div>

        <CustomPieChart
        data = {balaceData}
        label = "Total Balance"
        totalAmount = {`$${totalBalance}`}
        colors = {COLORS}
        showTextAnchor
        />

    </div>
  )
}

export default FinanceOverview
