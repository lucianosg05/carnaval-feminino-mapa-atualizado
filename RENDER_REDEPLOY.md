# 🚀 Instruções para Redeploy no Render

## ❌ Problema Atual
O Render está rodando código antigo. CORS ainda está bloqueando as requisições do Vercel.

## ✅ Solução

### Passo 1: Abrir Dashboard Render
1. Acesse: https://dashboard.render.com
2. Logarue com sua conta

### Passo 2: Acessar o Serviço Backend
1. Clique no serviço: `carnaval-feminino-mapa-atualizado` (ou similar)
2. Você está na aba "Service"

### Passo 3: Fazer Redeploy
Opção A (Mais Rápida):
1. Clique no botão **"Manual Deploy"** (topo direito)
2. Selecione **"Deploy latest commit"**
3. Aguarde até aparecer status "Live" em verde

Opção B (Mais Segura):
1. Vá para a aba **"Deploys"**
2. Clique em **"New Deploy"**
3. Selecione o commit mais recente
4. Clique em **"Deploy"**

### Passo 4: Verificar Logs
1. Vá para aba **"Logs"**
2. Procure por: `[CORS] ALLOW_ANY_VERCEL: true (FORCED for production)`
3. Se aparecer, significa que o código novo foi carregado ✅

### Passo 5: Testar
Acesse no navegador:
```
https://carnaval-feminino-mapa-atualizado.onrender.com/api/health
```

Se retornar JSON com `"status": "ok"`, o backend está funcionando! ✅

---

## 🔧 Variáveis de Ambiente (Já Configuradas)
Se o Render pedir para configurar variáveis, use:

```
DATABASE_URL=postgresql://neondb_owner:npg_L7NaxIVTbHP2@ep-orange-dew-a4a8nzdv-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

JWT_SECRET=ce97a71a5f195b1df5ea9b69004719003b8a2e59295e60694d55570308381a4e

SITE_ADMIN_EMAIL=lsoares20357@gmail.com

NODE_ENV=production
```

---

## ⏱️ Tempo Esperado
- Redeploy completo: **2-3 minutos**
- Blocos aparecerão na página imediatamente após

---

## ✨ Resultado Esperado
Depois do redeploy, ao abrir a página Vercel:
- ✅ Não haverá mais erros de CORS
- ✅ Console mostrará: `[API] Blocos recebidos: 27`
- ✅ Página principal mostrará todos os blocos em grid
- ✅ Mapa mostrará todos os blocos com pins

---

## 🆘 Se Continuar com Erro
1. Verifique os logs do Render
2. Procure por mensagens de erro
3. Tire um screenshot e compartilhe

---

**Última atualização:** 14/03/2026  
**Commit:** cacb753 (CORS simplificado)
