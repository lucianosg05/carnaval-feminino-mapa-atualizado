# Arquitetura: Local vs Produção

## 🎯 Resumo

| Aspecto | Local (Dev) | Produção (Vercel) |
|---------|-------------|-------------------|
| **Frontend** | Vite SPA (http://localhost:8080) | Vercel Static (HTTPS) |
| **Backend** | Node.js Express (http://localhost:4000) | ❌ Não está deployed ainda |
| **Database** | SQLite (prisma/dev.db) | Neon Postgres |
| **Schema** | `provider = "sqlite"` | `provider = "postgresql"` |
| **Uploads** | Local filesystem (server/uploads/) | ❌ Não migrado para Cloudinary |

---

## 📝 Problema Encontrado

Ao tentar fazer deploy no Vercel, o schema.prisma foi alterado para `provider = "postgresql"`, mas:
- ❌ O `.env` local ainda tinha `DATABASE_URL="file:./dev.db"` (SQLite)
- ❌ Isso causou erro: "the URL must start with the protocol `file:` " 
- ❌ Aplicação quebrou localmente

## ✅ Solução Implementada

1. **Revertemos schema.prisma para SQLite** (local)
2. **Restauramos dev.db do backup** (27 blocos recuperados)
3. **Deixamos DATABASE_URL apontando para SQLite localmente**

Agora você tem dois caminhos:

---

## 🚀 Opção A: Deploy no Vercel (Recomendado)

### O que fazer:

1. **Vercel fará override do schema.prisma**
   - Não será necessário alterar localmente
   - No dashboard do Vercel, você pode adicionar uma build script que altere o provider para PostgreSQL

2. **Configurar variáveis de ambiente NO VERCEL (não no .env)**:
   - Dashboard Vercel → Settings → Environment Variables
   - Adicionar:
     ```
     DATABASE_URL=postgresql://neondb_owner:npg_L7NaxIVTbHP2@ep-orange-dew-a4a8nzdv-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
     JWT_SECRET=sua-chave-forte
     SITE_ADMIN_EMAIL=lsoares20357@gmail.com
     ```

3. **Build no Vercel**:
   - Vercel executará: `npm run build`
   - Qual provider o Vercel usará? O do `schema.prisma` da branch que você fez push (SQLite)
   - **Solução**: Criar um script `build.js` que altera o provider antes do build

---

## 🔧 Opção B: Usar Script de Build Condicional

Vou criar um script que:
- ✅ Usa PostgreSQL se `DATABASE_URL` começar com `postgresql://`
- ✅ Usa SQLite se começar com `file://`

### Criar arquivo `scripts/setup-prisma.js`:

```javascript
const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf-8');

const isProduction = process.env.DATABASE_URL?.startsWith('postgresql');

if (isProduction) {
  schema = schema.replace('provider = "sqlite"', 'provider = "postgresql"');
  console.log('✅ Schema updated to PostgreSQL (production)');
} else {
  schema = schema.replace('provider = "postgresql"', 'provider = "sqlite"');
  console.log('✅ Schema using SQLite (development)');
}

fs.writeFileSync(schemaPath, schema);
```

### Atualizar `package.json`:

```json
{
  "scripts": {
    "setup-prisma": "node scripts/setup-prisma.js",
    "build": "npm run setup-prisma && vite build",
    "dev": "concurrently \"vite\" \"nodemon --watch server --exec node server/index.js\""
  }
}
```

---

## 📊 Status Atual

- ✅ **Local**: Funcionando com SQLite
- ✅ **GitHub**: Código enviado (schema = SQLite)
- ✅ **Neon**: Banco tem 27 blocos esperando
- ❌ **Vercel**: Ainda não deployado corretamente

---

## 🎯 Próximos Passos

1. **Escolha uma opção acima (A ou B)**
2. **Se Opção B**: Execute os comandos para criar o script
3. **Faça novo push para GitHub**
4. **Vá ao Vercel e clique "Redeploy"**
5. **Vercel detectará o novo script e usará PostgreSQL em produção**

**Qual opção você quer usar?**
