import { useState,useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { useAuth } from "../context/AuthProvider";
import axios from 'axios';

const IncomeForm = () => {
  const { user } = useAuth();
  const userId = user?.id;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: 0,
    expenseDate: "",
    categoryName: "",
  });
  const[categories,setCategories]=useState([]);

  useEffect(() => {
    console.log('useEffect triggered, userId:', userId);  // Check if the useEffect is firing

    if (userId) {
      const fetchCategoryForExpense = async () => {
        try {
          const response = await axios.get(`/api/v1/category-controller/expense-categories?userId=${userId}`);
          console.log("Expeseeeee"+response.data);
          setCategories(response.data);
          
        } catch (error) {
          console.error('Error fetching income data:', error.response?.data || error.message);
        }
      };
      fetchCategoryForExpense();
    }
  }, [userId]);

  const handleInChange = (e) => {
    const { name, value } = e.target; // Use name to identify the field
    setFormData({
      ...formData,
      [name]: value, // Update the specific field
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    if (userId) {
      console.log("userId", userId);
      const selectedCategory = categories.find((category) => category.name === formData.categoryName);
      if (!selectedCategory) {
        console.error("Invalid category selected");
        return;
      }
      try {
        const payload = {
          ...formData,
          categoryId: selectedCategory.id,
        }
        delete payload.categoryName; // Remove category name from payload

        const response = await axios.post(
          `/api/v1/expense-controller/createExpense?userId=${userId}`,
          payload
        );
        console.log("Income successfully created:", response.data);
        // Reset form
        setFormData({
          description: "",
          amount: 0,
          incomeDate: "",
          category: "",
        });
      } catch (error) {
        console.error("Error creating income:", error.response?.data || error.message);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title" // Add name attribute
              value={formData.title}
              onChange={handleInChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              name="description" // Add name attribute
              value={formData.description}
              onChange={handleInChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              name="amount" // Add name attribute
              value={formData.amount}
              onChange={handleInChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="expenseDate" // Add name attribute
              value={formData.expenseDate}
              onChange={handleInChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="categoryName" // Add name attribute
              value={formData.categoryName}
              onChange={handleInChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
              
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Add Income
        </button>
      </form>
    </div>
  );
};

export default IncomeForm;
