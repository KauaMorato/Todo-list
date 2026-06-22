import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert,
  KeyboardAvoidingView, Platform,
} from "react-native";
import api from "../services/api";

export default function Cadastro({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCadastro() {
    if (!nome || !email || !senha)
      return Alert.alert("Atenção", "Preencha todos os campos.");

    setLoading(true);
    try {
      await api.post("/cadastro", { nome, email, senha });
      Alert.alert("Sucesso!", "Conta criada com sucesso.", [
        { text: "Fazer login", onPress: () => navigation.replace("Login") },
      ]);
    } catch (err) {
      Alert.alert("Erro", err?.response?.data?.error || "Falha ao cadastrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.titulo}>Criar conta</Text>
      <Text style={styles.subtitulo}>Rápido e gratuito</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        placeholderTextColor="#555"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#555"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#555"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity
        style={[styles.botao, loading && { opacity: 0.6 }]}
        onPress={handleCadastro}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.botaoTexto}>Cadastrar</Text>
        }
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>
          Já tem conta?{" "}
          <Text style={styles.linkDestaque}>Entrar</Text>
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: "#0f0f0f",
    justifyContent: "center", paddingHorizontal: 28,
  },
  titulo: { fontSize: 32, fontWeight: "800", color: "#fff", marginBottom: 4 },
  subtitulo: { fontSize: 14, color: "#666", marginBottom: 36 },
  input: {
    backgroundColor: "#1a1a1a", borderWidth: 1, borderColor: "#2a2a2a",
    borderRadius: 10, paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 15, color: "#fff", marginBottom: 14,
  },
  botao: {
    backgroundColor: "#4f6ef7", borderRadius: 10,
    paddingVertical: 16, alignItems: "center", marginTop: 4,
  },
  botaoTexto: { color: "#fff", fontSize: 16, fontWeight: "700" },
  link: { color: "#666", textAlign: "center", marginTop: 24 },
  linkDestaque: { color: "#4f6ef7", fontWeight: "700" },
});