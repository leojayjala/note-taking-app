// frontend/lib/api.js - FINAL VERSION
const API_URL = 'http://localhost:3000/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const api = {
    async request(endpoint, method = 'GET', data = null) {
        const headers = {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        };

        const response = await fetch(`${API_URL}${endpoint}`, {
            method,
            headers,
            body: data ? JSON.stringify(data) : null
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Request failed');
        }
        
        return result;
    },

    // Auth
    register: (email, password) => 
        api.request('/auth/register', 'POST', { email, password }),
    
    login: (email, password) => 
        api.request('/auth/login', 'POST', { email, password }),

    // Notes CRUD
    getNotes: () => api.request('/notes', 'GET'),
    
    createNote: (title, content) => 
        api.request('/notes', 'POST', { title, content }),
    
    updateNote: (id, title, content) => 
        api.request(`/notes/${id}`, 'PUT', { title, content }),
    
    deleteNote: (id) => 
        api.request(`/notes/${id}`, 'DELETE'),
};