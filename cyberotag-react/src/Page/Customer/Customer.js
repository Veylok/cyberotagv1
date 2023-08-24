import React, { useState, useEffect } from 'react';
import './customer.css';
import Sidebar from '../Sidebar/Sidebar';
import ApiService from '../../services/apiService'; // ApiService import edildi
import Toast from '../../Common/Toast';

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const [newCustomer, setNewCustomer] = useState({
    customername: '',
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);
  const showToast = (message, type) => {
    setIsToastVisible(true);
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setIsToastVisible(false);
      setToastMessage('');
      setToastType('');
    }, 3000);
  };

  const showSuccessToast = (message) => {
    showToast(message, 'success');
  };

  const showErrorToast = (message) => {
    showToast(message, 'error');
  };

  const fetchCustomers = async () => {
    try {
      const customers = await ApiService.get('/api/Customer'); // ApiService ile API çağrısı
      setCustomers(customers);
    } catch (error) {
      console.error('Müşteri verilerini alma hatası:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewCustomer({ ...newCustomer, [name]: value });
  };

  const addCustomer = async () => {
    try {
      await ApiService.post('/api/Customer', newCustomer); // ApiService ile API çağrısı
      setNewCustomer({
        customername: '',
      });
      fetchCustomers();
      showSuccessToast('Müşteri başarıyla eklendi!');
    } catch (error) {
      console.error('Müşteri ekleme hatası:', error);
      showErrorToast('Müşteri eklenirken bir hata oluştu!');
    }
  };

  const deleteCustomer = async (customerId) => {
    try {
      await ApiService.delete(`/api/Customer/${customerId}`); // ApiService ile API çağrısı
      fetchCustomers();
      showSuccessToast('Müşteri başarıyla silindi!');
    } catch (error) {
      console.error('Müşteri silme hatası:', error);
      showErrorToast('Müşteri silinirken bir hata oluştu!');
    }
  };

  const updateCustomer = async (customerId, updatedCustomer) => {
    try {
      await ApiService.put(`/api/Customer/${customerId}`, updatedCustomer); // ApiService ile API çağrısı
      setNewCustomer({
        customername: '',
      });
      setIsEditMode(false);
      fetchCustomers();
      showSuccessToast('Müşteri başarıyla güncellendi!');
    } catch (error) {
      console.error('Müşteri güncelleme hatası:', error);
      showErrorToast('Müşteri güncellenirken bir hata oluştu!');
    }
  };

  const handleUpdate = (customerId) => {
    const customerToUpdate = customers.find((customer) => customer.customerid === customerId);
    setNewCustomer(customerToUpdate);
    setIsEditMode(true);
  };

  const handleAddOrUpdate = () => {
    if (isEditMode) {
      updateCustomer(newCustomer.customerid, newCustomer);
    } else {
      addCustomer();
    }
  };
  return (
    <div className="container">
      <Sidebar/>
      <div className="customer-list">
        <h2>Müşteriler</h2>
        {customers.length === 0 ? (
          <p>Müşteriler yükleniyor...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Müşteri Adı</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.customerid}>
                  <td>{customer.customername}</td>
                  <td>
                    <button onClick={() => deleteCustomer(customer.customerid)}>Sil</button>
                    <button onClick={() => handleUpdate(customer.customerid)}>Güncelle</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="customer-form">
        <h2>{isEditMode ? 'Müşteri Güncelle' : 'Yeni Müşteri Ekle'}</h2>
        <div>
          <input
            type="text"
            name="customername"
            value={newCustomer.customername}
            onChange={handleInputChange}
            placeholder="Müşteri Adı"
          />
          <button onClick={handleAddOrUpdate}>
            {isEditMode ? 'Güncelle' : 'Ekle'}
          </button>
        </div>
      </div>
      {isToastVisible && (
        <Toast type={toastType}>
          {toastMessage}
        </Toast>
      )}
    </div>
  );
};

export default Customer;
