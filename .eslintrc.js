module.exports = {
  env: {
    browser: true,
  },
  extends: ['plugin:react/recommended', 'airbnb-typescript', 'plugin:prettier/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json'],
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'import'],
  rules: {
    'react/jsx-filename-extension': [2, { extensions: ['.jsx', '.tsx'] }],
    'import/no-extraneous-dependencies': ['off'],
    'react/prop-types': ['off'],
    semi: [2, 'always'],
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        printWidth: 120,
        tabWidth: 2,
        trailingComma: 'all',
        jsxSingleQuote: true,
        semi: true,
      },
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
    react: {
      version: 'detect',
    },
  },
};
