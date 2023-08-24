import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import ApiService from '../../services/apiService';
import Toast from '../../Common/Toast';


const User = () => {
  const [users, setUsers] = useState([]);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const [roles, setRoles] = useState([]);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    roleid: null,
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);
  

  const fetchRoles = async () => {
    try {
      const roles = await ApiService.get('/api/Role'); // Servis sınıfını kullanarak API çağrısı yapın
      setRoles(roles);
    } catch (error) {
      console.error('Rol verilerini alma hatası:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const users = await ApiService.get('/api/User'); // Servis sınıfını kullanarak API çağrısı yapın
      setUsers(users);
    } catch (error) {
      console.error('Kullanıcı verilerini alma hatası:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewUser({ ...newUser, [name]: value });
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

  const addUser = async () => {
    try {
      await ApiService.post('/api/User', newUser); // Servis sınıfını kullanarak API çağrısı yapın
      setNewUser({
        username: '',
        password: '',
        roleid: null,
      });
      fetchUsers();
      showSuccessToast('Kullanıcı başarıyla eklendi!');
    } catch (error) {
      console.error('Kullanıcı ekleme hatası:', error);
      showErrorToast('Kullanıcı eklenirken bir hata oluştu!');
    }
  };

  const deleteUser = async (userId) => {
    try {
      await ApiService.delete(`/api/User/${userId}`); // Servis sınıfını kullanarak API çağrısı yapın
      fetchUsers();
      showSuccessToast('Kullanıcı başarıyla silindi!');
    } catch (error) {
      console.error('Kullanıcı silme hatası:', error);
      showErrorToast('Kullanıcı silinirken bir hata oluştu!');
    }
  };

  const updateUser = async (userId, updatedUser) => {
    try {
      await ApiService.put(`/api/User/${userId}`, updatedUser); // Servis sınıfını kullanarak API çağrısı yapın
      setNewUser({
        username: '',
        password: '',
        roleid: null,
      });
      setIsEditMode(false);
      fetchUsers();
      showSuccessToast('Kullanıcı başarıyla güncellendi!');
    } catch (error) {
      console.error('Kullanıcı güncelleme hatası:', error);
      showErrorToast('Kullanıcı güncellenirken bir hata oluştu!');
    }
  };

  const handleUpdate = (userId) => {
    const userToUpdate = users.find((user) => user.userid === userId);
    setNewUser(userToUpdate);
    setIsEditMode(true);
  };

  const handleAddOrUpdate = () => {
    if (isEditMode) {
      updateUser(newUser.userid, newUser);
    } else {
      addUser();
    }
  };
  const getRoleNameById = (roleId) => {
    const role = roles.find((role) => role.roleid === roleId);
    return role ? role.rolename : '';
  };

  return (
    <div className="container">
      <Sidebar/>
      <div className="user-list">
        <h2>Kullanıcılar</h2>
        {users.length === 0 ? (
          <p>Kullanıcılar yükleniyor...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Kullanıcı ID</th>
                <th>Kullanıcı Adı</th>
                <th>Şifre</th>
                <th>Rol</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.userid}>
                  <td>{user.userid}</td>
                  <td>{user.username}</td>
                  <td>{user.password}</td>
                  <td>{getRoleNameById(user.roleid)}</td>
                  <td>
                    <button onClick={() => deleteUser(user.userid)}>Sil</button>
                    <button onClick={() => handleUpdate(user.userid)}>Güncelle</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="user-form">
        <h2>{isEditMode ? 'Kullanıcı Güncelle' : 'Yeni Kullanıcı Ekle'}</h2>
        <div>
          
          <input
            type="text"
            name="username"
            value={newUser.username}
            onChange={handleInputChange}
            placeholder="Kullanıcı Adı"
          />
          <input
            type="password"
            name="password"
            value={newUser.password}
            onChange={handleInputChange}
            placeholder="Şifre"
          />
          <select
            name="roleid"
            value={newUser.roleid || ''}
            onChange={handleInputChange}
          >
            <option value="">Rol Seçin</option>
            {roles.map((role) => (
              <option key={role.roleid} value={role.roleid}>
                {role.rolename}
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

export default User;
