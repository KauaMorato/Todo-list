import React, { useState } from 'react';
import api from '../services/api';

function Login({ navegarParaCadastro, logarSucesso }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setErro('');
      const resposta = await api.post('/login', { email, senha });
      localStorage.setItem('token', resposta.data.token);
      logarSucesso();
    } catch (err) {
      setErro(err.response?.data?.error || 'Erro ao conectar com o servidor.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleLogin} style={{ background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '300px' }}>
        <h2>Entrar no To-Do List</h2>
        {erro && <p style={{ color: 'red', fontSize: '14px' }}>{erro}</p>}
        
        <div style={{ marginBottom: '15px' }}>
          <label>E-mail:</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Senha:</label>
          <input type="password" value={senha} onChange={e => setSenha(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} />
        </div>

        <button type="submit" style={{ width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Entrar</button>
        <p style={{ marginTop: '15px', textAlign: 'center', fontSize: '14px' }}>
          Não tem conta? <span onClick={navegarParaCadastro} style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}>Cadastre-se</span>
        </p>
      </form>
    </div>
  );
}

export default Login;