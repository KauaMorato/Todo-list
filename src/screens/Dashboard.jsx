import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Dashboard() {
  const [tarefas, setTarefas] = useState([]);
  const [novaTarefa, setNovaTarefa] = useState('');

  // 1. LISTAR (Read) - Roda assim que a tela abre
  useEffect(() => {
    carregarTarefas();
  }, []);

  const carregarTarefas = async () => {
    try {
      const response = await api.get('/tarefas'); // O Back já filtra pelo usuário do token
      setTarefas(response.data);
    } catch (error) {
      console.error("Erro ao carregar tarefas", error);
    }
  };

  // 2. CRIAR (Create)
  const handleCriar = async (e) => {
    e.preventDefault();
    if (!novaTarefa) return;

    try {
      await api.post('/tarefas', { titulo: novaTarefa });
      setNovaTarefa('');
      carregarTarefas(); // Atualiza a lista
    } catch (error) {
      console.error("Erro ao criar tarefa", error);
    }
  };

  // 3. ATUALIZAR (Update - Ex: Marcar como concluída)
  const handleAlternarConcluida = async (id, statusAtual) => {
    try {
      await api.put(`/tarefas/${id}`, { concluida: !statusAtual });
      carregarTarefas(); // Atualiza a lista
    } catch (error) {
      console.error("Erro ao atualizar tarefa", error);
    }
  };

  // 4. EXCLUIR (Delete)
  const handleDeletar = async (id) => {
    try {
      await api.delete(`/tarefas/${id}`);
      carregarTarefas(); // Atualiza a lista
    } catch (error) {
      console.error("Erro ao deletar tarefa", error);
    }
  };

  return (
    <div>
      <h2>Minhas Tarefas</h2>
      
      {/* Formulário para Criar */}
      <form onSubmit={handleCriar}>
        <input value={novaTarefa} onChange={e => setNovaTarefa(e.target.value)} placeholder="Nova tarefa..." />
        <button type="submit">Adicionar</button>
      </form>

      {/* Listagem com os botões de Editar e Deletar */}
      <ul>
        {tarefas.map(tarefa => (
          <li key={tarefa.id} style={{ textDecoration: tarefa.concluida ? 'line-through' : 'none' }}>
            <span onClick={() => handleAlternarConcluida(tarefa.id, tarefa.concluida)}>
              {tarefa.titulo}
            </span>
            <button onClick={() => handleDeletar(tarefa.id)}>❌ Deletar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}