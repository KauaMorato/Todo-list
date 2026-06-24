# 🔧 SOLUÇÃO DO ERRO 500

## O Problema
Você tinha uma **incompatibilidade de versão**:
- `app.json` estava com SDK **54.0.0** ❌
- `package.json` estava com Expo **56.0.0** ❌

Isso fez o Metro quebrar e gerar o erro 500.

## ✅ O que já foi feito
- ✓ Atualizei `app.json` para SDK **56.0.0** (agora compatível com Expo 56)
- ✓ Limpei node_modules e package-lock.json

## 📋 O que você precisa fazer AGORA

### PASSO 1: Instalar Node.js
Se você ainda **NÃO TEM** Node.js instalado:
1. Acesse: https://nodejs.org/
2. Baixe a versão **LTS** (versão estável)
3. Instale normalmente (recomendo deixar tudo padrão)
4. **REINICIE O COMPUTADOR** após instalar

### PASSO 2: Reinstalar dependências
Abra o terminal/cmd na pasta do projeto e execute:
```bash
npm install
```

### PASSO 3: Limpar cache do Expo
```bash
npx expo start --clear
```

### PASSO 4: Testar
- Pressione `a` para abrir no Android
- Ou `i` para iOS
- Ou `w` para web

## 🆘 Se continuar com erro
Se ainda receber erro 500 depois de fazer tudo acima:

1. Delete novamente tudo:
```bash
rmdir /s /q node_modules
del package-lock.json
```

2. Instale do zero:
```bash
npm install
```

3. Limpe o cache do Metro:
```bash
npx expo start --clear
```

4. Teste novamente

## 📝 Checklist Final
- [ ] Node.js instalado e funcionando (`node --version` e `npm --version` no terminal)
- [ ] Entrei na pasta `Front-End`
- [ ] Rodei `npm install` com sucesso
- [ ] Rodei `npx expo start --clear`
- [ ] App funcionando no celular/emulador

**Boa sorte! Você consegue! 💪**
