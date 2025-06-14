// services/SickLeaveService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8084/api/v1/sick-leave';

class SickLeaveService {
  // Basic CRUD operations
  getAllSickLeaves() {
    return axios.get(`${BASE_URL}/list`);
  }

  getSickLeaveById(id) {
    return axios.get(`${BASE_URL}/${id}`);
  }

  createSickLeave(examinationId, sickLeaveData) {
    return axios.post(`${BASE_URL}/examination/${examinationId}`, sickLeaveData);
  }

  updateSickLeave(id, sickLeaveData) {
    return axios.put(`${BASE_URL}/${id}`, sickLeaveData);
  }

  deleteSickLeave(id) {
    return axios.delete(`${BASE_URL}/${id}`);
  }

  // Statistics endpoints
  getPeakMonth(year = null) {
    const url = year ? `${BASE_URL}/statistics/peak-month?year=${year}` : `${BASE_URL}/statistics/peak-month`;
    return axios.get(url);
  }

  getTopDoctors() {
    return axios.get(`${BASE_URL}/statistics/top-doctors-most-sick-leaves`);
  }
}

export default new SickLeaveService();