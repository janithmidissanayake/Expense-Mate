// import React from 'react'
import { useState,useEffect } from "react";
import { useAuth } from "../context/AuthProvider"
import axios from 'axios'; // Import Axios

import ExpenseForm from "../components/ExpenseForm"
import ExpenseTable from "../components/ExpenseTable"


const Expense = () => {
    const [expenseData, setExpenseData] = useState([]);
    const {user} = useAuth();
    const userId = user?.id;
    console.log("hhhhhhhh"+userId);

    useEffect(() => {
      console.log('useEffect triggered, userId:', userId);  // Check if the useEffect is firing

      if (userId) {
        const fetchExpenseData = async () => {
          try {
            const response = await axios.get(`http://localhost:8080/api/v1/expense-controller/expenses?userId=${userId}`);
            console.log("ooooo"+response.data);
            setExpenseData(response.data);
            
          } catch (error) {
            console.error('Error fetching income data:', error.response?.data || error.message);
          }
        };
        fetchExpenseData();
      }
    }, [userId]);

    
  return (
<div><div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
     <div className="mb-6">
       <h1 className="text-3xl font-bold text-gray-900">Expense Management</h1>
       <p className="mt-2 text-sm text-gray-600">
         Add and manage your expense entries
       </p>
     </div>
     
     <ExpenseForm
    //    onSubmit={handleAddIncome}
    //    initialData={editingIncome}
     />
     
     <ExpenseTable 
       expenseData={expenseData}
       onUpdateExpense={setExpenseData}

    //    onEdit={handleEdit}
    //    onDelete={handleDelete}
     />
   </div></div>  )
}

export default Expense