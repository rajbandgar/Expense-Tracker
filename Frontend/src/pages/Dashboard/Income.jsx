import React, { useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import IncomeOverview from '../../components/Income/IncomeOverview'
import axiosInstance from '../../utils/axiosInstances'
import { API_PATHS } from '../../utils/apiPaths'
import { useEffect } from 'react'
import Modal from '../../components/Modal'
import AddIncomeForm from '../../components/Income/AddIncomeForm'
import toast from 'react-hot-toast'
import IncomeList from '../../components/Income/IncomeList'
import DeleteAlert from '../../components/DeleteAlert'
import { useUserAuth } from '../../hooks/useUserAuth'

const Income = () => {
  useUserAuth()

  const [ incomeData, setIncomeData] = useState([])
  const [loading ,setLoading] = useState(false)
  const [openDeleteAlert ,setOpenDeleteAlert] = useState({show:false, 
    data:null,

   })

  const [openAddIncomeModal , setOpenAddIncomeModal] = useState(false)

   //Get all income details
   const fetchIncomeDetails =async() => {
    if (loading) return ;

    setLoading(true);

    try{
      const respose = await axiosInstance.get(`${API_PATHS.INCOME.GET_INCOME}`)

      if(respose.data){
        setIncomeData(respose.data)
      }
    }catch(error){
      console.log("Something went wrong", error )
    }finally{
      setLoading(false)
    }
   }

   //Handle add income
   const handleAddIncome =async (income) => { 
      const {source ,amount,date ,icon} = income;

      //Validation checks
      if(!source.trim){
        toast.error("Source is Required")
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
        await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
          source ,
          amount,
          date,
          icon
        })
        setOpenAddIncomeModal(false)
        toast.success("Income Added Successfully")
        fetchIncomeDetails();
      }catch(error){
        console.error("Error adding income :" ,error.response ?.data?.message || error.message)
      }
   }

    //Delete Income
    const deleteIncome = async (id) => {
      try{
        await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id))
        setOpenDeleteAlert({show:false ,data:null})
        toast.success("Income details deleted successfully")
        fetchIncomeDetails();
      }catch(error){
        console.error("Error deleting income: " ,error.response?.data?.message || error.message)
      }
    }

    //handle dowmload income
    const handleDownloadIncomeDetails = async () =>{
      try {
        const response = await axiosInstance.get(API_PATHS.INCOME.DOWNLOAD_INCOME ,{responseType :"blob"});
        //Create a URL for the blob
  
        const url = window.URL.createObjectURL(new Blob ([response.data]))
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download" ,"income_details.xlsx");
        document.body.appendChild(link)
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url)
        
      }catch(error){
        console.error("Error downloading expense details :" , error)
        toast.error("Failed to download data")
      }
    }


    useEffect (() => {
      fetchIncomeDetails ()

      return()=>{
        
      }
    },[] )
     
  return (
    <DashboardLayout activeMenu="Income">
      <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 gap-6 '>
          <div className=''>
            <IncomeOverview 
              transactions= {incomeData}
              onAddIncome ={()=> setOpenAddIncomeModal(true) } />
          </div>

          <IncomeList 
            transactions ={incomeData}
            onDelete = {(id) => {
              setOpenDeleteAlert({show:true ,data:id});
            }}
            onDownload = {handleDownloadIncomeDetails} />
        </div>

        <Modal 
        isOpen={openAddIncomeModal}
        onClose = {() =>setOpenAddIncomeModal(false) }
        title = "Add Income" >
            
            <AddIncomeForm onAddIncome ={handleAddIncome} />

            </Modal> 

            <Modal 
             isOpen={openDeleteAlert.show}
             onClose={()=>setOpenDeleteAlert({
              show:false ,data:null
             })}
             title="Delete Income"
             >
              <DeleteAlert 
               content = "Are you sure you want to delete this income detail..?"
               onDelete ={()=>deleteIncome(openDeleteAlert.data)} />
               </Modal>
        </div>
        </DashboardLayout>
  )
}

export default Income
