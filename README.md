# PocketDB API

**O backend genérico que acelera seus projetos pessoais**

Pare de reinventar a roda! O PocketDB é uma API REST pronta para usar que elimina a necessidade de criar um backend do zero para cada novo projeto. Com um sistema de isolamento por projeto e armazenamento flexível, você pode focar no que realmente importa: construir sua aplicação.

## 💡 Por que PocketDB?

**🕐 Economize Tempo** - Não perca mais horas configurando Express, MongoDB, autenticação e CRUD básico  
**💰 Economize Recursos** - Uma única instância serve múltiplos projetos simultaneamente  
**🚀 Prototipe Rápido** - Do zero ao MVP em minutos, não semanas  
**🔒 Isolamento Seguro** - Cada projeto tem seus dados completamente isolados  
**📱 Qualquer Frontend** - React, Vue, Flutter, Mobile - funciona com qualquer client  
**🎯 Foco no que Importa** - Dedique seu tempo à lógica de negócio, não à infraestrutura

## 🎯 Como Funciona

### Um Backend, Múltiplos Projetos

Cada projeto que você criar recebe um **Project ID** único e um **token de acesso** exclusivo. Isso garante que:

- ✅ **App de Tarefas** usa `projectID: "todo-app-2024"`
- ✅ **E-commerce Pessoal** usa `projectID: "minha-loja"`  
- ✅ **Blog** usa `projectID: "meu-blog"`
- ✅ **App Fitness** usa `projectID: "fitness-tracker"`

Todos rodando na **mesma instância** do PocketDB, mas com dados **completamente isolados**.

### Collections como Tabelas

Dentro de cada projeto, você organiza seus dados em "collections" (como tabelas no SQL):

```bash
# Projeto: E-commerce
/kv/produtos/create     # Cadastrar produtos
/kv/clientes/create     # Cadastrar clientes  
/kv/pedidos/create      # Cadastrar pedidos

# Projeto: Blog
/kv/posts/create        # Criar posts
/kv/comentarios/create  # Criar comentários
/kv/categorias/create   # Criar categorias
```

### Casos de Uso Reais

**📱 App Mobile de Tarefas**
```typescript
// Criar tarefa
POST /kv/tasks/create
{ "data": { "title": "Comprar leite", "done": false, "priority": "high" } }

// Listar tarefas pendentes  
GET /kv/tasks/get-all?done=false
```

**🛒 E-commerce Simples**
```typescript
// Cadastrar produto
POST /kv/products/create  
{ "data": { "name": "Camiseta", "price": 29.90, "stock": 100 } }

// Criar pedido
POST /kv/orders/create
{ "data": { "items": [...], "total": 59.80, "customer": "João" } }
```

**📝 Blog Pessoal**
```typescript
// Publicar post
POST /kv/posts/create
{ "data": { "title": "Meu primeiro post", "content": "...", "published": true } }

// Listar posts publicados
GET /kv/posts/get-all?published=true
```

## 🚀 Características Principais

- **🔐 Autenticação JWT** - Sistema seguro de controle de acesso por projeto
- **📦 Armazenamento Key-Value** - CRUD genérico para qualquer tipo de dados
- **⚡ TypeScript** - Tipagem completa e desenvolvimento produtivo
- **🗄️ MongoDB** - Banco NoSQL flexível com Mongoose
- **📤 Upload de Arquivos** - Suporte nativo para upload via Multer
- **🎨 Logs Coloridos** - Sistema de logging elegante com Chalk
- **🔄 Hot Reload** - Desenvolvimento ágil com Nodemon
- **📁 Estrutura Organizada** - Arquitetura limpa por recursos

## ⚡ Início Rápido (3 Passos)

### 1. Configure uma vez
```bash
git clone https://github.com/odutradev/pocketdb-api.git
cd pocketdb-api
npm install
cp .env.example .env
# Configure seu MongoDB no .env
npm run dev
```

### 2. Crie um projeto
```bash
npm run control-access
# Digite: meu-novo-projeto
# Digite: 365 (dias de validade)
# Copie o token gerado
```

### 3. Use em qualquer aplicação
```javascript
// No seu frontend (React, Vue, Flutter, etc.)
const API_URL = "http://localhost:1000"
const TOKEN = "seu-token-aqui"

// Criar dados
fetch(`${API_URL}/kv/usuarios/create`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'controlAccess': TOKEN
  },
  body: JSON.stringify({
    data: { nome: "João", email: "joao@email.com" }
  })
})

// Buscar dados  
fetch(`${API_URL}/kv/usuarios/get-all`, {
  headers: { 'controlAccess': TOKEN }
})
```

**Pronto!** Seu projeto já tem um backend completo funcionando.

## 💼 Cenários Perfeitos para PocketDB

**🎮 Protótipos e MVPs**  
Valide suas ideias rapidamente sem perder tempo com infraestrutura

**📱 Apps Pessoais**  
Agenda, finanças pessoais, diário, lista de compras, controle de hábitos

**🏠 Projetos Domésticos**  
Controle de estoque, gestão familiar, lista de filmes para assistir

**🎓 Projetos de Estudo**  
Foque em aprender frontend/mobile sem se preocupar com backend

**👨‍💻 Freelances Pequenos**  
Entregue MVPs para clientes em tempo recorde

**🧪 Testes de Conceito**  
Teste integrações, experimente tecnologias frontend

## 📋 Requisitos e Instalação

### Pré-requisitos
- Node.js 18+ 
- MongoDB (local ou Atlas)
- npm ou yarn

### Instalação do PocketDB

```bash
# 1. Clone e configure uma única vez
git clone https://github.com/odutradev/pocketdb-api.git
cd pocketdb-api
npm install

# 2. Configure sua conexão MongoDB
cp .env.example .env
# Edite o .env com seus dados do MongoDB

# 3. Inicie o servidor
npm run dev

# ✅ Pronto! Agora você tem um backend rodando
# que pode ser usado por quantos projetos quiser
```

## 🔧 Configuração

### Variáveis de Ambiente (.env)

```env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/
PRIVATE_ACCESS_TOKEN=<SHA-512-HASH>
PUBLIC_ACCESS_TOKEN=<SHA-256-HASH>
SECRET=<JWT-SECRET>
PRODUCTION=false
PORT=1000
```

### Geração de Tokens de Acesso

```bash
npm run control-access
```

Este comando irá gerar um token de acesso para seu projeto com validade customizável.

## 🏃‍♂️ Criando Seus Projetos

### Para Cada Novo Projeto

```bash
# 1. Gere um token exclusivo para o projeto
npm run control-access

# Exemplo de entrada:
# Insira o projectID: meu-app-tarefas
# Tempo de validade (em dias): 365

# 2. Use o token no seu frontend/mobile
# Cada projeto usa seu token exclusivo
# Os dados ficam completamente isolados
```

### Desenvolvimento vs Produção

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Produção
npm run build
npm start
```

### Múltiplos Projetos Simultâneos

O PocketDB foi projetado para servir múltiplos projetos ao mesmo tempo:

```javascript
// Projeto 1: App de Tarefas (React)
const TODO_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
const TODO_API = "http://localhost:1000"

// Projeto 2: E-commerce (Vue)  
const SHOP_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
const SHOP_API = "http://localhost:1000" // Mesma instância!

// Projeto 3: Blog (Flutter)
const BLOG_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
const BLOG_API = "http://localhost:1000" // Mesma instância!
```

## 💰 Vantagens Econômicas

### Uma Instância, Múltiplos Projetos

**Sem PocketDB:**
```
Projeto 1: Backend próprio (5-10 horas)
Projeto 2: Backend próprio (5-10 horas)  
Projeto 3: Backend próprio (5-10 horas)
Total: 15-30 horas + múltiplos servidores
```

**Com PocketDB:**
```
Setup inicial: 30 minutos
Projeto 1: Token + frontend (2 horas)
Projeto 2: Token + frontend (2 horas)
Projeto 3: Token + frontend (2 horas)
Total: 6.5 horas + 1 servidor apenas
```

### Economia Real

- **⏰ 80% menos tempo** desenvolvendo backends repetitivos
- **💸 75% menos custos** de servidor (uma instância para tudo)
- **🧠 100% do foco** na lógica de negócio da sua aplicação
- **🚀 10x mais rápido** para colocar MVPs no ar

## 📡 API Endpoints - Tudo que Você Precisa

### Sistema Base

```http
# Verificar se o PocketDB está funcionando
GET /ping

# Validar token de um projeto  
GET /validate/control-access
Headers: controlAccess: <token-do-projeto>
```

### CRUD Genérico (Funciona para Qualquer Dados)

Replace `:collection` com o nome da sua "tabela" (ex: users, tasks, products, posts, etc.)

#### Criar Dados
```http
POST /kv/:collection/create
Headers: controlAccess: <token-do-projeto>
Content-Type: application/json

{
  "data": {
    // Qualquer estrutura JSON que você quiser
    "nome": "João",
    "idade": 30,
    "ativo": true
  },
  "expiresInDays": 30 // Opcional: auto-deletar após N dias
}
```

#### Listar Dados (com Filtros e Paginação)
```http
GET /kv/:collection/get-all?page=1&limit=10
Headers: controlAccess: <token-do-projeto>

# Filtros dinâmicos funcionam automaticamente:
# /kv/users/get-all?status=active&city=São Paulo
# /kv/products/get-all?category=electronics&price=100
```

#### Buscar Item Específico
```http
GET /kv/:collection/get/:id
Headers: controlAccess: <token-do-projeto>
```

#### Atualizar Item
```http
PATCH /kv/:collection/update/:id
Headers: controlAccess: <token-do-projeto>
Content-Type: application/json

{
  "data": {
    "nome": "João Silva",
    "idade": 31
  }
}
```

#### Deletar Item
```http
DELETE /kv/:collection/delete/:id
Headers: controlAccess: <token-do-projeto>
```

#### Operações em Lote
```http
# Deletar toda uma "tabela" 
DELETE /kv/:collection/delete-all
Headers: controlAccess: <token-do-projeto>

# Deletar projeto inteiro (CUIDADO!)
DELETE /kv/project/delete-all
Headers: controlAccess: <token-do-projeto>
```

### Health Check

```http
GET /ping
```

### Validação de Token

```http
GET /validate/control-access
Headers: controlAccess: <seu-token>
```

### CRUD Genérico (Key-Value)

#### Criar Registro
```http
POST /kv/:collection/create
Headers: controlAccess: <seu-token>
Content-Type: application/json

{
  "data": {
    "nome": "João",
    "idade": 30,
    "email": "joao@email.com"
  },
  "expiresInDays": 30
}
```

#### Listar Todos os Registros
```http
GET /kv/:collection/get-all?page=1&limit=10&pagination=true
Headers: controlAccess: <seu-token>
```

#### Buscar por ID
```http
GET /kv/:collection/get/:id
Headers: controlAccess: <seu-token>
```

#### Atualizar Registro
```http
PATCH /kv/:collection/update/:id
Headers: controlAccess: <seu-token>
Content-Type: application/json

{
  "data": {
    "nome": "João Silva",
    "idade": 31
  }
}
```

#### Deletar Registro
```http
DELETE /kv/:collection/delete/:id
Headers: controlAccess: <seu-token>
```

#### Deletar Coleção Completa
```http
DELETE /kv/:collection/delete-all
Headers: controlAccess: <seu-token>
```

#### Deletar Projeto Completo
```http
DELETE /kv/project/delete-all
Headers: controlAccess: <seu-token>
```

## 🔐 Sistema de Isolamento por Projeto

### Como Funciona a Segurança

1. **Project ID único** - Cada projeto tem identificador exclusivo
2. **Token JWT dedicado** - Token independente com validade customizada  
3. **Isolamento automático** - Dados ficam invisíveis entre projetos
4. **Zero configuração** - Funciona automaticamente em todas as requisições

### Gerando Token para Novo Projeto

```bash
npm run control-access

# Input:
Insira o projectID: meu-ecommerce-2024
Tempo de validade (em dias): 365

# Output:  
Token criado com sucesso
token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Usando nos Seus Apps

```javascript
// Todo request precisa do header controlAccess
const headers = {
  'Content-Type': 'application/json',
  'controlAccess': 'seu-token-aqui'
}

// O PocketDB automaticamente:
// ✅ Valida o token
// ✅ Identifica o projeto  
// ✅ Isola os dados
// ✅ Retorna apenas dados do SEU projeto
```

## 🛡️ Isolamento Garantido

```javascript
// Projeto A: E-commerce (token_A)
POST /kv/products/create → Salva em: projeto_A.products

// Projeto B: Blog (token_B)  
POST /kv/products/create → Salva em: projeto_B.products

// ✅ Mesmo endpoint, dados completamente separados
// ✅ Projeto A nunca vê dados do Projeto B
// ✅ Impossível vazamento acidental
```

## 📁 Estrutura do Projeto

```
src/
├── assets/
│   └── config/          # Configurações globais
├── database/
│   ├── database.ts      # Conexão MongoDB
│   └── model/           # Schemas Mongoose
├── middlewares/
│   ├── controlAccess.ts # Autenticação JWT
│   ├── manageRequest.ts # Wrapper de requisições
│   └── upload.ts        # Upload de arquivos
├── resources/
│   └── kv/              # Lógica de negócio Key-Value
├── routes/
│   ├── index.ts         # Router principal
│   └── resources/       # Rotas por recurso
├── utils/
│   ├── functions/       # Funções utilitárias
│   ├── services/        # Serviços reutilizáveis
│   └── types/           # Tipos TypeScript
├── app.ts               # Configuração Express
└── server.ts            # Inicialização do servidor
```

## 🛠️ Desenvolvimento

### Scripts Disponíveis

```bash
npm run dev              # Modo desenvolvimento
npm run build            # Build para produção
npm run start            # Executar build
npm run control-access   # Gerar tokens de acesso
```

### Adicionando Novos Recursos

1. **Criar Model** em `src/database/model/`
2. **Criar Resource** em `src/resources/nomeRecurso/`
3. **Criar Router** em `src/routes/resources/`
4. **Registrar Router** em `src/routes/index.ts`

### Exemplo de Novo Recurso

```typescript
// src/database/model/user.ts
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    projectID: { type: String, required: true }
});

// src/resources/user/user.resource.ts
const userResource = {
    create: async ({ data, ids, manageError }: ManageRequestBody) => {
        // Implementação CRUD
    }
};

// src/routes/resources/user.router.ts
userRouter.post("/", [controlAccess], manageRequest(userResource.create));
```

## 📊 Headers de Resposta

Todas as respostas incluem headers informativos:

```http
api-database-name: <nome-do-cluster>
api-version: <versão-da-api>
api-mode: <developing|production>
projectID: <id-do-projeto>
```

## 🔍 Filtros e Paginação

### Paginação
```http
GET /kv/users/get-all?page=1&limit=10&pagination=true
```

### Filtros Dinâmicos
```http
GET /kv/users/get-all?name=João&status=active
```

## 📤 Upload de Arquivos

Para recursos que necessitam upload, configure o middleware:

```typescript
router.post("/upload", [controlAccess, upload.array("files")], 
    manageRequest(resourceName.upload, { upload: true })
);
```

## 🐛 Tratamento de Erros

A API retorna códigos de erro padronizados:

- `400` - Dados inválidos ou ausentes
- `401` - Não autorizado ou token inválido  
- `403` - Acesso negado
- `404` - Objeto não encontrado
- `500` - Erro interno do servidor

## 🔄 Versionamento

Use `npm run publish` para:
- Incrementar versão automaticamente
- Commit das mudanças
- Push para branch configurada

## 📄 Licença

ISC License - veja o arquivo LICENSE para detalhes.

## 🤝 Contribuindo

1. Faça fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/odutradev/pocketdb-api/issues)
- **Autor**: [odutradev](https://github.com/odutradev)

---

## 🎯 A Filosofia PocketDB

**"Pare de reinventar backends. Comece a construir produtos."**

O PocketDB elimina a barreira técnica que separa sua ideia da implementação. Não importa se você quer criar um app de finanças pessoais, um e-commerce para sua mãe, ou testar uma nova tecnologia frontend - seu backend já está pronto.

**Uma configuração. Infinitas possibilidades.**

## 🤝 Contribuindo

Ajude a tornar o PocketDB ainda melhor:

1. Faça fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/odutradev/pocketdb-api/issues)
- **Autor**: [odutradev](https://github.com/odutradev)

## 📄 Licença

ISC License - veja o arquivo LICENSE para detalhes.

---

**PocketDB API** - O backend que cresce com seus projetos. 🚀