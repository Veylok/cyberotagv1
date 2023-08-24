import React, { useState, useEffect } from 'react';
import ApiService from '../../services/apiService';
import './document.css';
import Sidebar from '../Sidebar/Sidebar';
import Toast from '../../Common/Toast';

const Document = () => {
  const [documents, setDocuments] = useState([]);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const [spendingOptions, setSpendingOptions] = useState([]);
  const [newDocument, setNewDocument] = useState({
    spendingid: null,
    documentFile: null,
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchDocuments();
    fetchSpendingOptions();
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

  const fetchSpendingOptions = async () => {
    try {
      const response = await ApiService.get('/api/spending'); // Change this URL as needed
      setSpendingOptions(response);
    } catch (error) {
      console.error('Harcama seçeneklerini alma hatası:', error);
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await ApiService.get('/api/Document');
      setDocuments(response);
    } catch (error) {
      console.error('Belge verilerini alma hatası:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value, files } = event.target;
    setNewDocument({ ...newDocument, [name]: name === 'documentFile' ? files[0] : value });
  };

  const addDocument = async () => {
    try {
      const formData = new FormData();
      formData.append('spendingid', newDocument.spendingid);
      formData.append('documentFile', newDocument.documentFile);

      await ApiService.post('/api/Document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setNewDocument({
        spendingid: null,
        documentFile: null,
      });

      fetchDocuments();
      showSuccessToast('Belge başarıyla eklendi!');
    } catch (error) {
      console.error('Belge ekleme hatası:', error);
      showErrorToast('Belge eklenirken bir hata oluştu!');
    }
  };

  const deleteDocument = async (documentId) => {
    try {
      await ApiService.delete(`/Document/${documentId}`);
      fetchDocuments();
      showSuccessToast('Belge başarıyla silindi!');
    } catch (error) {
      console.error('Belge silme hatası:', error);
      showErrorToast('Belge silinirken bir hata oluştu!');
    }
  };

  const handleUpdate = (documentId) => {
    const documentToUpdate = documents.find((document) => document.documentid === documentId);
    setNewDocument({
      ...documentToUpdate,
      documentFile: null,
    });
    setIsEditMode(true);
  };

  const handleAddOrUpdate = () => {
    if (isEditMode) {
      updateDocument(newDocument.documentid, newDocument);
    } else {
      addDocument();
    }
  };

  const updateDocument = async (documentId, updatedDocument) => {
    try {
      const formData = new FormData();
      formData.append('spendingid', updatedDocument.spendingid);
      
      // Eğer yeni bir belge resmi yüklendi ise, formData'e ekle
      if (updatedDocument.documentFile) {
        formData.append('documentFile', updatedDocument.documentFile);
      }
  
      await ApiService.put(`/api/Document/${documentId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      setNewDocument({
        spendingid: null,
        documentFile: null,
      });
  
      setIsEditMode(false);
      fetchDocuments();
      showSuccessToast('Belge başarıyla güncellendi!');
    } catch (error) {
      console.error('Belge güncelleme hatası:', error);
      showErrorToast('Belge güncellenirken bir hata oluştu!');
    }
  };
  

  return (
    <div className="container">
      <Sidebar/>
      <div className="document-list">
        <h2>Belgeler</h2>
        {documents.length === 0 ? (
          <p>Belgeler yükleniyor...</p>
        ) : (
          <ul className="document-ul">
            {documents.map((document) => (
              <li key={document.documentid} className="document-li">
                <p>Belge ID: {document.documentid}</p>
                <p>Harcama ID: {document.spendingid}</p>
                {document.documentimg && (
                  <img src={`data:image/jpeg;base64,${document.documentimg}`} alt={`Belge ${document.documentid}`} className="document-image" />
                )}
                <div className="button-group">
                  <button onClick={() => deleteDocument(document.documentid)} className="delete-button">Sil</button>
                  <button onClick={() => handleUpdate(document.documentid)} className="update-button">Güncelle</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="document-form">
        <h2>{isEditMode ? 'Belge Güncelle' : 'Yeni Belge Ekle'}</h2>
        <div>
          <label>Harcama ID:</label>
          <select
            name="spendingid"
            value={newDocument.spendingid || ''}
            onChange={handleInputChange}
            placeholder="Harcanan ID"
            className="input-field"
          >
            <option value="" disabled>
              Harcama ID Seçin
            </option>
            {spendingOptions.map((option) => (
              <option key={option.spendingid} value={option.spendingid}>
                {option.spendingid}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Belge:</label>
          <input type="file" name="documentFile" onChange={handleInputChange} className="input-field" />
        </div>
        <button onClick={handleAddOrUpdate} className="add-button">
          {isEditMode ? 'Güncelle' : 'Ekle'}
        </button>
      </div>
      {isToastVisible && (
        <Toast type={toastType}>
          {toastMessage}
        </Toast>
      )}
    </div>
  );
};

export default Document;
