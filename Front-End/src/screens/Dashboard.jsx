import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

function Dashboard({ deslogar }) {
  const [tarefas, setTarefas] = useState([]);
  const [novaTarefa, setNovaTarefa] = useState('');

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
      if (err.response?.status === 401) {
        handleSair();
      } else {
        Alert.alert('Erro', 'Não foi possível carregar as tarefas.');
      }
    }
  };

  const adicionarTarefa = async () => {
    if (!novaTarefa.trim()) {
      Alert.alert('Aviso', 'Digite uma tarefa antes de adicionar.');
      return;
    }

    try {
      console.log('DEBUG: Adicionando tarefa:', novaTarefa);
      await api.post('/tarefas', { titulo: novaTarefa });
      setNovaTarefa('');
      carregarTarefas();
    } catch (err) {
      console.log('DEBUG: Erro ao adicionar tarefa:', err.response?.data || err.message);
      Alert.alert('Erro', 'Erro ao adicionar tarefa');
    }
  };

  const alternarConclusao = async (id, concluidaAtual) => {
    try {
      console.log('DEBUG: Alternando conclusão da tarefa:', id);
      await api.put(`/tarefas/${id}`, { concluida: !concluidaAtual });
      carregarTarefas();
    } catch (err) {
      console.log('DEBUG: Erro ao atualizar tarefa:', err.response?.data || err.message);
      Alert.alert('Erro', 'Erro ao atualizar tarefa');
    }
  };

  const deletarTarefa = async (id) => {
    try {
      console.log('DEBUG: Deletando tarefa:', id);
      await api.delete(`/tarefas/${id}`);
      carregarTarefas();
    } catch (err) {
      console.log('DEBUG: Erro ao deletar tarefa:', err.response?.data || err.message);
      Alert.alert('Erro', 'Erro ao deletar tarefa');
    }
  };

  const handleSair = async () => {
    await AsyncStorage.removeItem('token');
    deslogar();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Minhas Tarefas</Text>
        <TouchableOpacity style={styles.sairButton} onPress={handleSair}>
          <Text style={styles.sairTexto}>Sair</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formulario}>
        <TextInput
          style={styles.input}
          value={novaTarefa}
          onChangeText={setNovaTarefa}
          placeholder="Nova tarefa..."
          placeholderTextColor="#666"
        />
        <TouchableOpacity style={styles.adicionarButton} onPress={adicionarTarefa}>
          <Text style={styles.adicionarTexto}>+</Text>
        </TouchableOpacity>
      </View>

      {tarefas.map((tarefa) => (
        <View key={tarefa.id} style={styles.tarefaItem}>
          <TouchableOpacity
            style={styles.tarefaTextoWrapper}
            onPress={() => alternarConclusao(tarefa.id, tarefa.concluida)}
          >
            <Text style={[styles.tarefaTexto, tarefa.concluida && styles.tarefaConcluida]}>
              {tarefa.titulo}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deletarTarefa(tarefa.id)}>
            <Text style={styles.deletarTexto}>X</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f2f5',
    minHeight: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  sairButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  sairTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
  formulario: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginRight: 10,
  },
  adicionarButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 18,
    borderRadius: 8,
    justifyContent: 'center',
  },
  adicionarTexto: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  tarefaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  tarefaTextoWrapper: {
    flex: 1,
    marginRight: 10,
  },
  tarefaTexto: {
    fontSize: 16,
    color: '#333',
  },
  tarefaConcluida: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  deletarTexto: {
    color: '#dc3545',
    fontWeight: 'bold',
  },
});

/* Código feito por Kauã e Agnaldo */
export default Dashboard;
