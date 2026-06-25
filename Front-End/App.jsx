import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, TextInput,
  TouchableOpacity, FlatList, ActivityIndicator, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.15.10:5000';

export default function App() {
  const [tela, setTela] = useState('login');
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [tarefas, setTarefas] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [loading, setLoading] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [textoEditado, setTextoEditado] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('token').then(t => {
      if (t) { setToken(t); setTela('tarefas'); }
    });
  }, []);

  useEffect(() => {
    if (token) carregarTarefas();
  }, [token]);

  const headers = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  async function handleLogin() {
    if (!email || !senha) return Alert.alert('Atenção', 'Preencha todos os campos.');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });
      const dados = await res.json();
      if (!res.ok) return Alert.alert('Erro', dados.error || 'Falha no login.');
      await AsyncStorage.setItem('token', dados.token);
      setToken(dados.token);
      setTela('tarefas');
    } catch {
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  }

  async function handleCadastro() {
    if (!nome || !email || !senha) return Alert.alert('Atenção', 'Preencha todos os campos.');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/cadastro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
      });
      const dados = await res.json();
      if (!res.ok) return Alert.alert('Erro', dados.error || 'Falha no cadastro.');
      Alert.alert('Sucesso!', 'Conta criada. Faça login.', [
        { text: 'OK', onPress: () => setTela('login') }
      ]);
    } catch {
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await AsyncStorage.removeItem('token');
    setToken(null);
    setEmail('');
    setSenha('');
    setNome('');
    setTela('login');
  }

  async function carregarTarefas() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/tarefas`, { headers: headers() });
      const dados = await res.json();
      setTarefas(dados);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar as tarefas.');
    } finally {
      setLoading(false);
    }
  }

  async function adicionarTarefa() {
    if (!titulo.trim()) return Alert.alert('Atenção', 'Digite o título da tarefa.');
    try {
      const res = await fetch(`${API_URL}/tarefas`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ titulo: titulo.trim() })
      });
      if (res.ok) { setTitulo(''); carregarTarefas(); }
    } catch {
      Alert.alert('Erro', 'Não foi possível criar a tarefa.');
    }
  }

  async function alternarConcluida(tarefa) {
    try {
      await fetch(`${API_URL}/tarefas/${tarefa.id}`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify({ concluida: !tarefa.concluida })
      });
      carregarTarefas();
    } catch {
      Alert.alert('Erro', 'Não foi possível atualizar.');
    }
  }

  async function salvarEdicao() {
    if (!textoEditado.trim()) return;
    try {
      await fetch(`${API_URL}/tarefas/${editandoId}`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify({ titulo: textoEditado.trim() })
      });
      setEditandoId(null);
      setTextoEditado('');
      carregarTarefas();
    } catch {
      Alert.alert('Erro', 'Não foi possível editar.');
    }
  }

  async function deletarTarefa(id) {
    Alert.alert('Apagar', 'Remover esta tarefa?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Apagar', style: 'destructive', onPress: async () => {
          await fetch(`${API_URL}/tarefas/${id}`, { method: 'DELETE', headers: headers() });
          carregarTarefas();
        }
      }
    ]);
  }

  // ===== TELA DE LOGIN =====
  if (tela === 'login') {
    return (
      <View style={s.container}>
        <Text style={s.titulo}>📝 To-Do List</Text>
        <Text style={s.subtitulo}>Entre na sua conta</Text>
        <TextInput style={s.input} placeholder="E-mail" placeholderTextColor="#999"
          keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
        <TextInput style={s.input} placeholder="Senha" placeholderTextColor="#999"
          secureTextEntry value={senha} onChangeText={setSenha} />
        <TouchableOpacity style={[s.botao, loading && { opacity: 0.6 }]} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.botaoTexto}>Entrar</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTela('cadastro')}>
          <Text style={s.link}>Não tem conta? <Text style={s.linkDestaque}>Cadastre-se</Text></Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ===== TELA DE CADASTRO =====
  if (tela === 'cadastro') {
    return (
      <View style={s.container}>
        <Text style={s.titulo}>Criar conta</Text>
        <Text style={s.subtitulo}>Rápido e gratuito</Text>
        <TextInput style={s.input} placeholder="Nome" placeholderTextColor="#999"
          value={nome} onChangeText={setNome} />
        <TextInput style={s.input} placeholder="E-mail" placeholderTextColor="#999"
          keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
        <TextInput style={s.input} placeholder="Senha" placeholderTextColor="#999"
          secureTextEntry value={senha} onChangeText={setSenha} />
        <TouchableOpacity style={[s.botao, loading && { opacity: 0.6 }]} onPress={handleCadastro} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.botaoTexto}>Cadastrar</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTela('login')}>
          <Text style={s.link}>Já tem conta? <Text style={s.linkDestaque}>Entrar</Text></Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ===== TELA DE TAREFAS =====
  return (
    <View style={s.tela}>
      <View style={s.header}>
        <Text style={s.headerTitulo}>Minhas Tarefas</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={s.sair}>Sair</Text>
        </TouchableOpacity>
      </View>

      <View style={s.inputRow}>
        <TextInput style={s.inputTarefa} placeholder="Nova tarefa..."
          placeholderTextColor="#999" value={titulo} onChangeText={setTitulo}
          onSubmitEditing={adicionarTarefa} />
        <TouchableOpacity style={s.addBtn} onPress={adicionarTarefa}>
          <Text style={s.addBtnTexto}>+</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color="#4f6ef7" size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={tarefas}
          keyExtractor={(item) => String(item.id)}
          ListEmptyComponent={<Text style={s.vazio}>Nenhuma tarefa ainda. 🎯</Text>}
          renderItem={({ item }) => (
            <View style={s.card}>
              {editandoId === item.id ? (
                <View style={{ flex: 1, flexDirection: 'row', gap: 8 }}>
                  <TextInput style={[s.inputTarefa, { flex: 1 }]}
                    value={textoEditado} onChangeText={setTextoEditado} autoFocus />
                  <TouchableOpacity style={s.salvarBtn} onPress={salvarEdicao}>
                    <Text style={{ color: '#fff', fontWeight: '700' }}>✓</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <TouchableOpacity onPress={() => alternarConcluida(item)}>
                    <Text style={s.check}>{item.concluida ? '✅' : '⬜'}</Text>
                  </TouchableOpacity>
                  <Text style={[s.tarefaTexto, item.concluida && s.concluida]}>
                    {item.titulo}
                  </Text>
                  <TouchableOpacity onPress={() => { setEditandoId(item.id); setTextoEditado(item.titulo); }}>
                    <Text style={s.icone}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deletarTarefa(item.id)}>
                    <Text style={s.icone}>🗑️</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', justifyContent: 'center', paddingHorizontal: 28 },
  titulo: { fontSize: 32, fontWeight: '800', color: '#fff', marginBottom: 4 },
  subtitulo: { fontSize: 14, color: '#666', marginBottom: 36 },
  input: { backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#2a2a2a', borderRadius: 10,
    paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: '#fff', marginBottom: 14 },
  botao: { backgroundColor: '#4f6ef7', borderRadius: 10, paddingVertical: 16, alignItems: 'center', marginTop: 4 },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: '700' },
  link: { color: '#666', textAlign: 'center', marginTop: 24 },
  linkDestaque: { color: '#4f6ef7', fontWeight: '700' },
  tela: { flex: 1, backgroundColor: '#0f0f0f', paddingTop: 60, paddingHorizontal: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  headerTitulo: { fontSize: 26, fontWeight: '800', color: '#fff' },
  sair: { color: '#4f6ef7', fontWeight: '600' },
  inputRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  inputTarefa: { flex: 1, backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#2a2a2a',
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: '#fff' },
  addBtn: { backgroundColor: '#4f6ef7', borderRadius: 10, width: 48, justifyContent: 'center', alignItems: 'center' },
  addBtnTexto: { color: '#fff', fontSize: 28, fontWeight: '300' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1a1a',
    borderRadius: 10, padding: 14, marginBottom: 10, gap: 10 },
  check: { fontSize: 20 },
  tarefaTexto: { flex: 1, fontSize: 15, color: '#ddd' },
  concluida: { textDecorationLine: 'line-through', color: '#444' },
  icone: { fontSize: 16, padding: 4 },
  salvarBtn: { backgroundColor: '#4f6ef7', borderRadius: 8, paddingHorizontal: 14, justifyContent: 'center' },
  vazio: { color: '#444', textAlign: 'center', marginTop: 60, fontSize: 15 },
});