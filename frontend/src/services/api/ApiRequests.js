const API_BASE = 'http://localhost:8084/api';

export const fetchDoctors = async () => {
    const response = await fetch(`${API_BASE}/v1/doctor/list`);
    if (!response.ok) throw new Error('Failed to fetch doctors');
    return response.json(); 
};