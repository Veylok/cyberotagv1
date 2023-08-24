import React, { useState, useEffect } from 'react';
import './city.css';
import Sidebar from '../Sidebar/Sidebar';
import ApiService from '../../services/apiService'; // ApiService import edildi
import Toast from '../../Common/Toast';

const City = () => {
  const [cities, setCities] = useState([]);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const [newCity, setNewCity] = useState({
    cityname: '',
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchCities();
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

  const fetchCities = async () => {
    try {
      const cities = await ApiService.get('/api/City'); // ApiService ile API çağrısı
      setCities(cities);
    } catch (error) {
      console.error('Şehir verilerini alma hatası:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewCity({ ...newCity, [name]: value });
  };

  const addCity = async () => {
    try {
      await ApiService.post('/api/City', newCity); // ApiService ile API çağrısı
      setNewCity({
        cityname: '',
      });
      fetchCities();
      showSuccessToast('Şehir başarıyla eklendi!');
    } catch (error) {
      console.error('Şehir ekleme hatası:', error);
      showErrorToast('Şehir eklenirken bir hata oluştu');
    }
  };

  const deleteCity = async (cityId) => {
    try {
      await ApiService.delete(`/api/City/${cityId}`); // ApiService ile API çağrısı
      fetchCities();
      showSuccessToast('Şehir başarıyla silindi!');
    } catch (error) {
      console.error('Şehir silme hatası:', error);
      showErrorToast('Şehir silinrken bir hata oluştu');
    }
  };

  const updateCity = async (cityId, updatedCity) => {
    try {
      await ApiService.put(`/api/City/${cityId}`, updatedCity); // ApiService ile API çağrısı
      setNewCity({
        cityname: '',
      });
      setIsEditMode(false);
      fetchCities();
      showSuccessToast('Şehir başarıyla güncellendi!');
    } catch (error) {
      console.error('Şehir güncelleme hatası:', error);
      showErrorToast('Şehir güncellenirken bir hata oluştu');
    }
  };

  const handleUpdate = (cityId) => {
    const cityToUpdate = cities.find((city) => city.cityid === cityId);
    setNewCity(cityToUpdate);
    setIsEditMode(true);
  };

  const handleAddOrUpdate = () => {
    if (isEditMode) {
      updateCity(newCity.cityid, newCity);
    } else {
      addCity();
    }
  };


  return (
    <div className="container">
      <Sidebar/>
      <div className="city-list">
        <h2>Şehirler</h2>
        {cities.length === 0 ? (
          <p>Şehirler yükleniyor...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Şehir Adı</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {cities.map((city) => (
                <tr key={city.cityid}>
                  <td>{city.cityname}</td>
                  <td>
                    <button onClick={() => deleteCity(city.cityid)}>Sil</button>
                    <button onClick={() => handleUpdate(city.cityid)}>Güncelle</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="city-form">
        <h2>{isEditMode ? 'Şehir Güncelle' : 'Yeni Şehir Ekle'}</h2>
        <div>
          <input
            type="text"
            name="cityname"
            value={newCity.cityname}
            onChange={handleInputChange}
            placeholder="Şehir Adı"
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

export default City;
