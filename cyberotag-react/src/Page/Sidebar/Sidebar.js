import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './sidebar.css';

const Sidebar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      navigate('/');
    } catch (error) {
      console.error('Çıkış yapma işlemi sırasında bir hata oluştu:', error);
    }
  };

  return (
    <div className="sidebar">
      <div className="brand">
        <h2>Admin Paneli</h2>
      </div>
      <ul className="menu">
        <li>
          <Link to="/home">Ana Sayfa</Link>
        </li>
        <li>
                <Link to="/Operation">Operation</Link>
              </li>
              <li>
                <Link to="/Assignment">Görevlendirme</Link>
              </li>
        <li>
          <Link to="/user">Kullanıcılar</Link>
        </li>
        
        <li>
          <span onClick={handleDropdownToggle}>Diğerleri ▼</span>
          {showDropdown && (
            <ul className="dropdown-menu">
              <li>
                <Link to="/Branch">Branch</Link>
              </li>
              <li>
                <Link to="/Channel">Channel</Link>
              </li>
              <li>
                <Link to="/City">City</Link>
              </li>
              <li>
                <Link to="/Customer">Customer</Link>
              </li>
              <li>
                <Link to="/Director">Director</Link>
              </li>
              <li>
                <Link to="/Document">Document</Link>
              </li>
              <li>
                <Link to="/Facility">Facility</Link>
              </li>
              <li>
                <Link to="/GraphicSet">GraphicSet</Link>
              </li>
              <li>
                <Link to="/Operator">Operator</Link>
              </li>
              <li>
                <Link to="/Spending">Spending</Link>
              </li>
              <li>
                <Link to="/SpendingType">SpendingType</Link>
              </li>
              
            </ul>
          )}
        </li>
        <li>
          <span onClick={handleLogout}>Çıkış Yap</span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
