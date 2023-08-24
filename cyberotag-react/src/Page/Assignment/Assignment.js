import React, { useState, useEffect } from 'react';
import './assignment.css';
import Sidebar from '../Sidebar/Sidebar';
import ApiService from '../../services/apiService';
import Toast from '../../Common/Toast';

const Assignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [operations, setOperations] = useState([]);
  const [operators, setOperators] = useState([]);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  const [newAssignment, setNewAssignment] = useState({
    operationid: null,
    operatorid: null,
  });

  useEffect(() => {
    fetchAssignments();
    fetchOperations();
    fetchOperators();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await ApiService.get('/api/Assignment');
      setAssignments(response);
    } catch (error) {
      console.error('Assignment verilerini alma hatası:', error);
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

  const fetchOperators = async () => {
    try {
      const response = await ApiService.get('/api/Operator');
      setOperators(response);
    } catch (error) {
      console.error('Operatör verilerini alma hatası:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewAssignment({ ...newAssignment, [name]: value });
  };

 

  const showToast = (message, type) => {
    setIsToastVisible(true);
    setToastMessage(message);
    setTimeout(() => {
      setIsToastVisible(false);
      setToastMessage('');
    }, 3000);
  };

  const showSuccessToast = (message) => {
    showToast(message, 'success');
  };

  const showErrorToast = (message) => {
    showToast(message, 'error');
  };

  const addAssignment = async () => {
    try {
      await ApiService.post('/api/Assignment', newAssignment);
      setNewAssignment({
        operationid: null,
        operatorid: null,
      });
      fetchAssignments();
      showSuccessToast('Assignment başarıyla eklendi!');
    } catch (error) {
      console.error('Assignment ekleme hatası:', error);
      showErrorToast('Assignment eklenirken bir hata oluştu.');
    }
  };

  const deleteAssignment = async (assignmentId) => {
    try {
      await ApiService.delete(`/api/Assignment/${assignmentId}`);
      fetchAssignments();
      showSuccessToast('Assignment başarıyla silindi.');
    } catch (error) {
      console.error('Assignment silme hatası:', error);
      showErrorToast('Assignment silinirken bir hata oluştu.');
    }
  };

 const updateAssignment = async (assignmentId, updatedAssignment) => {
  try {
    await ApiService.put(`/api/Assignment/${assignmentId}`, updatedAssignment);
    setNewAssignment({
      operationid: null,
      operatorid: null,
    });
    setIsEditMode(false);
    fetchAssignments();
    showSuccessToast('Assignment başarıyla güncellendi.');
  } catch (error) {
    console.error('Assignment güncelleme hatası:', error);
    showErrorToast('Assignment güncellenirken bir hata oluştu.');
  }
};

  const handleUpdate = (assignmentId) => {
    const assignmentToUpdate = assignments.find((assignment) => assignment.assignmentid === assignmentId);
    setNewAssignment(assignmentToUpdate);
    setIsEditMode(true);
  };

  const handleAddOrUpdate = () => {
    if (isEditMode) {
      updateAssignment(newAssignment.assignmentid, newAssignment);
    } else {
      addAssignment();
    }
  };

  return (
    <div className="container">
      <Sidebar />
      <div className="assignment-list">
        <h2>Assignments</h2>
        {assignments.length === 0 ? (
          <p>Assignments yükleniyor...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Assignment ID</th>
                <th>Operation ID</th>
                <th>Operator ID</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
                <tr key={assignment.assignmentid}>
                  <td>{assignment.assignmentid}</td>
                  <td>{assignment.operationid}</td>
                  <td>{operators.find(op => op.operatorid === assignment.operatorid)?.operatorname}</td>
                  <td>
                    <button onClick={() => deleteAssignment(assignment.assignmentid)}>Sil</button>
                    <button onClick={() => handleUpdate(assignment.assignmentid)}>Güncelle</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="assignment-form">
        <h2>{isEditMode ? 'Assignment Güncelle' : 'Yeni Assignment Ekle'}</h2>
        <div>
          <select
            name="operationid"
            value={newAssignment.operationid}
            onChange={handleInputChange}
          >
            <option value="">Operasyon Seç</option>
            {operations.map((operation) => (
              <option key={operation.operationid} value={operation.operationid}>
                {operation.operationid}
              </option>
            ))}
          </select>

          <select
            name="operatorid"
            value={newAssignment.operatorid}
            onChange={handleInputChange}
          >
            <option value="">Operatör Seç</option>
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
        <Toast type={toastMessage.includes('başarıyla') ? 'success' : 'error'}>
          {toastMessage}
        </Toast>
      )}
    </div>
  );
};

export default Assignment;
