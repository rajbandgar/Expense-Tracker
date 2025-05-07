import React, { useEffect } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useUserAuth } from '../../hooks/useUserAuth'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axiosInstance from '../../utils/axiosInstances'
import { API_PATHS } from '../../utils/apiPaths'
import InfoCard from '../../components/Cards/InfoCard'
import { IoMdCard } from 'react-icons/io'
import { LuHandCoins, LuWalletMinimal } from 'react-icons/lu'
import { addThousandsSeparator } from '../../utils/helper'
import RecentTransactions from '../../components/Dashboard/RecentTransactions'
import FinanceOverview from '../../components/Dashboard/FinanceOverview'
import ExpensesTransactions from '../../components/Dashboard/ExpensesTransactions'
import Last30DaysExpenses from '../../components/Dashboard/Last30DaysExpenses'
import RecentIncomeWithChart from '../../components/Dashboard/RecentIncomeWithChart'
import RecentIncome from '../../components/Dashboard/RecentIncome'



const Home = () => {
  useUserAuth();

  // useUserAuth is a custom hook that checks if the user is authenticated and fetches user info if needed.
  // It also handles redirection to the login page if the user is not authenticated.

  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);


  const fetchDashboardData = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await axiosInstance.get(`${API_PATHS.DASHBOARD.GET_DATA}`);
      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboardData();
    // This function fetches the dashboard data when the component mounts.
    // It sets the loading state to true while fetching and false after fetching.


    return () => {

    }
  }, [])
  const dummyTransactions = [
    {
      _id: "1",
      type: "expense",
      category: "Groceries",
      amount: 250,
      date: "2025-04-21T00:00:00Z",
      icon: null,
    },
    {
      _id: "2",
      type: "income",
      source: "Freelancing",
      amount: 1500,
      date: "2025-04-20T00:00:00Z",
      icon: null,
    },
    {
      _id: "3",
      type: "expense",
      category: "Transport",
      amount: 120,
      date: "2025-04-19T00:00:00Z",
      icon: null,
    },
  ];

  return (


    <DashboardLayout activeMenu="Dashboard">
      <div className='my-5 mx-auto'>
        <div className=' grid grid-cols-1 md:grid-cols-3 gap-6 '>
          <InfoCard
            icon={<IoMdCard />}
            label="Total Balance"
            value={addThousandsSeparator(dashboardData?.totalBalance || 0)}
            color="bg-violet-500"
          />
          <InfoCard
            icon={<LuWalletMinimal />}
            label="Total Income"
            value={addThousandsSeparator(dashboardData?.totalIncome || 0)}
            color="bg-orange-500"
          />
          <InfoCard
            icon={<LuHandCoins />}
            label="Total Expense"
            value={addThousandsSeparator(dashboardData?.totalExpenses || 0)}
            color="bg-red-500"
          />
        </div >

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6' >


          <RecentTransactions
            transactions={dashboardData?.recentTransactions}
            onSeeMore={() => navigate("/expense")}
          />


          <FinanceOverview
            totalBalance={dashboardData?.totalBalance || 0}
            totalIncome={dashboardData?.totalIncome}
            totalExpenses={dashboardData?.totalExpenses}
          />


          <ExpensesTransactions
            transactions = {dashboardData?.last30DaysExpenses?.transactions || []}
            onSeeMore = {() => navigate("/expense")}/>


            <Last30DaysExpenses
            data = {dashboardData?.last30DaysExpenses?.transactions || []} />


            <RecentIncomeWithChart 
                data = {dashboardData?.last60DaysIncome?.transactions?.slice(0,4) || []}
                  totalIncome = {dashboardData?.totalIncome || 0}
                  />

            <RecentIncome
              transactions = {dashboardData?.last60DaysIncome?.transactions || []} 
              onSeeMore = {() => navigate("/income")} />      

                
        </div>


      </div >
    </DashboardLayout>


  );
};


export default Home
