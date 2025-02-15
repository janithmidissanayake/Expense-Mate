import  { useState } from 'react';
import { useAuth } from "../context/AuthProvider";
import axios from 'axios'; // Import Axios

const CategoryPage = () => {
    const { user } = useAuth();
      const userId = user?.id;
    const [formData, setFormData] = useState({
    name: '',
    type: 'EXPENSE'
    });
    
    const [loading, setLoading] = useState(false);// Add state for form data
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
        ...prevState,
        [name]: value
    }));
    }

    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    if(userId){
        try {
            const response = await axios.post(`http://localhost:8080/api/v1/category-controller/createCategory?userId=${userId}`, formData);
            console.log('Category created:', response.data);
            setMessage({ text: 'Category created successfully', type: 'success' });
            setFormData({ name: '', type: 'EXPENSE' });
            
        } catch (error) {
            console.error('Error creating category:', error.response?.data || error.message);
            setMessage({ text: 'Error creating category', type: 'error' });
            
        }finally{
            setLoading(false);
        }
    
    }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Add New Category</h2>
      
      {message.text && (
        <div className={`p-3 mb-4 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label 
            htmlFor="name" 
            className="block text-sm font-medium mb-1"
          >
            Category Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter category name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Category Type
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="type"
                value="EXPENSE"
                checked={formData.type === 'EXPENSE'}
                onChange={handleInputChange}
                className="h-4 w-4"
              />
              <span>Expense</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="type"
                value="INCOME"
                checked={formData.type === 'INCOME'}
                onChange={handleInputChange}
                className="h-4 w-4"
              />
              <span>Income</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded text-white font-medium 
            ${loading 
              ? 'bg-blue-300 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600'
            }`}
        >
          {loading ? 'Creating...' : 'Create Category'}
        </button>
      </form>
    </div>
  </div> 
     
        
  )
}

export default CategoryPage;