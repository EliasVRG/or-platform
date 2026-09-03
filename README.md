# OR Platform

Sistema de gestão de cursos e matrículas de estudantes. Projeto CRUD completo desenvolvido com arquitetura profissional, validação de negócio, e interface responsiva.

## Visão Geral

Aplicação monolítica para instituições de ensino gerenciarem:

- **Cursos** — nome, descrição, carga horária, preço, status
- **Estudantes** — nome, email, CPF, telefone, status
- **Matrículas** — vínculo estudante-curso com validações de negócio

## Stack Tecnológico

### Backend
- NestJS 10.4 com TypeScript 5.1
- TypeORM com PostgreSQL 16
- class-validator para validação de DTOs
- Swagger para documentação de API
- CORS e tratamento global de exceções

### Frontend
- React 19 com Vite 8
- React Router DOM 7 para roteamento
- React Hook Form + Zod para validação
- Tailwind CSS 3 com design system customizado
- Recharts para visualizações
- Lucide React para ícones

### DevOps
- Docker Compose para PostgreSQL
- pnpm workspaces (monorepo)

## Pré-requisitos

- Node.js 18+
- pnpm 8+
- Docker e Docker Compose

## Setup Inicial

```bash
# 1. Instalar dependências
pnpm install

# 2. Iniciar PostgreSQL
docker-compose up -d

# 3. Iniciar backend
cd apps/backend
pnpm dev

# 4. Iniciar frontend (em outro terminal)
cd apps/frontend
pnpm dev
```

Backend estará disponível em: `http://localhost:3000`
Frontend estará disponível em: `http://localhost:5174`
Swagger em: `http://localhost:3000/api/docs`

## Funcionalidades

### Cursos
- Criar, ler, atualizar, listar cursos
- Filtrar e buscar por nome
- Soft delete (marcar como inativo)
- Hard delete permanente (somente cursos inativos)

### Estudantes
- Criar, ler, atualizar, listar estudantes
- Validar CPF e email (unicidade)
- Filtrar e buscar por nome
- Soft delete com reversão
- Hard delete permanente (somente inativos)

### Matrículas
- Criar matrícula com validações:
  - Estudante deve estar ativo
  - Curso deve estar ativo
  - Não permitir duplicata ativa no mesmo curso
- Listar matrículas com filtros
- Cancelar matrícula (soft delete)
- Deletar permanentemente (hard delete)

### Dashboard
- Taxa de conclusão de matrículas
- Contadores (matrículas ativas, cursos, estudantes)
- Gráficos de distribuição de status
- Quick actions para gestão rápida

## Arquitetura

### Backend - Padrões Aplicados

**Repository Pattern**
```
Controller → Service → Repository → Database
```

Separação clara de responsabilidades com cada camada independente:
- Controllers: Validação de entrada, chamada de serviço
- Services: Lógica de negócio, regras
- Repositories: Acesso a dados

**Validação em DTOs**
```typescript
class CreateCourseDto {
  @IsString() @MinLength(3) name: string;
  @IsNumber() @Min(0) hours: number;
  @IsNumber() @Min(0) price: number;
}
```

**Global Exception Filter**
Todos os erros retornam envelope padrão com mensagem e status HTTP apropriado.

**Response Interceptor**
Todas as respostas bem-sucedidas retornam format padrão.

### Frontend - Design System

