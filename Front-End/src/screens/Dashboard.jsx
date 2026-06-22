import React from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
} from "react-native";

export default function Dashboard({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Bem-vindo! 👋</Text>
      <Text style={styles.subtitulo}>Você está logado com sucesso.</Text>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.replace("Login")}
      >
        <Text style={styles.botaoTexto}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: "#0f0f0f",
    justifyContent: "center", alignItems: "center", paddingHorizontal: 28,
  },
  titulo: { fontSize: 28, fontWeight: "800", color: "#fff", marginBottom: 8 },
  subtitulo: { fontSize: 15, color: "#666", marginBottom: 48 },
  botao: {
    backgroundColor: "#4f6ef7", borderRadius: 10,
    paddingVertical: 14, paddingHorizontal: 40,
  },
  botaoTexto: { color: "#fff", fontSize: 16, fontWeight: "700" },
});