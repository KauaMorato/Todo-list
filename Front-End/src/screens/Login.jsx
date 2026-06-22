import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert,
  KeyboardAvoidingView, Platform,
} from "react-native";
import api from "../services/api";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !senha)
      return Alert.alert("Atenção", "Preencha todos os campos.");

    setLoading(true);
    try {
      const res = await api.post("/login", { email, senha });
      const { token } = res.data;
      navigation.replace("Dashboard", { token });
    } catch (err) {
      Alert.alert("Erro", err?.response?.data?.error || "Falha na conexão.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.titulo}>TODO-LIST</Text>
      <Text style={styles.subtitulo}>Entre na sua conta</Text>

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
        onPress={handleLogin}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.botaoTexto}>Entrar</Text>
        }
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
        <Text style={styles.link}>
          Não tem conta?{" "}
          <Text style={styles.linkDestaque}>Cadastre-se</Text>
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