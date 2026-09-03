# OR Platform - Frontend

Frontend React + Vite + TypeScript da OR Platform.

## 🚀 Tecnologias

- **React 19** - UI library
- **Vite 8** - Build tool
- **TypeScript 6** - Type safety
- **Tailwind CSS 3** - Styling
- **React Router DOM 7** - Client-side routing
- **React Hook Form 7** - Form management
- **Zod 4** - Schema validation
- **Axios** - HTTP client
- **Lucide React** - Icons

## 📁 Estrutura

```
src/
├── components/
│   ├── layout/          # Layout components (Sidebar, Header, AppLayout)
│   └── ui/              # Reusable UI components (Button, Input, Select, Badge, Dialog)
├── pages/
│   ├── Dashboard.tsx    # Dashboard page
│   ├── Courses/         # Courses management
│   ├── Students/        # Students management
│   └── Enrollments/     # Enrollments management
├── services/            # API services
│   ├── api.ts          # Axios instance with interceptors
│   ├── courses.service.ts
│   ├── students.service.ts
│   └── enrollments.service.ts
├── hooks/              # Custom React hooks
│   ├── useCourses.ts
│   ├── useStudents.ts
│   └── useEnrollments.ts
├── schemas/            # Zod validation schemas
│   ├── course.schema.ts
│   ├── student.schema.ts
│   └── enrollment.schema.ts
├── types/              # TypeScript types
│   └── index.ts
├── App.tsx             # Main app component with routing
├── main.tsx            # React entry point
└── index.css           # Global styles + Tailwind imports
```

## 📦 Instalação

```bash
pnpm install
```

## 🔧 Configuração

Copie `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

A URL padrão da API é `http://localhost:3000/api`.

## 🚀 Desenvolvimento

```bash
pnpm dev
```

O servidor Vite inicia em `http://localhost:5173`.

## 🔨 Build

```bash
pnpm build
```

Gera arquivos de produção em `dist/`.

## 🎨 Design System

Cores no `tailwind.config.js`:
- **brand** (azul) - 50, 200, 400, 600, 900
- **success** (verde) - 50, 400, 600  
- **warning** (âmbar) - 50, 400, 600
- **danger** (vermelho) - 50, 400, 600

## 📱 Páginas

### Dashboard
Stats de cursos, alunos e matrículas

### Cursos
Listagem, busca, filtro de status, CRUD

### Alunos
Listagem, busca (nome/email), filtro de status, CRUD

### Matrículas
Listagem, busca (aluno/curso), filtro de status, CRUD

## 🔌 Integração com Backend

APIs disponíveis:
- `/courses` - CRUD completo
- `/students` - CRUD completo
- `/enrollments` - CRUD completo

Interceptor Axios trata erros automaticamente.
