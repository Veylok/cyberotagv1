import React, { useState, useEffect } from 'react';
import './branch.css';
import Sidebar from '../Sidebar/Sidebar';
import ApiService from '../../services/apiService'; // ApiService import edildi
import Toast from '../../Common/Toast';

const Branch = () => {
  const [branches, setBranches] = useState([]);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const [newBranch, setNewBranch] = useState({
    branchname: '',
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const branches = await ApiService.get('/api/Branch'); // ApiService ile API çağrısı
      setBranches(branches);
    } catch (error) {
      console.error('Şube verilerini alma hatası:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewBranch({ ...newBranch, [name]: value });
  };
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

  const addBranch = async () => {
    try {
      await ApiService.post('/api/Branch', newBranch);
      setNewBranch({
        branchname: '',
      });
      fetchBranches();
      showSuccessToast('Şube başarıyla eklendi!');
    } catch (error) {
      console.error('Şube ekleme hatası:', error);
      showErrorToast('Şube eklenirken bir hata oluştu.');
    }
  };

  const deleteBranch = async (branchId) => {
    try {
      await ApiService.delete(`/api/Branch/${branchId}`);
      fetchBranches();
      showSuccessToast('Şube başarıyla silindi.');
    } catch (error) {
      console.error('Şube silme hatası:', error);
      showErrorToast('Şube silinirken bir hata oluştu.');
    }
  };

  const updateBranch = async (branchId, updatedBranch) => {
    try {
      await ApiService.put(`/api/Branch/${branchId}`, updatedBranch);
      setNewBranch({
        branchname: '',
      });
      setIsEditMode(false);
      fetchBranches();
      showSuccessToast('Şube başarıyla güncellendi.');
    } catch (error) {
      console.error('Şube güncelleme hatası:', error);
      showErrorToast('Şube güncellenirken bir hata oluştu.');
    }
  };

  const handleUpdate = (branchId) => {
    const branchToUpdate = branches.find((branch) => branch.branchid === branchId);
    setNewBranch(branchToUpdate);
    setIsEditMode(true);
  };

  const handleAddOrUpdate = () => {
    if (isEditMode) {
      updateBranch(newBranch.branchid, newBranch);
    } else {
      addBranch();
    }
  };

  return (
    <div className="container">
      <Sidebar/>
      <div className="branch-list">
        <h2>Şubeler</h2>
        {branches.length === 0 ? (
          <p>Şubeler yükleniyor...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Şube Adı</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {branches.map((branch) => (
                <tr key={branch.branchid}>
                  <td>{branch.branchname}</td>
                  <td>
                    <button onClick={() => deleteBranch(branch.branchid)}>Sil</button>
                    <button onClick={() => handleUpdate(branch.branchid)}>Güncelle</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="branch-form">
        <h2>{isEditMode ? 'Şube Güncelle' : 'Yeni Şube Ekle'}</h2>
        <div>
          <input
            type="text"
            name="branchname"
            value={newBranch.branchname}
            onChange={handleInputChange}
            placeholder="Şube Adı"
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

export default Branch;
