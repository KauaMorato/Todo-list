import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from './src/screens/Login';
import Cadastro from './src/screens/Cadastro';
import Dashboard from './src/screens/Dashboard';

export default function App() {
  const [telaAtual, setTelaAtual] = useState('login');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const verificarToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) setTelaAtual('dashboard');
      } catch (e) {
        console.log(e);
      } finally {
        setCarregando(false);
      }
    };
    verificarToken();
  }, []);

  if (carregando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f0f2f5' }}>
      {telaAtual === 'login' && (
        <Login navegarParaCadastro={() => setTelaAtual('cadastro')} logarSucesso={() => setTelaAtual('dashboard')} />
      )}
      {telaAtual === 'cadastro' && (
        <Cadastro navegarParaLogin={() => setTelaAtual('login')} />
      )}
      {telaAtual === 'dashboard' && (
        <Dashboard deslogar={() => setTelaAtual('login')} />
      )}
    </View>
  );
}