import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'qa']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    // A showcase page module default-exports data ({ Visual, items }), not a component;
    // the specimens are small components that live beside it.
    // The stage helpers (parts.jsx) export a few functions that return JSX beside the components.
    files: ['src/showcase/pages/**/*.jsx', 'src/showcase/stages/parts.jsx'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
])
