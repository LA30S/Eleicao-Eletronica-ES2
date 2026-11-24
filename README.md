### **Nome do Projeto**: Simulador de Eleição Eletrônica  
  
### **Tecnologias Utilizadas - Geral**  
- Node.js v.24.21.0  
- Linguagem: TypeScript/JavaScript  
- Containerização e Infraestrutura: Docker e Docker compose  
  
### **Tecnologias Utilizadas - Backend**  
- Framework Web: Express  
- Banco de Dados: MongoDB  
- ODM(Object Data Modeling): Mongoose  
- Autenticação: JWT(JSON Web Token)  
- Criptografia: Bycrptjs  
- Segurança: CORS  
- Documentação da API: Swagger  
  
### **Tecnologias Utilizadas - Frontend**  
- Framework IU: Ionic  
- Framework Web: Angular  
- Integração e exportação de aplicativo: Capacitor  
  
  
  
### **Arquitetura do Sistema:**  
A arquitetura do projeto está organizada baseada em containers, isolando o frontend, o backend e o banco de dados em containers isolados,   utilizando o Docker Compose para gerenciá-los, com a comunicação ocorrendo por meio de portas de localhost:  
  
- Container Frontend (Ionic): Intereface do aplicativo para enviar requisições para a API.  
- Container Backend (Node.js/Express): Endpoints REST e regras de negócio organizadas em código.  
- Container Banco de Dados (MongoDB): Armazenamento e persistência de ados do sistema.  
```text
+-------------------+       HTTP/JSON       +-------------------+       Mongoose      +-------------------+  
|  Container Front  | ───────────────────▶ |  Container Back   | ──────────────────▶ |  Container Banco  |  
|      (Ionic)      | ◀─────────────────── | (Node + Express)  | ◀────────────────── |     (MongoDB)     |  
+-------------------+                       +-------------------+                     +-------------------+  
```
  
### Arquitetur do Backend (MSC)  
O sistema é organizado em camadas baseado em um padrão de Rotas, Controladores e Modelos, sendo semelhante ao modelo MVC porém voltado para a estrutura da API;  
```text
+-----------------+        +----------------+         +------------+        +----------------+        +---------+    
| Requisição HTTP |──────▶| Rotas/Middleware |──────▶| Controller |──────▶| Mongoose Model |──────▶| MongoDB |  
+-----------------+        +----------------+         +------------+        +----------------+        +---------+  
```
  
- Rotas e Middleware(Express, CORS e JWT)> Ponto de entrada das requsições da API. CORS realiza comunicação com Ionic. As rotas direcionam ao endpoint da API. O middleware valida o JWT antes de liberar acesso.  
- Controllers(Controladores): Extrai dados da requisição, utilizando da lógica das regras de negócio para processar a requisição, devolvendo uma resposta em formato JSON correspondente.  
- Models (Mongoose): Camada de persistência que define a estrutura do armazenamento de dados no documento, realiza a comunicação com MongoDB  
  
  
### **Modularização:**  
**Monorepo:**  
As estruturas do backend e do frontend são distribuídas em diretórios diferentes, realizando uma separação de conceitos onde o frontend e o backend podem se comunicar mas seus módulos próprios estão isolados:  
```text
EleicaoEletronica/  
├── .github/                 # Configurações do github  
├── backend/                 # Diretório de módulos do backend  
├── EleicaoEletronica/       # Diretório de módulos do frontend  
├── node_modules/            # Módulos do NodeJS  
├── .gitignore               # Lista de arquivos ignorados pelo git  
├── docker-compose.yml       # Arquivo para utilização e gerenciamento do dockercompose  
├── package-lock.json        # Lista de dependências exatas do projeto  
├── package.json             # Lista de dependências do projeto  
└── README.md                #Este documento contendo as informações do projeto   
``` 
  
