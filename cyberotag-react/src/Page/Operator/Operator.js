import React, { useState, useEffect } from 'react';
import ApiService from '../../services/apiService';
import './operator.css'; 
import Sidebar from '../Sidebar/Sidebar';
import Toast from '../../Common/Toast';
const Operator = () => {
  const [operators, setOperators] = useState([]);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const [newOperator, setNewOperator] = useState({
    operatorname: '',
    operatorsurname: '',
    operatorphonenumber: '',
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchOperators();
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

  const fetchOperators = async () => {
    try {
      const response = await ApiService.get('/api/Operator');
      setOperators(response);
    } catch (error) {
      console.error('Operatörleri alma hatası:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewOperator({ ...newOperator, [name]: value });
  };

  const addOperator = async () => {
    try {
      await ApiService.post('/api/Operator', newOperator);
      setNewOperator({
        operatorname: '',
        operatorsurname: '',
        operatorphonenumber: '',
      });
      fetchOperators();
      showSuccessToast('Operatör başarıyla eklendi!');
    } catch (error) {
      console.error('Operatör ekleme hatası:', error);
      showErrorToast('Operatör eklenirken bir hata oluştu!');
    }
  };

  const deleteOperator = async (operatorId) => {
    try {
      await ApiService.delete(`/api/Operator/${operatorId}`);
      fetchOperators();
      showSuccessToast('Operatör başarıyla silindi!');
    } catch (error) {
      console.error('Operatör silme hatası:', error);
      showErrorToast('Operatör silinirken bir hata oluştu!');
    }
  };

  const updateOperator = async (operatorId, updatedOperator) => {
    try {
      await ApiService.put(`/Operator/${operatorId}`, updatedOperator);
      setNewOperator({
        operatorname: '',
        operatorsurname: '',
        operatorphonenumber: '',
      });
      setIsEditMode(false);
      fetchOperators();
      showSuccessToast('Operatör başarıyla güncellendi!');
    } catch (error) {
      console.error('Operatör güncelleme hatası:', error);
      showErrorToast('Operatör güncellenirken bir hata oluştu!');
    }
  };

  const handleUpdate = (operatorId) => {
    const operatorToUpdate = operators.find((operator) => operator.operatorid === operatorId);
    setNewOperator(operatorToUpdate);
    setIsEditMode(true);
  };

  const handleAddOrUpdate = () => {
    if (isEditMode) {
      updateOperator(newOperator.operatorid, newOperator);
    } else {
      addOperator();
    }
  };

  return (
    <div className="container">
      <div className="operator-list">
      <Sidebar/>
        <h2>Operatörler</h2>
        {operators.length === 0 ? (
          <p>Kullanıcılar yükleniyor...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Ad</th>
                <th>Soyad</th>
                <th>Telefon Numarası</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {operators.map((operator) => (
                <tr key={operator.operatorid}>
                  <td>{operator.operatorname}</td>
                  <td>{operator.operatorsurname}</td>
                  <td>{operator.operatorphonenumber}</td>
                  <td>
                    <button onClick={() => deleteOperator(operator.operatorid)}>Sil</button>
                    <button onClick={() => handleUpdate(operator.operatorid)}>Güncelle</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="operator-form">
        <h2>{isEditMode ? 'Operatörü Güncelle' : 'Yeni Operatör Ekle'}</h2>
        <div>
          <input
            type="text"
            name="operatorname"
            value={newOperator.operatorname}
            onChange={handleInputChange}
            placeholder="Ad"
          />
          <input
            type="text"
            name="operatorsurname"
            value={newOperator.operatorsurname}
            onChange={handleInputChange}
            placeholder="Soyad"
          />
          <input
            type="text"
            name="operatorphonenumber"
            value={newOperator.operatorphonenumber}
            onChange={handleInputChange}
            placeholder="Telefon Numarası"
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

export default Operator;
