// Configuração ESLint: regras para verificar qualidade e estilo de código
// ESLint: ferramenta que detecta e corrige problemas no JavaScript/TypeScript
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks"; // Regras para React Hooks
import reactRefresh from "eslint-plugin-react-refresh"; // Validação para Fast Refresh
import tseslint from "typescript-eslint"; // Regras específicas para TypeScript

export default tseslint.config(
  // Ignora pasta 'dist' (build output)
  { ignores: ["dist"] },
  {
    // Estende configurações recomendadas JavaScript + TypeScript
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    // Aplica regras apenas a arquivos TypeScript/TSX
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020, // Suporta sintaxe ES2020
      globals: globals.browser, // Define variáveis globais do browser (window, document, etc)
    },
    plugins: {
      "react-hooks": reactHooks, // Plugin para validar Hooks (useEffect, useState, etc)
      "react-refresh": reactRefresh, // Plugin para validar componentes exportáveis
    },
    rules: {
      // Aplica regras recomendadas de React Hooks
      ...reactHooks.configs.recommended.rules,
      // Aviso: componentes devem ser exportados apenas (necessário para Fast Refresh)
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      // Desativa aviso de variáveis não usadas (muito restritivo em desenvolvimento)
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
);
