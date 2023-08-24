import React, { useState, useEffect } from 'react';
import './facility.css';
import Sidebar from '../Sidebar/Sidebar';
import ApiService from '../../services/apiService'; // ApiService import edildi
import Toast from '../../Common/Toast';

const Facility = () => {
  const [facilities, setFacilities] = useState([]);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const [newFacility, setNewFacility] = useState({
    facilityname: '',
    cityid: null,
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [cities, setCities] = useState([]);
  const [cityNames, setCityNames] = useState({});

  useEffect(() => {
    fetchFacilities();
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

  const fetchFacilities = async () => {
    try {
      const facilities = await ApiService.get('/api/Facility/ShowFacilitiesWithCityNames');
      setFacilities(facilities);
    } catch (error) {
      console.error('Tesis verilerini alma hatası:', error);
    }
  };

  const fetchCities = async () => {
    try {
      const cities = await ApiService.get('/api/City');
      setCities(cities);
      const cityNamesMap = cities.reduce((acc, city) => {
        acc[city.cityid] = city.cityname;
        return acc;
      }, {});
      setCityNames(cityNamesMap);
    } catch (error) {
      console.error('Şehir verilerini alma hatası:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewFacility({ ...newFacility, [name]: value });
  };

  const addFacility = async () => {
    try {
      await ApiService.post('/api/Facility', newFacility);
      setNewFacility({
        facilityname: '',
        cityid: null,
      });
      fetchFacilities();
      showSuccessToast('Tesis başarıyla eklendi!');
    } catch (error) {
      console.error('Tesis ekleme hatası:', error);
      showErrorToast('Tesis eklenirken bir hata oluştu!');
    }
  };

  const deleteFacility = async (facilityId) => {
    try {
      await ApiService.delete(`/api/Facility/${facilityId}`);
      fetchFacilities();
      showSuccessToast('Tesis başarıyla silindi!');
    } catch (error) {
      console.error('Tesis silme hatası:', error);
      showErrorToast('Tesis silinirken bir hata oluştu!');
    }
  };

  const updateFacility = async (facilityId, updatedFacility) => {
    try {
      await ApiService.put(`/api/Facility/${facilityId}`, updatedFacility);
      setNewFacility({
        facilityname: '',
        cityid: null,
      });
      setIsEditMode(false);
      fetchFacilities();
      showSuccessToast('Tesis başarıyla güncellendi!');
    } catch (error) {
      console.error('Tesis güncelleme hatası:', error);
      showErrorToast('Tesis güncellenirken bir hata oluştu!');
    }
  };

  const handleUpdate = (facilityId) => {
    const facilityToUpdate = facilities.find((facility) => facility.facilityid === facilityId);
    setNewFacility(facilityToUpdate);
    setIsEditMode(true);
  };

  const handleAddOrUpdate = () => {
    if (isEditMode) {
      updateFacility(newFacility.facilityid, newFacility);
    } else {
      addFacility();
    }
  };


  return (
    <div className="container">
      <Sidebar/>
      <div className="facility-list">
        <h2>Tesisler</h2>
        {facilities.length === 0 ? (
          <p>Tesisler yükleniyor...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Tesis ID</th>
                <th>Tesis Adı</th>
                <th>Şehir Adı</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {facilities.map((facility) => (
                <tr key={facility.facilityid}>
                  <td>{facility.facilityid}</td>
                  <td>{facility.facilityname}</td>
                  <td>{cityNames[facility.cityid]}</td>
                  <td>
                    <button onClick={() => deleteFacility(facility.facilityid)}>Sil</button>
                    <button onClick={() => handleUpdate(facility.facilityid)}>Güncelle</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="facility-form">
        <h2>{isEditMode ? 'Tesis Güncelle' : 'Yeni Tesis Ekle'}</h2>
        <div>
          <input
            type="text"
            name="facilityname"
            value={newFacility.facilityname}
            onChange={handleInputChange}
            placeholder="Tesis Adı"
          />
          <select
            name="cityid"
            value={newFacility.cityid || ''}
            onChange={handleInputChange}
            placeholder="Şehir ID"
          >
            <option value="">Şehir Seçin</option>
            {cities.map((city) => (
              <option key={city.cityid} value={city.cityid}>
                {city.cityname}
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

export default Facility;
