import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import api from '../services/api';

export default function Cadastro({ navegarParaLogin }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleCadastro = async () => {
    if (!nome || !email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }
    try {
      console.log('DEBUG: Enviando dados para cadastro:', { nome, email, senha });
      const response = await api.post('/cadastro', { nome, email, senha });
      console.log('DEBUG: Resposta do servidor:', response.data);
      Alert.alert('Sucesso', 'Conta criada com sucesso!', [{ text: 'OK', onPress: navegarParaLogin }]);
    } catch (error) {
      console.log('DEBUG: Erro na requisição:', error.response?.data || error.message);
      const mensagemErro = error.response?.data?.error || error.message || 'Erro ao cadastrar usuário';
      Alert.alert('Erro', mensagemErro);
    }
  };
/* Código feito por Kauã e Agnaldo */
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Criar Conta ✨</Text>
      <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry />
      
      <TouchableOpacity style={styles.botao} onPress={handleCadastro}>
        <Text style={styles.textoBotao}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={navegarParaLogin}>
        <Text style={styles.link}>Já tem uma conta? Faça Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  titulo: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 15, borderRadius: 8, marginBottom: 15, backgroundColor: '#fff' },
  botao: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  textoBotao: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  link: { color: '#007bff', textAlign: 'center', marginTop: 20, fontWeight: '600' }
});
/* Código feito por Kauã e Agnaldo */