import React, { useState, useEffect } from 'react';
import './graphicset.css';
import Sidebar from '../Sidebar/Sidebar';
import ApiService from '../../services/apiService'; // ApiService import edildi
import Toast from '../../Common/Toast';

const Graphicset = () => {
  const [graphicsets, setGraphicsets] = useState([]);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const [newGraphicset, setNewGraphicset] = useState({
    graphicsetname: '',
    branchid: null,
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [branches, setBranches] = useState([]);
  const [branchNames, setBranchNames] = useState({});

  useEffect(() => {
    fetchGraphicsets();
    fetchBranches();
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

  const fetchGraphicsets = async () => {
    try {
      const graphicsets = await ApiService.get('/api/Graphicset/GraphicsetsWithBranchNames');
      setGraphicsets(graphicsets);

      const branchNamesMap = graphicsets.reduce((acc, graphicset) => {
        acc[graphicset.branchid] = graphicset.branch.branchname;
        return acc;
      }, {});
      setBranchNames(branchNamesMap);
    } catch (error) {
      console.error('Grafik Seti verilerini alma hatası:', error);
    }
  };

  const fetchBranches = async () => {
    try {
      const branches = await ApiService.get('/api/Branch');
      setBranches(branches);
    } catch (error) {
      console.error('Şube verilerini alma hatası:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewGraphicset({ ...newGraphicset, [name]: value });
  };

  const addGraphicset = async () => {
    try {
      await ApiService.post('/api/Graphicset', newGraphicset);
      setNewGraphicset({
        graphicsetname: '',
        branchid: null,
      });
      fetchGraphicsets();
      showSuccessToast('Grafik Seti başarıyla eklendi!');
    } catch (error) {
      console.error('Grafik Seti ekleme hatası:', error);
      showErrorToast('Şube eklenirken bir hata oluştu!');
    }
  };

  const deleteGraphicset = async (graphicsetId) => {
    try {
      await ApiService.delete(`/api/Graphicset/${graphicsetId}`);
      fetchGraphicsets();
      showSuccessToast('Grafik Seti başarıyla silindi!');
    } catch (error) {
      console.error('Grafik Seti silme hatası:', error);
      showErrorToast('Grafik Setti silinirken bir hata oluştu!');
    }
  };

  const updateGraphicset = async (graphicsetId, updatedGraphicset) => {
    try {
      await ApiService.put(`/api/Graphicset/${graphicsetId}`, updatedGraphicset);
      setNewGraphicset({
        graphicsetname: '',
        branchid: null,
      });
      setIsEditMode(false);
      fetchGraphicsets();
      showSuccessToast('Grafik Setti başarıyla güncellendi!');
    } catch (error) {
      console.error('Grafik Seti güncelleme hatası:', error);
      showErrorToast('Grafik Setti güncellenirken bir hata oluştu!');
    }
  };

  const handleUpdate = (graphicsetId) => {
    const graphicsetToUpdate = graphicsets.find((graphicset) => graphicset.graphicsetid === graphicsetId);
    setNewGraphicset(graphicsetToUpdate);
    setIsEditMode(true);
  };

  const handleAddOrUpdate = () => {
    if (isEditMode) {
      updateGraphicset(newGraphicset.graphicsetid, newGraphicset);
    } else {
      addGraphicset();
    }
  };

  return (
    <div className="container">
      <Sidebar/>
      <div className="graphicset-list">
        <h2>Grafik Setleri</h2>
        {graphicsets.length === 0 ? (
          <p>Grafik Setleri yükleniyor...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Grafik Seti ID</th>
                <th>Grafik Seti Adı</th>
                
                <th>Şube Adı</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {graphicsets.map((graphicset) => (
                <tr key={graphicset.graphicsetid}>
                  <td>{graphicset.graphicsetid}</td>
                  <td>{graphicset.graphicsetname}</td>
                
                  <td>{branchNames[graphicset.branchid]}</td> {/* Şube adını burada yazdırıyoruz */}
                  <td>
                    <button onClick={() => deleteGraphicset(graphicset.graphicsetid)}>Sil</button>
                    <button onClick={() => handleUpdate(graphicset.graphicsetid)}>Güncelle</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="graphicset-form">
        <h2>{isEditMode ? 'Grafik Seti Güncelle' : 'Yeni Grafik Seti Ekle'}</h2>
        <div>
          <input
            type="text"
            name="graphicsetname"
            value={newGraphicset.graphicsetname}
            onChange={handleInputChange}
            placeholder="Grafik Seti Adı"
          />
          <select
            name="branchid"
            value={newGraphicset.branchid || ''}
            onChange={handleInputChange}
            placeholder="Şube ID"
          >
            <option value="">Şube Seçin</option>
            {branches.map((branch) => (
              <option key={branch.branchid} value={branch.branchid}>
                {branch.branchname}
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

export default Graphicset;
