Setup local

1. Instale dependências:

```powershell
npm install
```

2. Gere o client do Prisma e rode migração inicial:

```powershell
npx prisma generate
npx prisma migrate dev --name init
```

Isso criará `prisma/dev.db` (SQLite) e gerará o client.

3. Rode o projeto (Vite + servidor Express):

```powershell
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:4000/api

Observações:
- Atualize a chave `JWT_SECRET` no arquivo `.env` antes de usar em produção.
- Para criar um usuário admin, registre-se pela rota `/register` na aplicação ou chame a API `POST /api/auth/register`.
