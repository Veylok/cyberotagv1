import React, { useState, useEffect } from 'react';
import ApiService from '../../services/apiService';
import './spending.css';
import Sidebar from '../Sidebar/Sidebar';
import Toast from '../../Common/Toast';
const Spending = () => {
  const [spendings, setSpendings] = useState([]);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const [spendingTypes, setSpendingTypes] = useState([]);
  const [operators, setOperators] = useState([]);
  const [operations, setOperations] = useState([]);
  const [newSpending, setNewSpending] = useState({
    operationid: null,
    spendingtypeid: null,
    spendingamount: '',
    spendingdate: '',
    operatorid: null,
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchSpendings();
    fetchSpendingTypes();
    fetchOperators();
    fetchOperations();
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

  const fetchSpendingTypes = async () => {
    try {
      const response = await ApiService.get('/api/SpendingType');
      setSpendingTypes(response);
    } catch (error) {
      console.error('Harcama Türleri verilerini alma hatası:', error);
    }
  };

  const fetchSpendings = async () => {
    try {
      const response = await ApiService.get('/api/Spending');
      setSpendings(response);
    } catch (error) {
      console.error('Harcama verilerini alma hatası:', error);
    }
  };

  const fetchOperators = async () => {
    try {
      const response = await ApiService.get('/api/Operator');
      setOperators(response);
    } catch (error) {
      console.error('Operatör verilerini alma hatası:', error);
    }
  };

  const fetchOperations = async () => {
    try {
      const response = await ApiService.get('/api/Operation');
      setOperations(response);
    } catch (error) {
      console.error('Operasyon verilerini alma hatası:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewSpending({ ...newSpending, [name]: value });
  };

  const addSpending = async () => {
    try {
      await ApiService.post('/api/Spending', newSpending);
      setNewSpending({
        operationid: null,
        spendingtypeid: null,
        spendingamount: '',
        spendingdate: '',
        operatorid: null,
      });
      fetchSpendings();
      showSuccessToast('Harcama başarıyla eklendi!');
    } catch (error) {
      console.error('Harcama ekleme hatası:', error);
      showErrorToast('Harcama eklenirken bir hata oluştu!');
    }
  };

  const deleteSpending = async (spendingId) => {
    try {
      await ApiService.delete(`/api/Spending/${spendingId}`);
      fetchSpendings();
      showSuccessToast('Harcama başarıyla silindi!');
    } catch (error) {
      console.error('Harcama silme hatası:', error);
      showErrorToast('Harcama silinirken bir hata oluştu!');
    }
  };

  const updateSpending = async (spendingId, updatedSpending) => {
    try {
      await ApiService.put(`/api/Spending/${spendingId}`, updatedSpending);
      setNewSpending({
        operationid: null,
        spendingtypeid: null,
        spendingamount: '',
        spendingdate: '',
        operatorid: null,
      });
      setIsEditMode(false);
      fetchSpendings();
      showSuccessToast('Harcama başarıyla güncellendi!');
    } catch (error) {
      console.error('Harcama güncelleme hatası:', error);
      showErrorToast('Harcama güncellenirken bir hata oluştu!');
    }
  };

  const handleUpdate = (spendingId) => {
    const spendingToUpdate = spendings.find((spending) => spending.spendingid === spendingId);
    setNewSpending(spendingToUpdate);
    setIsEditMode(true);
  };

  const handleAddOrUpdate = () => {
    if (isEditMode) {
      updateSpending(newSpending.spendingid, newSpending);
    } else {
      addSpending();
    }
  };

  return (
    <div className="container">
      <Sidebar />
      <div className="spending-list">
        <h2>Harcamalar</h2>
        {spendings.length === 0 ? (
          <p>Harcamalar yükleniyor...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Harcama ID</th>
                <th>Operasyon ID</th>
                <th>Harcama Türü ID</th>
                <th>Harcama Tutarı</th>
                <th>Harcama Tarihi</th>
                <th>Operatör ID</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {spendings.map((spending) => (
                <tr key={spending.spendingid}>
                  <td>{spending.spendingid}</td>
                  <td>{spending.operationid}</td>
                  <td>
                  {spendingTypes.find((spendingType)=> spendingType.spendingtypeid === spending.spendingtypeid)?.spendingtypename || '-'}
                  </td>
              <td>{spending.spendingamount}</td>
                  <td>{spending.spendingdate}</td>
                  <td>
        
        {operators.find((operator) => operator.operatorid === spending.operatorid)?.operatorname || '-'}
      </td>
                  <td>
                    <button onClick={() => deleteSpending(spending.spendingid)}>Sil</button>
                    <button onClick={() => handleUpdate(spending.spendingid)}>Güncelle</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="spending-form">
        <h2>{isEditMode ? 'Harcama Güncelle' : 'Yeni Harcama Ekle'}</h2>
        <div>
          <select
            name="operationid"
            value={newSpending.operationid || ''}
            onChange={handleInputChange}
          >
            <option value="">Operasyon Seçin</option>
            {operations.map((operation) => (
              <option key={operation.operationid} value={operation.operationid}>
                {operation.operationid}
              </option>
            ))}
          </select>
          <select
            name="spendingtypeid"
            value={newSpending.spendingtypeid || ''}
            onChange={handleInputChange}
          >
            <option value="">Harcama Türü Seçin</option>
            {spendingTypes.map((type) => (
              <option key={type.spendingtypeid} value={type.spendingtypeid}>
                {type.spendingtypename}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="spendingamount"
            value={newSpending.spendingamount}
            onChange={handleInputChange}
            placeholder="Harcama Tutarı"
          />
          <input
            type="date"
            name="spendingdate"
            value={newSpending.spendingdate}
            onChange={handleInputChange}
          />
          <select
            name="operatorid"
            value={newSpending.operatorid || ''}
            onChange={handleInputChange}
          >
            <option value="">Operatör Seçin</option>
            {operators.map((operator) => (
              <option key={operator.operatorid} value={operator.operatorid}>
                {operator.operatorname}
              </option>
            ))}
          </select>
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

export default Spending;