**Paleta de Cores**
- Neutral (cinza): Base, bordas, textos secundários
- Brand (azul #2563eb): Ações primárias, links, foco
- Success (verde #059669): Ações positivas, status ativo
- Warning (âmbar #d97706): Atenção, status pendente
- Danger (vermelho #dc2626): Ações destrutivas, erros
- Accent (teal #0891b2): Visualizações
- Navy (#0f172a): Sidebar escuro

**Tipografia**
- Font: Inter (Google Fonts)
- Headlines: 600-700 weight, line-height 1.3
- Body: 400 weight, 16px base
- Scale: 12px a 32px

**Componentes**
- Button: Variações (primary, secondary, danger, ghost) e tamanhos (sm, md, lg)
- Input: Com validação, erro states, focus rings
- Select/SearchSelect: Dropdown pesquisável com filtro
- Table: Headers uppercase, hover states, responsiva
- Badge: Status com cores específicas
- Dialog: Modal com backdrop blur
- Card: Surface com shadow e borders

**Layout**
- Sidebar: 224px, sticky, navy background
- Header: Sticky, 24px padding vertical, tipografia clara
- Content: 32px padding, max-width full
- Responsivo: Mobile-first approach

## Regras de Negócio

### Matrículas
- Estudante deve estar ativo (status = 'active')
- Curso deve estar ativo (status = 'active')
- Não permitir matrícula duplicada ativa no mesmo curso
- Matrícula pode ser cancelada (soft delete)

### Deleção (Soft vs Hard Delete)

**Soft Delete** (Padrão)
- Marca item como inativo/cancelado
- Reversível (pode ser restaurado)
- Preserva integridade referencial
- Mantém histórico

**Hard Delete** (Permanente)
- Remover completamente do banco
- Somente disponível para itens já inativos/cancelados
- Não reversível
- Uso: Limpeza de dados antigos

**Regras por Entidade:**
- Cursos: Hard delete somente se status = 'inactive'
- Estudantes: Hard delete somente se status = 'inactive'
- Matrículas: Hard delete somente se status = 'canceled' ou 'completed'

## Estrutura de Pastas

```
or-platform/
├── apps/
│   ├── backend/
│   │   └── src/
│   │       ├── modules/
│   │       │   ├── courses/
│   │       │   │   ├── courses.controller.ts
│   │       │   │   ├── courses.service.ts
│   │       │   │   ├── courses.repository.ts
│   │       │   │   ├── entities/course.entity.ts
│   │       │   │   ├── dtos/create-course.dto.ts
│   │       │   │   └── dtos/update-course.dto.ts
│   │       │   ├── students/
│   │       │   ├── enrollments/
│   │       ├── common/
│   │       │   ├── filters/exception.filter.ts
│   │       │   └── interceptors/response.interceptor.ts
│   │       ├── database/
│   │       │   ├── migrations/
│   │       │   └── typeorm.config.ts
│   │       └── main.ts
│   └── frontend/
│       └── src/
│           ├── components/
│           │   ├── ui/ (Button, Input, Select, Badge, etc)
│           │   └── layout/ (Sidebar, Header, AppLayout)
│           ├── pages/
│           │   ├── Dashboard
│           │   ├── Courses
│           │   ├── Students
│           │   └── Enrollments
│           ├── hooks/ (useCourses, useStudents, useEnrollments)
│           ├── services/ (API calls)
│           ├── App.tsx
│           ├── App.css
│           └── index.css (Design system base)
├── docker-compose.yml
└── pnpm-workspace.yaml
```

## APIs

### Courses
- `GET /api/courses` — Listar cursos
- `POST /api/courses` — Criar curso
- `GET /api/courses/:id` — Obter curso
- `PATCH /api/courses/:id` — Atualizar curso
- `DELETE /api/courses/:id` — Soft delete (inativar)
- `DELETE /api/courses/:id/hard` — Hard delete (permanente)

### Students
- `GET /api/students` — Listar estudantes
- `POST /api/students` — Criar estudante
- `GET /api/students/:id` — Obter estudante
- `PATCH /api/students/:id` — Atualizar estudante
- `DELETE /api/students/:id` — Soft delete (inativar)
- `DELETE /api/students/:id/hard` — Hard delete (permanente)

### Enrollments
- `GET /api/enrollments` — Listar matrículas
- `POST /api/enrollments` — Criar matrícula
- `GET /api/enrollments/:id` — Obter matrícula
- `PATCH /api/enrollments/:id` — Atualizar matrícula
- `DELETE /api/enrollments/:id` — Soft delete (cancelar)
- `DELETE /api/enrollments/:id/hard` — Hard delete (permanente)

## Validação de Dados

### DTOs (Backend)
Todos os inputs são validados com class-validator:
- Tipos corretos
- Tamanho mínimo/máximo
- Email válido
- CPF válido (formato)
- Valores em enums

### Frontend
React Hook Form + Zod:
- Validação client-side em tempo real
- Feedback visual em campos inválidos
- Mensagens de erro específicas

## Performance

- TypeORM com queries otimizadas
- Frontend com lazy loading de componentes
- Charts (Recharts) otimizados para datasets pequenos
- Vite para build rápido (bundle ~822KB JS, ~20KB CSS)

## Segurança

- Validação em todas as entradas
- Proteção contra SQL injection (TypeORM parameterizado)
- CORS configurado
- Soft delete como backup contra deleções acidentais
- DTOs para serialização controlada

## Executando em Produção

Frontend:
```bash
cd apps/frontend
pnpm build    # Gera dist/
pnpm preview  # Testa build localmente
```

Backend:
```bash
cd apps/backend
pnpm build
NODE_ENV=production pnpm start
```

O frontend buildado pode ser servido por qualquer servidor web estático.
O backend roda em Node.js.

## Notas de Entrevista

- Projeto segue SOLID Principles (Single Responsibility, Dependency Injection)
- Clean Code: Funções pequenas, nomes descritivos, sem magic numbers
- Tratamento de erros global e consistente
- Padrões RESTful nas APIs
- Componentes reutilizáveis e compostos
- Responsividade mobile-first
- Design system documentado e consistente
- Validação em múltiplas camadas (input, business logic)
- Soft delete como decisão arquitetural inteligente
