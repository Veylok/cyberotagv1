import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import Login from './Page/Login/Login';
import Home from './Page/Home/Home';
import Operator from './Page/Operator/Operator';
import Branch from './Page/Branch/Branch';
import City from './Page/City/City';
import Director from './Page/Director/Director';
import Customer from './Page/Customer/Customer';
import Channel from './Page/Channel/Channel';
import Document from './Page/Document/Document';
import Facility from './Page/Facility/Facility';
import GraphicSet from './Page/GraphicSet/GraphicSet';
import Operation from './Page/Operation/Operation';
import Spending from './Page/Spending/Spending';
import SpendingType from './Page/SpendingType/SpendingType';
import User from './Page/User/User';
import Assignment from './Page/Assignment/Assignment';
import UserSpending from './Page/UserSpending/UserSpending';


function App() {
  const userToken = localStorage.getItem('token');
  const [decodedToken] = useState(
    userToken ? jwtDecode(userToken) : null
  );

 


  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          {userToken ? (
            <>
              
              {decodedToken.role === 'Admin' && (
                
                <>
                <Route path="/Home" element={<Home />} />
                  <Route path="/Operator" element={<Operator />} />
                  <Route path="/Branch" element={<Branch />} />
                  <Route path="/City" element={<City />} />
                  <Route path="/Director" element={<Director />} />
                  <Route path="/Customer" element={<Customer />} />
                  <Route path="/Channel" element={<Channel />} />
                  <Route path="/Document" element={<Document />} />
                  <Route path="/Facility" element={<Facility />} />
                  <Route path="/GraphicSet" element={<GraphicSet />} />
                  <Route path="/Operation" element={<Operation />} />
                  <Route path="/Assignment" element={<Assignment />} />
                  <Route path="/Spending" element={<Spending />} />
                  <Route path="/SpendingType" element={<SpendingType />} />
                  <Route path="/User" element={<User />} />
                  <Route path="/UserSpending" element={<UserSpending />} />
                </>
              )}
              {decodedToken.role === 'User' && (
                <Route path="/UserSpending" element={<UserSpending />} />
              )}
            </>
          ) : (
            <Route path="/*" element={<Navigate to="/" />} />
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
