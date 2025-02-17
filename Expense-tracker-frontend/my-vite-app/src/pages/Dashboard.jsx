import  { useState ,useEffect} from 'react';
import { useAuth } from "../context/AuthProvider"
import axios from 'axios'; // Import Axios

import { Card, Col, Row, Statistic } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined, WalletOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const { user } = useAuth(); // Access the user data from AuthContext
    const userId = user?.id;
    console.log("hhhhhhhh"+userId);
    console.log("hhhhhhhhttttt"+user);
    
  const [summaryData , setSummaryData] = useState({
    totalIncome:0,
    totalExpense:0,
    balance:0
  });

  const [incomeCategoryData, setIncomeCategoryData] = useState([]);
  const [expenseCategoryData, setExpenseCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]); // State for graph data

  useEffect(() => {
    if (userId) {  // Only fetch data if userId exists
      const fetchIncomeCategoryData = async () => {
        try {
          const response = await axios.get(`/api/v1/summary-controller/category-IncomeSummary?userId=${userId}`);
          console.log("incomeCategoryData:", response.data);
          setIncomeCategoryData(response.data);
          // console.log("incomeCategoryData"+response.data);
          console.log("incomeCategoryData"+incomeCategoryData);
        } catch (error) {
          console.error('Error fetching income category data:', error.response?.data || error.message);
        }
      };
      fetchIncomeCategoryData();
    }
  }, [userId]);  // Re-run the effect whenever userId or incomeCategoryData changes

  useEffect(() => {
    if (userId) {  // Only fetch data if userId exists
      const fetchExpenseCategoryData = async () => {
        try {
          const response = await axios.get(`/api/v1/summary-controller/category-ExpenseSummary?userId=${userId}`);
          setExpenseCategoryData(response.data);
        } catch (error) {
          console.error('Error fetching expense category data:', error.response?.data || error.message);
        }
      };
      fetchExpenseCategoryData();
    }
  }, [userId]);


    

    useEffect(() => {
      if (userId) {  // Only fetch data if userId exists
        const fetchSummaryData = async () => {
          try {
            const response = await axios.get(`/api/v1/summary-controller/summary?userId=${userId}`);
            setSummaryData(response.data);
          } catch (error) {
            console.error('Error fetching summary data:', error.response?.data || error.message);
          }
        };
        fetchSummaryData();
      }
    }, [userId]);  // Re-run the effect whenever userId changes
    
    useEffect(() => {
      if (userId) {  // Only fetch data if userId exists
        const fetchMonthlyData = async () => {
          try {
            const response = await axios.get(`api/v1/summary-controller/monthly-summary?userId=${userId}`);
            setMonthlyData(response.data);
          } catch (error) {
            console.error('Error fetching monthly data:', error);
          }
        };
        fetchMonthlyData();
      }
    }, [userId]);
  
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF4560', '#775DD0'];
 
   
  return (
    <div>
        <div>
        <Row gutter={16}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Total Income"
              value={summaryData.totalIncome}
              precision={2}
              prefix={<ArrowUpOutlined className="text-green-500" />}
              suffix="$"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Total Expenses"
              value={summaryData.totalExpense}
              precision={2}
              prefix={<ArrowDownOutlined className="text-red-500" />}
              suffix="$"
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Current Balance"
              value={summaryData.balance}
              precision={2}
              prefix={<WalletOutlined className="text-blue-500" />}
              suffix="$"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

        </div>

    <div className="mt-4">
  <Row gutter={16}>
    <Col xs={24} md={12}>
      <Card title="Income Category Breakdown">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={incomeCategoryData}
              dataKey="percentage"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#3f8600"
              label
            >
              {incomeCategoryData.map((entry, index) => (
                <Cell key={`income-cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </Col>
    <Col xs={24} md={12}>
      <Card title="Expense Category Breakdown">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={expenseCategoryData}
              dataKey="percentage"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#cf1322"
              label
            >
              {expenseCategoryData.map((entry, index) => (
                <Cell key={`expense-cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </Col>
  </Row>
</div>


        <div className='mt-4'>
        <Card title="Financial Overview">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#3f8600" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="expense" 
                stroke="#cf1322" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="balance" 
                stroke="#1890ff" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
        </div>
    </div>
  )
}

export default Dashboard