import React, { useState, useEffect } from 'react';
import Login from './screens/Login';
import Cadastro from './screens/Cadastro';
import Dashboard from './screens/Dashboard';

function App() {
  // Estados possíveis: 'login', 'cadastro', 'dashboard'
  const [telaAtual, setTelaAtual] = useState('login');

  useEffect(() => {
    // Se o usuário já tiver um token salvo, vai direto para o Dashboard
    const token = localStorage.getItem('token');
    if (token) {
      setTelaAtual('dashboard');
    }
  }, []);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      {telaAtual === 'login' && (
        <Login navegarParaCadastro={() => setTelaAtual('cadastro')} logarSucesso={() => setTelaAtual('dashboard')} />
      )}
      {telaAtual === 'cadastro' && (
        <Cadastro navegarParaLogin={() => setTelaAtual('login')} />
      )}
      {telaAtual === 'dashboard' && (
        <Dashboard deslogar={() => setTelaAtual('login')} />
      )}
    </div>
  );
}

export default App;