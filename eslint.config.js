// eslint.config.js
import eslintPluginTypescript from '@typescript-eslint/eslint-plugin';
import eslintParserTypescript from '@typescript-eslint/parser';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default {
  ignores: ['node_modules', 'dist'], // Ignored paths
  files: ['src/**/*.ts', 'test/**/*.ts'], // Files to lint
  languageOptions: {
    parser: eslintParserTypescript,
    parserOptions: {
      project: ['./tsconfig.json'], // Path to your tsconfig.json
      sourceType: 'module',
    },
  },
  plugins: {
    '@typescript-eslint': eslintPluginTypescript,
    import: eslintPluginImport,
    prettier: eslintPluginPrettier,
  },
  rules: {
    'prettier/prettier': ['error'],
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/no-explicit-any': 'warn',
    'import/order': [
      'error',
      {
        groups: [
          ['builtin', 'external'],
          'internal',
          ['sibling', 'parent', 'index'],
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
  },
};
