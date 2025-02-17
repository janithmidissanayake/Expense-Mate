 import { useState,useEffect } from "react";
 import { useAuth } from "../context/AuthProvider"
import IncomeForm from "../components/IncomeForm"
import IncomeTable from "../components/IncomeTable"
import axios from 'axios'; // Import Axios

 
 const Income = () => {
    const [incomeData, setIncomeData] = useState([]);

    const {user} = useAuth();
    const userId = user?.id;
    console.log("hhhhhhhh"+userId);

    useEffect(() => {
      console.log('useEffect triggered, userId:', userId);  // Check if the useEffect is firing

      if (userId) {
        const fetchIncomeData = async () => {
          try {
            const response = await axios.get(`/api/v1/income-controller/incomes?userId=${userId}`);
            console.log("ooooo"+response.data);
            setIncomeData(response.data);
            
          } catch (error) {
            console.error('Error fetching income data:', error.response?.data || error.message);
          }
        };
        fetchIncomeData();
      }
    }, [userId]);

    

    
   return (
     <div><div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
     <div className="mb-6">
       <h1 className="text-3xl font-bold text-gray-900">Income Management</h1>
       <p className="mt-2 text-sm text-gray-600">
         Add and manage your income entries
       </p>
     </div>
     
     <IncomeForm 
    //  initialData={editingIncome} onSubmit={handleUpdateIncome}
   
     />
     
     <IncomeTable 
       incomeData={incomeData}
       onUpdateIncomes={setIncomeData}

     
     />
   </div></div>
   )
 }
 
 export default Income