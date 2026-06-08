import React, { useState, useEffect } from 'react';
import Login from './screens/Login';
import Dashboard from './screens/Dashboard';
import { setAuthToken } from './services/api';

export default function App() {
  // Estado para controlar se o usuário está logado ou não
  const [estaLogado, setEstaLogado] = useState(false);

  // Assim que o app abre, verifica se já existe um token salvo
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token); // Ativa o token no Axios
      setEstaLogado(true);  // Manda direto para o Dashboard
    }
  }, []);

  // Função chamada após o login com sucesso
  const logar = () => {
    setEstaLogado(true);
  };

  // Função para fazer Logoff (Sair)
  const deslogar = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setEstaLogado(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>📌 To-Do List do Projeto</h1>
      <hr />

      {/* Roteamento simples: se logado mostra Dashboard, senão mostra Login */}
      {estaLogado ? (
        <div>
          <button onClick={deslogar} style={{ float: 'right', background: 'red', color: 'white' }}>
            Sair da Conta
          </button>
          <Dashboard />
        </div>
      ) : (
        <Login onLoginSuccess={logar} />
      )}
    </div>
  );
}