**Backend:**  
O código do backend é organizado de forma modular orientada a funcionalidades (Feature-based), agrupando as rotas, controladores e os modelos de cada funcionalidade de acordo com o minimundo:  
```text
src/  
├── controllers/                  # Diretório de Controladores  
│    ├── candidatoController.js   # Controlador do candidato  
│    ├── chefeController.js       # Controlador do chefe de seção  
│    ├── eleicaoController.js     # Controlador da eleição  
│    ├── usuarioController.js     # Controlador do eleitor e funcionalidades comuns aos usuários(login)  
│    └── votoController.js        # Controlador do voto  
├── middlewares/               # Diretório de middleware  
│   └── auth.middleware.js     # Middleware de validação de token de usuário  
├── models/                  # Modelos de dados do Mongoose para o MongoDB  
│    ├── Candidato.js        # Modelo de dados do candidato  
│    ├── Chefe.js            # Modelo de dados do chefe de seção  
│    ├── Eleicao.js          # Modelo de dados da eleição  
│    ├── Usuario.js          # Modelo de dados do eleitor  
│    └── Voto.js             # Modelo de dados do voto  
├── routes/                     # Diretório de rotas de funcionalidades da API  
│    ├── candidatoRoutes.js     # Rotas de funcionalidades do candidato  
│    ├── chefeRoutes.js         # Rotas de funcionalidades do chefe de seção  
│    ├── eleicaoRoutes.js       # Rotas de funcionalidades da eleição  
│    ├── usuarioRoutes.js       # Rotas de funcionalidades do eleitor  
│    └── votoRoutes.js          # Rotas de funcionalidades do voto  
├── server.js              # Configuração de servidor com acesso ao Ionic e Mongo. Rotas gerais da API e Swagger  
└── swagger.js             # Estrutura de documentação da API com Swagger  
```
  
### **Modelagem de dados com Mongoose e MongoDB:**  
O banco de dados utilizado pela aplicação é o MongoDB, um banco não-relacional (NoSQL) orientado a documentos. O gerenciamento do banco com a aplicação ocorre por meio do Mongoose. Abaixo estão as estruturas dos modelos utilizados para cada tipo de perfil e funcionalidades do sistema:  

**Candidato:**
```text  
{   nome: {type: String},  
    numero:{type: Number},  
    login:{type: String},  
    senha:{type: String},  
    cargo:{type: String,  
        enum: {  
      values: ['A definir', 'Deputado Estadual', 'Deputado Federal', 'Senador', 'Governador', 'Presidente da República'],  
        }},    
    partido:{type: String},  
    qtdVotos:{type: Number}}  
```
  
**Chefe de Seção:**
```text   
{   nome:{type: String},  
    login:{type: String},  
    senha:{type: String}  
}  
```

**Eleição:**   
```text
{  
    data: {type: Date},  
    turno:{type: Number},  
    abertura:{type: String},  
        encerramento:{type: Strin},  
    situacao:{type: String  
    enum: {  
      values: ['AGENDADA', 'ABERTA', 'ENCERRADA'],  
      message: '{VALUE} não é uma situalção válida',  
       default: 'AGENDADA'  
    }  
    }  
}  
```

**Eleitor:**  
```text
{  
  login: { type: String },  
  senha: { type: String},  
  votou: { type: Boolean},  
  participacoes: [{  
      eleicao: { type: mongoose.Schema.Types.ObjectId, ref: 'Eleicao'},  
      cargo: { type: String} }]  
}  
```

**Voto:**
```text   
{  
    eleicao: { type: mongoose.Schema.Types.ObjectId, ref: 'Eleicao'},  
  candidato: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidato'},  
  numCandidato: { type: Number},  
  cargo: { type: String, required: true }  
}  
```

### **Comandos para rodar a aplicação:**  
  
**Docker compose build** Constrói as imagens da aplicação no docekr  
**Docker compose up** Sobe os conteiners para rodar a aplicação  
**Docker compose down** Interrompe a aplicação  
  
  
### **Links da aplicação:**  

**Aplicação:**http://localhost:8100  

**API**: http://localhost:3000/api  

**Documentação do Swagger:** http://localhost:3000/api-docs/  

**Documentação do Swagger para testes:** http://localhost:3000/api/swagger.json  
   
**MongoDB**: mongodb://localhost:27017/meubanco  