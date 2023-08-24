import React from 'react';
import './toast.css'; // Toast bileşeninin stillendirmesi için bir CSS dosyası oluşturun

const Toast = ({ type, children }) => {
  return <div className={`toast ${type}`}>{children}</div>;
};

export default Toast;