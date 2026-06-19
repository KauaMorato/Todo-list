import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  // O IP 10.0.2.2 redireciona as chamadas do emulador Android direto para o seu computador local
  baseURL: 'http://10.0.2.2:5000',
  timeout: 10000, // timeout de 10 segundos
});

api.interceptors.request.use(async (config) => {
  try {
    console.log('DEBUG: Iniciando interceptor de requisição');
    const token = await AsyncStorage.getItem('token');
    console.log('DEBUG: Token recuperado:', token ? 'existe' : 'não existe');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('DEBUG: Config pronta:', config.url, config.method);
    return config;
  } catch (error) {
    console.log('DEBUG: Erro no interceptor:', error.message);
    return config; // Continua mesmo com erro
  }
});

api.interceptors.response.use(
  (response) => {
    console.log('DEBUG: Resposta recebida:', response.status, response.data);
    return response;
  },
  (error) => {
    console.log('DEBUG: Erro na resposta:', error.message, error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default api;
