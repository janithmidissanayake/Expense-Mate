import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    // Using flex to create a side-by-side layout
    <div className="flex  bg-gray-50">
      {/* Sidebar container with fixed width */}
      <div className=" bg-white">
        <Sidebar />
      </div>
      
      {/* Content area with Outlet */}
      <div className="flex-1 p-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;