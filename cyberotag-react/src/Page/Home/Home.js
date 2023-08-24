import React from 'react';
import './home.css';
import jwtDecode from 'jwt-decode';
import Sidebar from '../Sidebar/Sidebar';

const Home = () => {
  const userToken = localStorage.getItem('token');
  const data = jwtDecode(userToken);
  const username = data.unique_name;
  const role = data.role;

  return (
    <div className='home'>
      <h2 className='giris'>Merhaba {username} Rolünüz: {role}</h2>
      <Sidebar />
    </div>
  );
};

export default Home;
