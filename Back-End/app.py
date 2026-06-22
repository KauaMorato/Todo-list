from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
import jwt
from datetime import datetime, timedelta

app = Flask(__name__)
# Permite que o seu React (mesmo rodando em outra porta) acesse o Flask
CORS(app, resources={r"/*": {"origins": "*"}})

# Configurações de Segurança
SECRET_KEY = "MINHA_CHAVE_SECRETA_DO_PROJETO_ED"

# Função para conectar no MySQL
def get_db_connection():
    return pymysql.connect(
        host="localhost",
        user="root",          # Seu usuário do MySQL
        password="@Mello2026",  # Sua senha do MySQL
        database="prova_todolist",
        cursorclass=pymysql.cursors.DictCursor
    )

# Função auxiliar para proteger as rotas e descobrir qual usuário está logado
def obter_usuario_id():
    print("DEBUG: Iniciando obter_usuario_id()")
    auth_header = request.headers.get('Authorization')
    print(f"DEBUG: auth_header = {auth_header}")
    if not auth_header or not auth_header.startswith('Bearer '):
        print("DEBUG: auth_header vazio ou não começa com 'Bearer '")
        return None
    
    token = auth_header.split(" ")[1]
    print(f"DEBUG: token extraído = {token}")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        print(f"DEBUG: payload decodificado = {payload}")
        return payload["usuario_id"]
    except Exception as e:
        print(f"DEBUG: Erro ao decodificar token: {e}")
        return None

# ==================== ROTAS DE AUTENTICAÇÃO ====================

@app.route('/cadastro', methods=['POST'])
def cadastro():
    dados = request.get_json()
    nome = dados.get('nome')
    email = dados.get('email')
    senha = dados.get('senha')

    db = get_db_connection()
    try:
        with db.cursor() as cursor:
            # Verifica se o e-mail já existe
            cursor.execute("SELECT id FROM usuarios WHERE email = %s", (email,))
            if cursor.fetchone():
                return jsonify({"error": "E-mail já cadastrado"}), 400
            
            # Insere o novo usuário
            cursor.execute("INSERT INTO usuarios (nome, email, senha) VALUES (%s, %s, %s)", (nome, email, senha))
            db.commit()
        return jsonify({"message": "Usuário cadastrado com sucesso!"}), 201
    finally:
        db.close()

@app.route('/login', methods=['POST'])
def login():
    dados = request.get_json()
    email = dados.get('email')
    senha = dados.get('senha')

    db = get_db_connection()
    try:
        with db.cursor() as cursor:
            cursor.execute("SELECT id, senha FROM usuarios WHERE email = %s", (email,))
            usuario = cursor.fetchone()

            if not usuario or usuario['senha'] != senha:
                return jsonify({"error": "E-mail ou senha incorretos"}), 401

            # Gera o Token JWT válido por 24 horas
            token = jwt.encode({
                'usuario_id': usuario['id'],
                'exp': datetime.utcnow() + timedelta(hours=24)
            }, SECRET_KEY, algorithm="HS256")

            return jsonify({"token": token}), 200
    finally:
        db.close()

# ==================== CRUD DE TAREFAS ====================

@app.route('/tarefas', methods=['GET'])
def listar_tarefas():
    usuario_id = obter_usuario_id()
    if not usuario_id:
        return jsonify({"error": "Não autorizado"}), 401

    db = get_db_connection()
    try:
        with db.cursor() as cursor:
            # REGRA DE NEGÓCIO: Só puxa tarefas do usuário logado
            cursor.execute("SELECT * FROM tarefas WHERE usuario_id = %s", (usuario_id,))
            tarefas = cursor.fetchall()
            return jsonify(tarefas), 200
    finally:
        db.close()

@app.route('/tarefas', methods=['POST'])
def criar_tarefa():
    usuario_id = obter_usuario_id()
    if not usuario_id:
        return jsonify({"error": "Não autorizado"}), 401

    dados = request.get_json()
    titulo = dados.get('titulo')

    db = get_db_connection()
    try:
        with db.cursor() as cursor:
            cursor.execute("INSERT INTO tarefas (titulo, usuario_id) VALUES (%s, %s)", (titulo, usuario_id))
            db.commit()
        return jsonify({"message": "Tarefa criada!"}), 201
    finally:
        db.close()

@app.route('/tarefas/<int:id>', methods=['PUT'])
def atualizar_tarefa(id):
    usuario_id = obter_usuario_id()
    if not usuario_id:
        return jsonify({"error": "Não autorizado"}), 401

    dados = request.get_json()
    concluida = dados.get('concluida')

    db = get_db_connection()
    try:
        with db.cursor() as cursor:
            # Segurança: Garante que a tarefa pertence ao usuário
            cursor.execute("SELECT id FROM tarefas WHERE id = %s AND usuario_id = %s", (id, usuario_id))
            if not cursor.fetchone():
                return jsonify({"error": "Tarefa não encontrada ou acesso negado"}), 404

            cursor.execute("UPDATE tarefas SET concluida = %s WHERE id = %s", (concluida, id))
            db.commit()
        return jsonify({"message": "Tarefa atualizada!"}), 200
    finally:
        db.close()

@app.route('/tarefas/<int:id>', methods=['DELETE'])
def deletar_tarefa(id):
    usuario_id = obter_usuario_id()
    if not usuario_id:
        return jsonify({"error": "Não autorizado"}), 401

    db = get_db_connection()
    try:
        with db.cursor() as cursor:
            # Segurança: Garante que a tarefa pertence ao usuário
            cursor.execute("SELECT id FROM tarefas WHERE id = %s AND usuario_id = %s", (id, usuario_id))
            if not cursor.fetchone():
                return jsonify({"error": "Tarefa não encontrada ou acesso negado"}), 404

            cursor.execute("DELETE FROM tarefas WHERE id = %s", (id,))
            db.commit()
        return jsonify({"message": "Tarefa deletada!"}), 200
    finally:
        db.close()

# Inicia o servidor liberando o acesso externo na porta 5000
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

# código feito por Kauã Morato e Agnaldo