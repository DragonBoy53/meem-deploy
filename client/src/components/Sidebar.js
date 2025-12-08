import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-900 p-4">
      <h2 className="text-white text-lg mb-4">Admin Dashboard</h2>
      <ul className="space-y-2">
        <li><Link to="/admin/products" className="text-white">Products</Link></li>
        <li><Link to="/admin/orders" className="text-white">Orders</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
