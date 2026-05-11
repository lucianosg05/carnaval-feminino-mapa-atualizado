// Configuração do Vite: bundler e dev server para a aplicação React
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc"; // Plugin React com SWC (compilador rápido)
import path from "path";

// Documentação: https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::", // Escuta em IPv6 (compatível com IPv4)
    port: 8080, // Porta do servidor de desenvolvimento
  },
  plugins: [react()].filter(Boolean), // Plugin React para transformar JSX/TSX
  resolve: {
    alias: {
      // Alias: permite usar @/componentes em vez de paths relativos
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
