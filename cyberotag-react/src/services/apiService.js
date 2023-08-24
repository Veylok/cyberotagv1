import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

class ApiService {
  static async get(url) {
    const response = await axios.get(`${API_BASE_URL}${url}`);
    return response.data;
  }

  static async post(url, data) {
    const response = await axios.post(`${API_BASE_URL}${url}`, data);
    return response.data;
  }

  static async put(url, data) {
    const response = await axios.put(`${API_BASE_URL}${url}`, data);
    return response.data;
  }

  static async delete(url) {
    const response = await axios.delete(`${API_BASE_URL}${url}`);
    return response.data;
  }
}

export default ApiService;
