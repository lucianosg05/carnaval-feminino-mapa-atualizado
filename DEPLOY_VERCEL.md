# Guia de Deploy para Vercel

## ✅ Status da Migração

- **Database**: SQLite → Neon Postgres (✅ Migrado)
  - 27 blocos com owner: **O2yjpR72auN6xZQ5meI0nnnVYLY2**
  - Todos os dados preservados
  - Backup local: `server/backups/20251204-130017/dev.db`

- **Schema Prisma**: Atualizado para PostgreSQL
- **Código**: Enviado para GitHub (main branch)

---

## 📋 Passos para Deploy no Vercel

### 1. **Conectar Repositório ao Vercel**
- Acesse [vercel.com](https://vercel.com)
- Clique em "New Project"
- Selecione o repositório `carnaval-feminino-mapa-atualizado`
- Framework: **Vite**
- Root directory: `/`

### 2. **Configurar Variáveis de Ambiente**

No painel do Vercel, em **Settings > Environment Variables**, adicione:

```
DATABASE_URL = postgresql://neondb_owner:npg_L7NaxIVTbHP2@ep-orange-dew-a4a8nzdv-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

JWT_SECRET = sua-chave-secreta-forte-aqui

SITE_ADMIN_EMAIL = lsoares20357@gmail.com

VITE_FIREBASE_API_KEY = (copie do seu Firebase)
VITE_FIREBASE_AUTH_DOMAIN = (copie do seu Firebase)
VITE_FIREBASE_PROJECT_ID = (copie do seu Firebase)
VITE_FIREBASE_STORAGE_BUCKET = (copie do seu Firebase)
VITE_FIREBASE_MESSAGING_SENDER_ID = (copie do seu Firebase)
VITE_FIREBASE_APP_ID = (copie do seu Firebase)
```

### 3. **Configurar Build & Development**

Em **Settings > General**:

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install` (ou `bun install` se usar Bun)

### 4. **Configurar API Routes**

O Vercel executará o frontend estático em `dist/`. Para o backend (Node.js):

**Opção A: Usar Vercel Functions** (Recomendado para serverless)
- Criar `/api` com rotas serverless
- [Guia Vercel Functions](https://vercel.com/docs/functions)

**Opção B: Deployar Backend Separadamente**
- Railway, Render, Fly.io, ou similar
- Atualizar `vercel.json` com a URL do backend

Atualmente `vercel.json` contém:
```json
{
  "builds": [
    {
      "src": "dist/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://seu-backend.com/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html",
      "status": 200
    }
  ]
}
```

### 5. **Conectar Banco de Dados**

O Neon está já configurado via `DATABASE_URL`. Ao fazer deploy:

```bash
# Vercel irá automaticamente usar o DATABASE_URL
# Não precisa executar migrations em produção (já foram feitas)
```

### 6. **Deploy da Primeira Vez**

```bash
# No repositório local
git push origin main

# Vercel detecta o push e inicia build automaticamente
# Ou clique em "Deploy" no painel do Vercel
```

Monitorar em **Deployments** → **Logs** para erros durante build/runtime.

---

## 🔍 Verificações Pós-Deploy

1. **Frontend**:
   - [ ] Acessar URL do Vercel
   - [ ] Verificar mapa carrega
   - [ ] Testar login/registro

2. **Admin Panel**:
   - [ ] Fazer login como admin
   - [ ] Verificar 27 blocos listados
   - [ ] Criar novo bloco
   - [ ] Editar bloco
   - [ ] Deletar bloco

3. **Database**:
   - [ ] Confirmar conexão ao Neon
   - [ ] Executar query: `SELECT COUNT(*) FROM "Block"`
   - [ ] Esperado: 27

---

## 🔗 Próximos Passos

### Uploads de Imagens (Cloudinary ou Supabase)

Atualmente, uploads salvos localmente em `server/uploads/`. Para produção:

1. **Registrar-se no Cloudinary**:
   - https://cloudinary.com
   - Copiar API Key e Secret

2. **Atualizar code para usar Cloudinary**:
   - Instalar `cloudinary` package
   - Atualizar `server/index.js` para fazer upload ao Cloudinary
   - Salvar URL retornada no banco

3. **Migrar uploads existentes** (19 arquivos):
   ```bash
   # Executar script para upload em lote
   node server/uploadToCloudinary.js
   ```

---

## ⚠️ Notas Importantes

- **JWT_SECRET**: Mude para uma chave forte. Gere com:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

- **Firebase**: Certifique-se de que Firebase está configurado para production
  
- **CORS**: Adicione domínio do Vercel aos CORS allowed origins em `server/index.js`

- **Monitoramento**: Configure alertas do Vercel para notificações de erro

---

## 📞 Suporte

Verifique logs em:
- Vercel Dashboard → Deployments → Build & Function Logs
- Neon Dashboard → Monitoring → Logs

