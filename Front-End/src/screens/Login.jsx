import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export default function Login({ navegarParaCadastro, logarSucesso }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }
    try {
      const response = await api.post('/login', { email, senha });
      await AsyncStorage.setItem('token', response.data.token);
      logarSucesso();
    } catch (error) {
      Alert.alert('Erro', 'Email ou senha incorretos');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>To-Do List 📝</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry />
      
      <TouchableOpacity style={styles.botao} onPress={handleLogin}>
        <Text style={styles.textoBotao}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={navegarParaCadastro}>
        <Text style={styles.link}>Não tem uma conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}
/* Código feito por Kauã e Agnaldo */
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  titulo: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 15, borderRadius: 8, marginBottom: 15, backgroundColor: '#fff' },
  botao: { backgroundColor: '#007bff', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  textoBotao: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  link: { color: '#007bff', textAlign: 'center', marginTop: 20, fontWeight: '600' }
});