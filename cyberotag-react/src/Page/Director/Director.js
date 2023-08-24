import React, { useState, useEffect } from 'react';
import ApiService from '../../services/apiService';
import './director.css';
import Sidebar from '../Sidebar/Sidebar';
import Toast from '../../Common/Toast';

const Director = () => {
  const [directors, setDirectors] = useState([]);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const [newDirector, setNewDirector] = useState({
    directorname: '',
    directorsurname: '',
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchDirectors();
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

  const fetchDirectors = async () => {
    try {
      const response = await ApiService.get('/api/Director');
      setDirectors(response);
    } catch (error) {
      console.error('Yönetmen verilerini alma hatası:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewDirector({ ...newDirector, [name]: value });
  };

  const addDirector = async () => {
    try {
      await ApiService.post('/api/Director', newDirector);
      setNewDirector({
        directorname: '',
        directorsurname: '',
      });
      fetchDirectors();
      showSuccessToast('Yönetmen başarıyla eklendi!');
    } catch (error) {
      console.error('Yönetmen ekleme hatası:', error);
      showErrorToast('Yönetmen eklenirken bir hata oluştu!');
    }
  };

  const deleteDirector = async (directorId) => {
    try {
      await ApiService.delete(`/api/Director/${directorId}`);
      fetchDirectors();
      showSuccessToast('Yönetmen başarıyla silindi!');
    } catch (error) {
      console.error('Yönetmen silme hatası:', error);
      showErrorToast('Yönetmen silinirken bir hata oluştu!');
    }
  };

  const updateDirector = async (directorId, updatedDirector) => {
    try {
      await ApiService.put(`/api/Director/${directorId}`, updatedDirector);
      setNewDirector({
        directorname: '',
        directorsurname: '',
      });
      setIsEditMode(false);
      fetchDirectors();
      showSuccessToast('Yönetmen başarıyla güncellendi!');
    } catch (error) {
      console.error('Yönetmen güncelleme hatası:', error);
      showErrorToast('Yönetmen güncellenirken bir hata oluştu!');
    }
  };

  const handleUpdate = (directorId) => {
    const directorToUpdate = directors.find((director) => director.directorid === directorId);
    setNewDirector(directorToUpdate);
    setIsEditMode(true);
  };

  const handleAddOrUpdate = () => {
    if (isEditMode) {
      updateDirector(newDirector.directorid, newDirector);
    } else {
      addDirector();
    }
  };

  return (
    <div className="container">
      <Sidebar/>
      <div className="director-list">
        <h2>Yönetmenler</h2>
        {directors.length === 0 ? (
          <p>Yönetmenler yükleniyor...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Yönetmen Adı</th>
                <th>Yönetmen Soyadı</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {directors.map((director) => (
                <tr key={director.directorid}>
                  <td>{director.directorname}</td>
                  <td>{director.directorsurname}</td>
                  <td>
                    <button onClick={() => deleteDirector(director.directorid)}>Sil</button>
                    <button onClick={() => handleUpdate(director.directorid)}>Güncelle</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="director-form">
        <h2>{isEditMode ? 'Yönetmen Güncelle' : 'Yeni Yönetmen Ekle'}</h2>
        <div>
          <input
            type="text"
            name="directorname"
            value={newDirector.directorname}
            onChange={handleInputChange}
            placeholder="Yönetmen Adı"
          />
          <input
            type="text"
            name="directorsurname"
            value={newDirector.directorsurname}
            onChange={handleInputChange}
            placeholder="Yönetmen Soyadı"
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

export default Director;
