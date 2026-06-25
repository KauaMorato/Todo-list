# Todo-list
Atividade de aplicação móvel, usando auxilio de uma IA (Gemini e Claude Clode) para ajudar a proporcionar o projeto
- Linguagens usadas - MySQL, Python, React Native

## Parte do Back-end
    py -m pip install flask flask-cors PyJWT pymysql
        Comando usado para baixar o flask

        Tudo que está por trás da página: Banco de dados (MySQL) e Python
        

## Parte do Front-End
    winget install OpenJS.NodeJS (Comando usado para baixar o Node.js)

    npm install @react-native-async-storage/async-storage axios
    npm install expo
    npm install @react-navigation/native @react-navigation/native-stack
    npx expo install react-native-screens react-native-safe-area-context
    npx expo doctor --fix-dependencies

## Execução do Projeto
    cd Back-End
    python app.py

    cd Front-End
    npx expo start
    npx expo start -c (serve para inicar o projeto excluindo o cache)
    npx expo start --lan (altera o endereço ip - Método Bundler)

        Primeiro se deve abrir a pasta do Back-End, em seguida ligar o servidor que inclui o mysql nele

        Em seguida acessar a pasta do Front-End e ligar o servidor, depois é só rodar o código no Android Studio ou acessar o QR Code que aparece no terminal