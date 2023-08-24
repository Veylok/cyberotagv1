import React, { useState, useEffect } from 'react';
import ApiService from '../../services/apiService';
import './spendingtype.css';
import Sidebar from '../Sidebar/Sidebar';
import Toast from '../../Common/Toast';

const Spendingtype = () => {
  const [spendingtypes, setSpendingtypes] = useState([]);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const [newSpendingtype, setNewSpendingtype] = useState({
    spendingtypename: '',
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchSpendingtypes();
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

  const fetchSpendingtypes = async () => {
    try {
      const response = await ApiService.get('/api/Spendingtype');
      setSpendingtypes(response);
    } catch (error) {
      console.error('Harcama Türü verilerini alma hatası:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewSpendingtype({ ...newSpendingtype, [name]: value });
  };

  const addSpendingtype = async () => {
    try {
      await ApiService.post('/api/Spendingtype', newSpendingtype);
      setNewSpendingtype({ spendingtypename: '' });
      fetchSpendingtypes();
      showSuccessToast('Harcama Türü başarıyla eklendi!');
    } catch (error) {
      console.error('Harcama Türü ekleme hatası:', error);
      showErrorToast('Harcama Türü eklenirken bir hata oluştu!');
    }
  };

  const deleteSpendingtype = async (spendingtypeId) => {
    try {
      await ApiService.delete(`/api/Spendingtype/${spendingtypeId}`);
      fetchSpendingtypes();
      showSuccessToast('Harcama Türü başarıyla silindi!');
    } catch (error) {
      console.error('Harcama Türü silme hatası:', error);
      showErrorToast('Harcama Türü silinrken bir hata oluştu!');
    }
  };

  const updateSpendingtype = async (spendingtypeId, updatedSpendingtype) => {
    try {
      await ApiService.put(`/api/Spendingtype/${spendingtypeId}`, updatedSpendingtype);
      setNewSpendingtype({ spendingtypename: '' });
      setIsEditMode(false);
      fetchSpendingtypes();
      showSuccessToast('Harcama Türü başarıyla silindi!');
    } catch (error) {
      console.error('Harcama Türü güncelleme hatası:', error);
      showErrorToast('Harcama Türü güncellenirken bir hata oluştu!');
    }
  };

  const handleUpdate = (spendingtypeId) => {
    const spendingtypeToUpdate = spendingtypes.find((spendingtype) => spendingtype.spendingtypeid === spendingtypeId);
    setNewSpendingtype(spendingtypeToUpdate);
    setIsEditMode(true);
  };

  const handleAddOrUpdate = () => {
    if (isEditMode) {
      updateSpendingtype(newSpendingtype.spendingtypeid, newSpendingtype);
    } else {
      addSpendingtype();
    }
  };

  return ( 
    <div className="container">
      <Sidebar/>
      <div className="spendingtype-list">
        <h2>Harcama Türleri</h2>
        {spendingtypes.length === 0 ? (
          <p>Harcama Türleri yükleniyor...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Harcama Türü ID</th>
                <th>Harcama Türü Adı</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {spendingtypes.map((spendingtype) => (
                <tr key={spendingtype.spendingtypeid}>
                  <td>{spendingtype.spendingtypeid}</td>
                  <td>{spendingtype.spendingtypename}</td>
                  <td>
                    <button onClick={() => deleteSpendingtype(spendingtype.spendingtypeid)}>Sil</button>
                    <button onClick={() => handleUpdate(spendingtype.spendingtypeid)}>Güncelle</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="spendingtype-form">
        <h2>{isEditMode ? 'Harcama Türü Güncelle' : 'Yeni Harcama Türü Ekle'}</h2>
        <div>
          <input
            type="text"
            name="spendingtypename"
            value={newSpendingtype.spendingtypename}
            onChange={handleInputChange}
            placeholder="Harcama Türü Adı"
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

export default Spendingtype;
