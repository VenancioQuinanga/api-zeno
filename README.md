# ZENO API

Esta é uma API desenvolvida pro sistema de gestão de candidatos ZENO HUB.
Feita com Express, Prisma e PostgreSQL.

----

##  Como rodar

```bash
# entrar na pasta
cd api-zeno

# instalar
npm install

# configurar banco
cp .env.example .env
# editar .env com a URL do banco

# rodar migrations
npx prisma migrate dev

# gerar o prima client
npx prisma generate

# iniciar
npm run dev
```

----

##  Extrutura de pastas do projeto

```txt
prisma/
src/
├── config/           # Configurações
├── controllers/      # Lógica das rotas
├── generated/        # Saida pro Prisma Client
├── lib/              # Pra recursos como o prismaClient
├── middlewares/      # Auth, error handler, etc
├── models/           # DTOs e tipos
├── routes/           # Rotas da API
├── services/         # Regras de negócio
└── types/            # Tipos estendidos
├── utils/            # Funções auxiliares
└── validations/      # Validações com Zod
```

----

## Models do banco

```prisma
model User {
  id             String    @id @default(cuid())
  email          String    @unique
  password       String 
  role           UserRole  @default(USER)
  isActive       Boolean   @default(true) @map("is_active")
  createdAt      DateTime  @default(now()) @map("created_at")
  updatedAt      DateTime  @updatedAt @map("updated_at")

  @@map("users")
}

enum UserRole {
  ADMIN
  USER
  VIEWER

  @@map("user_roles")
}

model Candidate {
  id              String   @id @default(cuid())
  name            String
  email           String   @unique
  phone           String?
  birthDate       String? @map("birth_date")
  position        String
  applicationDate DateTime @map("application_date")
  status          Status   @default(pending)
  experience      Int?     @default(0)
  skills          String[]
  notes           String?
  linkedin        String?
  portfolio       String?
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  @@map("candidates")
}

enum Status {
  pending
  reviewed
  approved
  rejected

  @@map("status")
}
```


----

##  Endpoints da API

### Base: /api/v1

### Autenticação
### POST /api/v1/auth/register

Cria um novo user.

### Request:

```json
{
  "email": "usuario@email.com",
  "password": "123456",
  "role": "USER"
}
```

### Response (201):

```json
{
  "user": {
    "id": "cm7x1v8xb0000vs9i3yj6xb0m",
    "email": "usuario@email.com",
    "role": "USER",
    "isActive": true,
    "createdAt": "2025-02-25T10:30:00.000Z",
    "updatedAt": "2025-02-25T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST /api/v1/auth/login
### Autentica um usuário.

### Request:

```json
{
  "email": "usuario@email.com",
  "password": "123456"
}
```

### Response (200):

```json
{
  "user": {
    "id": "cm7x1v8xb0000vs9i3yj6xb0m",
    "email": "usuario@email.com",
    "role": "USER",
    "isActive": true,
    "createdAt": "2025-02-25T10:30:00.000Z",
    "updatedAt": "2025-02-25T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### GET /api/v1/auth/profile
### Retorna os dados do usuário autenticado.

### Headers:

```txt
Authorization: Bearer <token>
```

### Response (200):

```json
{
  "user": {
    "id": "cm7x1v8xb0000vs9i3yj6xb0m",
    "email": "usuario@email.com",
    "role": "USER",
    "isActive": true,
    "createdAt": "2025-02-25T10:30:00.000Z",
    "updatedAt": "2025-02-25T10:30:00.000Z"
  }
}
```

### Candidatos (Todas requerem token)
### GET /api/v1/candidates

Lista todos os candidatos com filtros opcionais.

### Headers:

```txt
Authorization: Bearer <token>
```

### Query Params:

status (opcional): pending | reviewed | approved | rejected

search (opcional): busca por nome, email ou cargo

### GET /api/v1/candidates
### GET /api/v1/candidates?status=pending
### GET /api/v1/candidates?search=joão

### Response (200):

```json
[
  {
    "id": "cm7x1w3a20001vs9i9j9x9x9x",
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "11999999999",
    "birthDate": "1990-01-01",
    "position": "Frontend Developer",
    "applicationDate": "2025-02-20T00:00:00.000Z",
    "status": "pending",
    "experience": 3,
    "skills": ["React", "TypeScript", "Next.js"],
    "notes": "Candidato promissor",
    "linkedin": "https://linkedin.com/in/joao",
    "portfolio": null,
    "photoUrl": null,
    "createdAt": "2025-02-25T10:30:00.000Z",
    "updatedAt": "2025-02-25T10:30:00.000Z"
  }
]
```

### GET /api/v1/candidates/:id
### Busca um candidato específico.

### Headers:

```txt
Authorization: Bearer <token>
```

### Response (200):

```json
{
  "id": "cm7x1w3a20001vs9i9j9x9x9x",
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "11999999999",
  "birthDate": "1990-01-01",
  "position": "Frontend Developer",
  "applicationDate": "2025-02-20T00:00:00.000Z",
  "status": "pending",
  "experience": 3,
  "skills": ["React", "TypeScript", "Next.js"],
  "notes": "Candidato promissor",
  "linkedin": "https://linkedin.com/in/joao",
  "portfolio": null,
  "photoUrl": null,
  "createdAt": "2025-02-25T10:30:00.000Z",
  "updatedAt": "2025-02-25T10:30:00.000Z"
}
```

### POST /api/v1/candidates
### Cria um novo candidato.

### Headers:

```txt
Authorization: Bearer <token>
Content-Type: application/json
```

### Request:

```json
{
  "name": "Maria Santos",
  "email": "maria@email.com",
  "phone": "11988887777",
  "birthDate": "1992-05-15",
  "position": "Backend Developer",
  "applicationDate": "2025-02-25",
  "status": "pending",
  "experience": 5,
  "skills": ["Node.js", "Python", "PostgreSQL"],
  "notes": "Experiência com APIs",
  "linkedin": "https://linkedin.com/in/maria",
  "portfolio": "https://mariadev.com"
}
```

### Response (201): (mesmo formato do GET)

### PATCH /api/v1/candidates/:id

Atualiza um candidato existente.

### Headers:

```txt
Authorization: Bearer <token>
Content-Type: application/json
```

### Request:

```json
{
  "status": "approved",
  "notes": "Entrevista aprovada, contratar"
}
```

### Response (200): (dados atualizados)

### DELETE /api/v1/candidates/:id
### Remove um candidato.

### Headers:

```txt
Authorization: Bearer <token>
```

### Response: 204 No Content

## Variáveis de Ambiente

```env
# Servidor
PORT=4000

# Banco de Dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/zeno_db"

# JWT
JWT_SECRET="seu-secret"
JWT_EXPIRES_IN="7d"

# Frontend (CORS)
FRONTEND_URL="http://localhost:3000"
```

----

## Considerações

JWT com expiração de 2 dias, escolhi esse tempo curto por questões de segurança.
Adotei a estrutura do Nestjs apara construção de algumas coisas na api, porque atualmente trabalho 
também com  NestJs e estou abituado com essa estrutura e gosto bastante de alguns aspectos e vantagens desse framework.
Por issso da escolha desse padrão kkk
