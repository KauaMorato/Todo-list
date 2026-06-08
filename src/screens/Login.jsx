import React, { useState } from 'react';
import api, { setAuthToken } from '../services/api';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', { email, senha });
      const { token } = response.data;

      // Salva o token no navegador/dispositivo
      localStorage.setItem('token', token); 
      setAuthToken(token); // Ativa o token nas requisições do axios
      
      onLoginSuccess(); // Muda o estado no App.js para ir para a tela de tarefas
    } catch (error) {
      alert('E-mail ou senha inválidos!');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={senha} onChange={e => setSenha(e.target.value)} placeholder="Senha" />
      <button type="submit">Entrar</button>
    </form>
  );
}