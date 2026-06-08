import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000' // URL do seu backend Python ou C#
});

// Essa função anexa o Token automaticamente em todas as requisições futuras
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;