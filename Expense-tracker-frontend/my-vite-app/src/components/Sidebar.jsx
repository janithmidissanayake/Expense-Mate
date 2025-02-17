import { useState } from 'react';
import { useAuth } from '../context/AuthProvider'; // Adjust this path as necessary
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

import {
    LayoutDashboard,
    PieChart,
    Wallet,
    Settings,
    Users,
    ChevronLeft,
    Plus,
    Tags
  } from 'lucide-react';
const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { logOut,user } = useAuth(); // Access logOut function from AuthProvider
    const navigate = useNavigate(); // Initialize navigate
  
    const handleLogout = () => {
      logOut(navigate); // Call logOut with navigate
    };

  const menuItems = [

    { icon: LayoutDashboard, label: 'Dashboard', badge: null,action: () => navigate('/dashboard'),allowedRoles: ['ADMIN', 'USER'] },
    { icon: PieChart, label: 'Analytics', badge: null,action: () => navigate('/hello'),allowedRoles: ['ADMIN', 'USER'] },
    { icon: Tags, label: 'Categories', badge: null,action: () => navigate('/income'),allowedRoles: ['ADMIN', 'USER'] },
    { icon: Wallet, label: 'Budgets', badge: '3',action: () => navigate('/expense') ,allowedRoles: ['ADMIN', 'USER']},
    { icon: Users, label: 'Split Expenses', badge: null ,action: () => navigate('/category'),allowedRoles: ['ADMIN']},
    { icon: Settings, label: 'logout', badge: null,action: handleLogout,allowedRoles: ['ADMIN', 'USER'] },
  ];
    console.log("User Data:", user);
    console.log("User Role:", user?.role);

    return (
    <div className={`bg-white border-r border-gray-200 h-screen transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
    {/* Header */}
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      {!isCollapsed && (
        <div className="flex items-center gap-2">
          <Wallet className="h-8 w-8 text-blue-600" />
          <span className="font-bold text-xl">ExpenseTrack</span>
        </div>
      )}
      {isCollapsed && <Wallet className="h-8 w-8 text-blue-600 mx-auto" />}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="p-1.5 rounded-lg hover:bg-gray-100"
      >
        <ChevronLeft className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
      </button>
    </div>

    {/* Add Expense Button */}
    <div className="p-4">
      <button className={`bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all w-full p-2 flex items-center justify-center gap-2 ${isCollapsed ? 'px-2' : 'px-4'}`}>
        <Plus className="h-5 w-5" />
        {!isCollapsed && <span>Add Expense</span>}
      </button>
    </div>

    {/* Navigation */}
        {/* Navigation */}
        <nav className="mt-4">
            {menuItems
                .filter((item) => item.allowedRoles.includes(user?.role)) // Uncomment this line
                .map((item) => (
                    <button
                        key={item.label}
                        className={`w-full flex items-center text-gray-600 hover:bg-gray-50 transition-all p-4 gap-4 ${isCollapsed ? 'justify-center' : ''}`}
                        onClick={item.action}
                    >
                        <item.icon className="h-5 w-5" />
                        {!isCollapsed && (
                            <div className="flex flex-1 items-center justify-between">
                                <span>{item.label}</span>
                                {item.badge && (
                                    <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
                                )}
                            </div>
                        )}
                    </button>
                ))}
        </nav>

    {/* User Profile */}
    <div className="absolute bottom-0 w-full border-t border-gray-200">
      <button className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 ${isCollapsed ? 'justify-center' : ''}`}>
        <img
          src="/api/placeholder/32/32"
          alt="User"
          className="h-8 w-8 rounded-full"
        />
        {!isCollapsed && (
          <div className="flex flex-1 items-center justify-between">
            <div className="text-left">
              <p className="text-sm font-medium text-gray-700">John Doe</p>
              <p className="text-xs text-gray-500">john@example.com</p>
            </div>
          </div>
        )}
      </button>
    </div>
  </div>  )
}

export default Sidebar