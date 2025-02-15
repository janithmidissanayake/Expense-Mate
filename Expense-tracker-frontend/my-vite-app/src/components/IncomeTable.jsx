import { useState } from 'react';

import { Pencil, Trash2, Save, X } from 'lucide-react';
import PropTypes from 'prop-types';
import { useAuth } from "../context/AuthProvider";
import axios from 'axios';


const IncomeTable = ({incomeData, onUpdateIncomes}) => {
  const [editingId, setEditingId] = useState(null);
  const [editedIncome, setEditedIncome] = useState({});
  const { user } = useAuth();
  const userId = user?.id;


  const handleEditClick = (income) => {
    setEditingId(income.id);
    setEditedIncome({ ...income });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedIncome({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedIncome(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value
    }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/v1/income-controller/update-income/${editedIncome.id}?userId=${userId}`,
        editedIncome
      );
      
      // Update the list of incomes
      onUpdateIncomes(prevIncomes => 
        prevIncomes.map(income => 
          income.id === editedIncome.id ? response.data : income
        )
      );
      
      // Reset editing state
      setEditingId(null);
      setEditedIncome({});
    } catch (error) {
      console.error("Error updating income:", error.response?.data || error.message);
    }
  };
  console.log(incomeData);
  const handleDelete = async (incomeId) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/v1/income-controller/delete-income/${incomeId}?userId=${userId}`
      );
      
      // Remove the deleted income from the state
      onUpdateIncomes(prevIncomes => 
        prevIncomes.filter(income => income.id !== incomeId)
      );
    } catch (error) {
      console.error("Error deleting income:", error.response?.data || error.message);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {incomeData.map((income) => (
              <tr key={income.id} className="hover:bg-gray-50">
                {editingId === income.id ? (
                  <>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        name="description"
                        value={editedIncome.description}
                        onChange={handleInputChange}
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        name="amount"
                        value={editedIncome.amount}
                        onChange={handleInputChange}
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="date"
                        name="incomeDate"
                        value={editedIncome.incomeDate}
                        onChange={handleInputChange}
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        name="categoryName"
                        value={editedIncome.categoryName}
                        onChange={handleInputChange}
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={handleSave}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap">{income.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${income.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {income.incomeDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">{income.categoryName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(income)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDelete(income.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

IncomeTable.propTypes = {
  incomeData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      description: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      incomeDate: PropTypes.string.isRequired,
      categoryName: PropTypes.string.isRequired,
    })
  ).isRequired,
  onUpdateIncomes: PropTypes.func.isRequired,
};


IncomeTable.propTypes = {
  incomeData: PropTypes.arrayOf(
    PropTypes.shape({
      // id: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      incomeDate: PropTypes.string.isRequired,
      categoryName: PropTypes.string.isRequired,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default IncomeTable
// Compare this snippet from my-vite-app/src/components/IncomeTable.jsx: