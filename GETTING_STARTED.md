# 🚀 OR Platform - Guia de Início Rápido

## 📋 Pré-requisitos

- Docker e Docker Compose
- Node.js 20+ e pnpm
- Git

## 🔧 Configuração Inicial

### 1. Clone e instale dependências

```bash
cd /home/elias-vrg/workspace/projects/or-platform
pnpm install
```

### 2. Inicie o PostgreSQL (Docker)

```bash
docker-compose up -d
```

Verifica se rodou:
```bash
docker ps | grep or-platform-db
```

### 3. Configure variáveis de ambiente

Backend já tem `.env` no diretório `apps/backend`.

Frontend já tem `.env.local`:
```bash
# apps/frontend/.env.local
VITE_API_URL=http://localhost:3000/api
```

## 🏃 Rodando a Aplicação

### Terminal 1 - Backend NestJS

```bash
cd apps/backend
pnpm dev
```

Esperado:
```
✅ Application running on http://localhost:3000
📚 Swagger available on http://localhost:3000/api/docs
```

### Terminal 2 - Frontend React

```bash
cd apps/frontend
pnpm dev
```

Esperado:
```
  ➜  Local:   http://localhost:5173/
```

## 🌐 Acessar a Aplicação

- **Frontend:** http://localhost:5173
- **API Docs:** http://localhost:3000/api/docs
- **Health Check:** http://localhost:3000/health

## 📊 Arquitetura

```
OR Platform (Monorepo)
├── apps/backend/       (NestJS + PostgreSQL)
│   ├── Courses Module
│   ├── Students Module
│   └── Enrollments Module
│
└── apps/frontend/      (React + Vite)
    ├── Dashboard
    ├── Courses Page
    ├── Students Page
    └── Enrollments Page
```

## 🧪 Testando a API

### Criar um Curso

```bash
curl -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Node.js Avançado",
    "description": "Aprenda Node.js em profundidade",
    "hours": 40,
    "price": 499.99,
    "status": "active"
  }' | jq .
```

### Listar Cursos

```bash
curl http://localhost:3000/api/courses | jq .
```

### Criar um Aluno

```bash
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "cpf": "12345678901",
    "phone": "(11) 99999-9999",
    "status": "active"
  }' | jq .
```

### Criar uma Matrícula

```bash
curl -X POST http://localhost:3000/api/enrollments \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "STUDENT_UUID_HERE",
    "courseId": "COURSE_UUID_HERE",
    "status": "active"
  }' | jq .
```

## 📚 Documentação

- [Backend README](apps/backend/README.md)
- [Frontend README](apps/frontend/README.md)
- [API Swagger](http://localhost:3000/api/docs)

## 🔗 Endpoints Principais

### Cursos
- `GET /api/courses` - Listar todos
- `GET /api/courses/active` - Listar ativos
- `GET /api/courses/:id` - Buscar por ID
- `POST /api/courses` - Criar
- `PATCH /api/courses/:id` - Atualizar
- `DELETE /api/courses/:id` - Deletar

### Alunos
- `GET /api/students` - Listar todos
- `GET /api/students/active` - Listar ativos
- `GET /api/students/:id` - Buscar por ID
- `POST /api/students` - Criar
- `PATCH /api/students/:id` - Atualizar
- `DELETE /api/students/:id` - Deletar

### Matrículas
- `GET /api/enrollments` - Listar todos
- `GET /api/enrollments/:id` - Buscar por ID
- `POST /api/enrollments` - Criar
- `PATCH /api/enrollments/:id` - Atualizar
- `DELETE /api/enrollments/:id` - Cancelar
- `?studentId=X` - Filtrar por aluno
- `?courseId=X` - Filtrar por curso

## 🚨 Troubleshooting

### Erro "Cannot connect to database"
```bash
docker-compose up -d  # Reinicia PostgreSQL
```

### Porta 3000 ou 5173 já em uso
```bash
# Mude a porta no package.json ou use PORT=4000
PORT=4000 pnpm dev
```

### CORS Error no Frontend
✅ Já configurado! CORS aceita `http://localhost:5173`

## 📦 Build para Produção

### Backend
```bash
cd apps/backend
pnpm build
pnpm start  # Produção
```

### Frontend
```bash
cd apps/frontend
pnpm build
pnpm preview  # Preview local
```

## 🎯 Próximas Etapas

1. Autenticação JWT (PHASE 3)
2. Roles e Permissões
3. Dashboard Avançado
4. Testes E2E
5. Deploy em Produção

