import React, { useState, useEffect } from 'react';
import './channel.css';
import Sidebar from '../Sidebar/Sidebar';
import ApiService from '../../services/apiService'; // ApiService import edildi
import Toast from '../../Common/Toast';

const Channel = () => {
  const [channels, setChannels] = useState([]);
  const [newChannel, setNewChannel] = useState({
    channelname: '',
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchChannels();
  }, []);

  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');

  const fetchChannels = async () => {
    try {
      const channels = await ApiService.get('/api/Channel'); // ApiService ile API çağrısı
      setChannels(channels);
    } catch (error) {
      console.error('Kanal verilerini alma hatası:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewChannel({ ...newChannel, [name]: value });
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

  const addChannel = async () => {
    try {
      await ApiService.post('/api/Channel', newChannel); // ApiService ile API çağrısı
      setNewChannel({
        channelname: '',
      });
      fetchChannels();
      showSuccessToast('Kanal başarıyla eklendi!'); 
    } catch (error) {
      console.error('Kanal ekleme hatası:', error);
      showErrorToast('Kanal eklenirken bir hata oluştu.');
    }
  };

  const deleteChannel = async (channelId) => {
    try {
      await ApiService.delete(`/api/Channel/${channelId}`); // ApiService ile API çağrısı
      fetchChannels();
      showSuccessToast('Kanal başarıyla silindi.');
    } catch (error) {
      console.error('Kanal silme hatası:', error);
      showErrorToast('Kanal silinirken bir hata oluştu.');
    }
  };

  const updateChannel = async (channelId, updatedChannel) => {
    try {
      await ApiService.put(`/api/Channel/${channelId}`, updatedChannel); // ApiService ile API çağrısı
      setNewChannel({
        channelname: '',
      });
      setIsEditMode(false);
      fetchChannels();
      showSuccessToast('Kanal başarıyla güncellendi.');
    } catch (error) {
      console.error('Kanal güncelleme hatası:', error);
      showSuccessToast('Kanal güncellenirken bir hata oluştu.');
    }
  };

  const handleUpdate = (channelId) => {
    const channelToUpdate = channels.find((channel) => channel.channelid === channelId);
    setNewChannel(channelToUpdate);
    setIsEditMode(true);
  };

  const handleAddOrUpdate = () => {
    if (isEditMode) {
      updateChannel(newChannel.channelid, newChannel);
    } else {
      addChannel();
    }
  };

  return (
    <div className="container">
      <Sidebar/>
      <div className="channel-list">
        <h2>Kanallar</h2>
        {channels.length === 0 ? (
          <p>Kanallar yükleniyor...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Kanal Adı</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {channels.map((channel) => (
                <tr key={channel.channelid}>
                  <td>{channel.channelname}</td>
                  <td>
                    <button onClick={() => deleteChannel(channel.channelid)}>Sil</button>
                    <button onClick={() => handleUpdate(channel.channelid)}>Güncelle</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="channel-form">
        <h2>{isEditMode ? 'Kanal Güncelle' : 'Yeni Kanal Ekle'}</h2>
        <div>
          <input
            type="text"
            name="channelname"
            value={newChannel.channelname}
            onChange={handleInputChange}
            placeholder="Kanal Adı"
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

export default Channel;
