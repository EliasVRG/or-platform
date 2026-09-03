# OR Platform — Sistema de Gestão de Cursos e Matrículas

Projeto profissional de demonstração de arquitetura para o Grupo Oliveira Rocha.

## 🎯 Visão Geral

Sistema CRUD completo para gestão de:
- **Cursos** — nome, descrição, carga horária, preço, status
- **Alunos** — nome, email, CPF, telefone, status
- **Matrículas** — associação aluno ↔ curso com validações de negócio

## 📐 Decisões Técnicas

### Stack
- **Monorepo**: pnpm workspaces
- **Backend**: NestJS + TypeScript
- **Banco de Dados**: PostgreSQL 16
- **ORM**: TypeORM
- **Validação**: class-validator
- **API Docs**: Swagger

### Padrões de Arquitetura
- **Repository Pattern** — desacopla lógica de dados
- **DTO + Validation** — validação em camada de entrada
- **Global Exception Filter** — tratamento padronizado de erros
- **Response Interceptor** — envelope padrão para respostas
- **SOLID Principles** — single responsibility, dependency injection
- **Clean Code** — funções pequenas, nomes descritivos

### Regras de Negócio
- ❌ Não matricular aluno inativo
- ❌ Não matricular em curso inativo
- ❌ Não duplicar matrícula ativa no mesmo curso
- 🗑️ Soft delete — nada é realmente deletado (status = inactive)

## 🚀 Quick Start

### Pré-requisitos
- Node.js 18+
- pnpm 8+
- Docker + Docker Compose

### Setup Inicial

```bash
# 1. Instalar dependências
pnpm install

# 2. Configurar variáveis de ambiente
cp .env.example .env

# 3. Iniciar PostgreSQL
docker-compose up -d

# 4. Executar migrações (quando pronto)
cd apps/backend
pnpm run migration:run

# 5. Iniciar backend
pnpm run dev
```

API estará disponível em `http://localhost:3000`
Swagger em `http://localhost:3000/api/docs`

## 📁 Estrutura do Projeto

```
or-platform/
├── apps/
│   ├── backend/          # NestJS API
│   │   └── src/
│   │       ├── modules/
│   │       │   ├── courses/
│   │       │   ├── students/
│   │       │   └── enrollments/
│   │       ├── common/   # Filtros, pipes, decoradores
│   │       ├── config/   # Configuração do banco
│   │       └── main.ts
│   └── web/              # Frontend (Próximas fases)
├── packages/             # Shared libraries (se necessário)
├── docker-compose.yml    # PostgreSQL
└── pnpm-workspace.yaml   # Configuração do monorepo
```

## 📋 Roadmap

- **FASE 1**: ✅ Setup monorepo + Docker + CI/CD base
- **FASE 2**: Implementação NestJS (módulos de cursos, alunos, matrículas)
- **FASE 3**: Autenticação JWT + Autorização
- **FASE 4**: Frontend web (React/Next.js)
- **FASE 5**: Testes E2E + Melhorias de performance

## 🔐 Segurança

- Validação em todas as entradas (DTO + class-validator)
- SQL injection prevented by TypeORM parameterized queries
- CORS configurado
- Rate limiting (próximas fases)
- JWT authentication (próximas fases)

## 📝 Contribuindo

1. Criar branch: `git checkout -b feature/nome-feature`
2. Commitar com mensagens descritivas
3. Push: `git push origin feature/nome-feature`
4. Abrir PR

## 📞 Contato

Grupo Oliveira Rocha — [seu-email]

---

**Última atualização**: 2026-09-02
