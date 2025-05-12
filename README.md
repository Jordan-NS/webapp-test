# 🚀 NASA Explorer

Aplicação full-stack para explorar imagens astronômicas do dia (APOD) da NASA, com favoritos, busca, paginação e autenticação.

## Tecnologias Utilizadas

### Frontend
- **Next.js** (App Router, TypeScript)
- **Tailwind CSS**
- **React Query**
- **NextAuth.js** (autenticação)
- **Axios**

### Backend
- **NestJS** (TypeScript)
- **Prisma ORM**
- **PostgreSQL**
- **Axios**
- **JWT** (para autenticação)

---

## Como rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/nasa-explorer.git
cd nasa-explorer
```

---

### 2. Configuração do Backend

```bash
cd backend
npm install
```

- Copie o arquivo `.env.example` para `.env` e preencha as variáveis:

#### Exemplo de `.env` para o backend:
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nasa_explorer"
NASA_API_KEY="SUA_CHAVE_DA_NASA"
JWT_SECRET="um-segredo-forte"
```

- Gere o banco de dados e as tabelas:
```bash
npx prisma migrate dev
```

- Rode o backend:
```bash
npm run start:dev
```

---

### 3. Configuração do Frontend

```bash
cd ../frontend
npm install
```

- Copie o arquivo `.env.example` para `.env.local` e preencha as variáveis:

#### Exemplo de `.env.local` para o frontend:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=um-segredo-forte
NEXT_PUBLIC_API_URL=http://localhost:3001
```

- Gere um segredo seguro para o NextAuth (opcional, mas recomendado):
```bash
npx openssl rand -base64 32
```
Cole o valor em `NEXTAUTH_SECRET`.

- Rode o frontend:
```bash
npm run dev
```

---

### 4. Acesse a aplicação

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:3001](http://localhost:3001)

---

## Funcionalidades

- Exibição das imagens do dia da NASA (APOD)
- Busca por data e texto
- Paginação e carregamento incremental
- Favoritar imagens (autenticação via NextAuth)
- Sincronização e armazenamento local das imagens
- Design responsivo e moderno

---

## Observações

- Para obter sua chave da NASA, acesse: https://api.nasa.gov/
- O projeto está pronto para deploy (Vercel, Railway, Render, etc).
- O banco padrão é PostgreSQL, mas pode ser facilmente adaptado para SQLite/MySQL alterando a variável `DATABASE_URL` no backend.

---

## Scripts Úteis

- **Gerar segredo JWT para backend:**
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- **Gerar segredo NextAuth para frontend:**
  ```bash
  npx openssl rand -base64 32
  ```

---

## Licença

MIT
