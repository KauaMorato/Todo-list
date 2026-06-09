import React, { useState } from 'react';
import api from '../services/api';

function Cadastro({ navegarParaLogin }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [erro, setErro] = useState('');

  const handleCadastro = async (e) => {
    e.preventDefault();
    try {
      setErro('');
      setSucesso('');
      await api.post('/cadastro', { nome, email, senha });
      setSucesso('Usuário cadastrado! Redirecionando...');
      setTimeout(() => navegarParaLogin(), 2000);
    } catch (err) {
      setErro(err.response?.data?.error || 'Erro ao realizar cadastro.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleCadastro} style={{ background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '300px' }}>
        <h2>Criar Conta</h2>
        {erro && <p style={{ color: 'red', fontSize: '14px' }}>{erro}</p>}
        {sucesso && <p style={{ color: 'green', fontSize: '14px' }}>{sucesso}</p>}

        <div style={{ marginBottom: '15px' }}>
          <label>Nome:</label>
          <input type="text" value={nome} onChange={e => setNome(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label>E-mail:</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Senha:</label>
          <input type="password" value={senha} onChange={e => setSenha(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} />
        </div>

        <button type="submit" style={{ width: '100%', padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Registrar</button>
        <p style={{ marginTop: '15px', textAlign: 'center', fontSize: '14px' }}>
          Já tem conta? <span onClick={navegarParaLogin} style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}>Faça Login</span>
        </p>
      </form>
    </div>
  );
}

export default Cadastro;