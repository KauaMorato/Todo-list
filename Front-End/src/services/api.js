import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  // DESCUBRA O IP DO SEU PC (ex: 192.168.1.15) E TROQUE ABAIXO:
  baseURL: 'http://192.168.3.247:5000', 
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;