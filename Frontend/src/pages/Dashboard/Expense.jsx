import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useUserAuth } from '../../hooks/useUserAuth'
import axiosInstance from '../../utils/axiosInstances'
import { API_PATHS } from '../../utils/apiPaths'
import toast from 'react-hot-toast'
import Modal from '../../components/Modal'
import ExpenseOverview from '../../components/Expenses/ExpenseOverview'
import AddExpenseForm from '../../components/Expenses/AddExpenseForm'
import ExpenseList from '../../components/Expenses/ExpenseList'
import DeleteAlert from '../../components/DeleteAlert'
import { Link } from 'react-router-dom'

const Expense = () => {
  useUserAuth()

  const [ expenseData, setExpenseData] = useState([])
    const [loading ,setLoading] = useState(false)
    const [openDeleteAlert ,setOpenDeleteAlert] = useState({show:false, 
      data:null,
  
     })
  
    const [openAddExpenseModal , setOpenAddExpenseModal] = useState(false)

       //Get all expense details
   const fetchExpenseDetails =async() => {
    if (loading) return ;

    setLoading(true);

    try{
      const respose = await axiosInstance.get(`${API_PATHS.EXPENSE.GET_EXPENSE}`)

      if(respose.data){
        setExpenseData(respose.data)
      }
    }catch(error){
      console.log("Something went wrong", error )
    }finally{
      setLoading(false)
    }
   }

   //Handle add income
   const handleAddExpense =async (expense) => { 
      const {category ,amount,date ,icon} = expense;

      //Validation checks
      if(!category.trim){
        toast.error("category is Required")
        return;
      }
      if(!amount || isNaN(amount) || Number(amount) <=0 ){
        toast.error("Amount should be valid number greater than 0")
        return;
      }
      if(!date){
        toast.error("Date is Required")
        return;
      }
      try{
        await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
          category ,
          amount,
          date,
          icon
        })
        setOpenAddExpenseModal(false)
        toast.success("Expense Added Successfully")
        fetchExpenseDetails();
      }catch(error){
        console.error("Error adding expense :" ,error.response ?.data?.message || error.message)
      }
   }


   const deleteExpense = async (id) => {
    try{
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id))
      setOpenDeleteAlert({show:false ,data:null})
      toast.success("Expense details deleted successfully")
      fetchExpenseDetails();
    }catch(error){
      console.error("Error deleting expense: " ,error.response?.data?.message || error.message)
    }
  }

  //handle dowmload income
  const handleDownloadExpenseDetails = async () =>{
    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXPENSE ,{responseType :"blob"});
      //Create a URL for the blob

      const url = window.URL.createObjectURL(new Blob ([response.data]))
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download" ,"expense_details.xlsx");
      document.body.appendChild(link)
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url)
      
    }catch(error){
      console.error("Error downloading expense details :" , error)
      toast.error("Failed to download data")
    }
  }


   useEffect (() =>{
    fetchExpenseDetails();

    return ()=>{}
   })

  return (
    <DashboardLayout activeMenu="Expense">
      <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 gap-6'>
          <div className=''>
            <ExpenseOverview
              transactions = {expenseData}
              onExpenseIncome = {() =>setOpenAddExpenseModal(true)} />
          </div>

          <ExpenseList
            transactions ={expenseData}
            onDelete ={(id)=>{
              setOpenDeleteAlert({show :true ,data:id})
            }}
            onDownload = {handleDownloadExpenseDetails} />
        </div>

        <Modal 
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Add Expense" >
            <AddExpenseForm
              onAddExpense = {handleAddExpense} />
              </Modal> 


              <Modal 
             isOpen={openDeleteAlert.show}
             onClose={()=>setOpenDeleteAlert({
              show:false ,data:null
             })}
             title="Delete Expense"
             >
              <DeleteAlert 
               content = "Are you sure ypu want to delete this expense detail..?"
               onDelete ={()=>deleteExpense(openDeleteAlert.data)} />
               </Modal>
         </div>
      </DashboardLayout>
  )
}

export default Expense
