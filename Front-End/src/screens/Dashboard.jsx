import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Dashboard({ deslogar }) {
  const [tarefas, setTarefas] = useState([]);
  const [novaTarefa, setNovaTarefa] = useState('');

  // Carrega as tarefas exclusivas do usuário logado ao abrir a tela
  useEffect(() => {
    carregarTarefas();
  }, []);

  const carregarTarefas = async () => {
    try {
      console.log('DEBUG: Carregando tarefas...');
      const resposta = await api.get('/tarefas');
      console.log('DEBUG: Tarefas carregadas:', resposta.data);
      setTarefas(resposta.data);
    } catch (err) {
      console.log('DEBUG: Erro ao carregar tarefas:', err.response?.data || err.message);
      if (err.response?.status === 401) handleSair();
    }
  };

  const adicionarTarefa = async (e) => {
    e.preventDefault();
    if (!novaTarefa.trim()) return;
    try {
      console.log('DEBUG: Adicionando tarefa:', novaTarefa);
      await api.post('/tarefas', { titulo: novaTarefa });
      console.log('DEBUG: Tarefa adicionada com sucesso');
      setNovaTarefa('');
      carregarTarefas();
    } catch (err) {
      console.log('DEBUG: Erro ao adicionar tarefa:', err.response?.data || err.message);
      alert('Erro ao adicionar tarefa');
    }
  };

  const alternarConclusao = async (id, concluidaAtual) => {
    try {
      console.log('DEBUG: Alternando conclusão da tarefa:', id);
      await api.put(`/tarefas/${id}`, { concluida: !concluidaAtual });
      console.log('DEBUG: Tarefa atualizada');
      carregarTarefas();
    } catch (err) {
      console.log('DEBUG: Erro ao atualizar tarefa:', err.response?.data || err.message);
      alert('Erro ao atualizar tarefa');
    }
  };

  const deletarTarefa = async (id) => {
    try {
      console.log('DEBUG: Deletando tarefa:', id);
      await api.delete(`/tarefas/${id}`);
      console.log('DEBUG: Tarefa deletada');
      carregarTarefas();
    } catch (err) {
      console.log('DEBUG: Erro ao deletar tarefa:', err.response?.data || err.message);
      alert('Erro ao deletar tarefa');
    }
  };

  const handleSair = () => {
    localStorage.removeItem('token');
    deslogar();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Minhas Tarefas</h2>
        <button onClick={handleSair} style={{ padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Sair</button>
      </div>

      <form onSubmit={adicionarTarefa} style={{ display: 'flex', marginBottom: '20px' }}>
        <input type="text" value={novaTarefa} onChange={e => setNovaTarefa(e.target.value)} placeholder="Nova tarefa..." style={{ flex: 1, padding: '8px', borderRadius: '4px 0 0 4px', border: '1px solid #ccc' }} />
        <button type="submit" style={{ padding: '8px 15px', background: '#007bff', color: 'white', border: 'none', borderRadius: '0 4px 4px 0', cursor: 'pointer' }}>+</button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tarefas.map(tarefa => (
          <li key={tarefa.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: 'white', marginBottom: '8px', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input type="checkbox" checked={!!tarefa.concluida} onChange={() => alternarConclusao(tarefa.id, tarefa.concluida)} />
              <span style={{ textDecoration: tarefa.concluida ? 'line-through' : 'none', color: tarefa.concluida ? '#888' : '#000' }}>{tarefa.titulo}</span>
            </div>
            <button onClick={() => deletarTarefa(tarefa.id)} style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
/* Código feito por Kauã e Agnaldo */
export default Dashboard;