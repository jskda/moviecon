// eslint.config.js
import js from '@eslint/js'
import next from '@next/eslint-plugin-next'

export default [
  js.configs.recommended,
  {
    ignores: ['.next/', 'node_modules/']
  },
  {
    plugins: {
      next: next
    },
    rules: {
      ...next.configs.recommended.rules,
      ...next.configs['core-web-vitals'].rules,
      // Отключаем некоторые правила если нужно
      '@next/next/no-img-element': 'off', // или 'off'
      'react/no-unescaped-entities': 'off',
      'module-type-warning': 'off'
    }
  }
]