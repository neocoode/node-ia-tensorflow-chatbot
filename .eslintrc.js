module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jest: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-base',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    // Regras personalizadas
    'import/no-extraneous-dependencies': 'off',
    'no-console': 'off',
    'class-methods-use-this': 'off',
    'no-param-reassign': 'off',
    'consistent-return': 'off',
    'no-plusplus': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'tno-await-in-loop': 'off',
    'no-promise-executor-return': 'off',

    // Regras habilitadas para boas práticas
    'no-unused-vars': 'error',
    eqeqeq: 'error',
    'prefer-const': 'error',
    'no-undef': 'error',
    'no-shadow': 'off',
    'no-use-before-define': 'error',
    radix: 'error',
    'arrow-body-style': 'error',
    'array-callback-return': 'error',

    // Regras desativadas por flexibilidade
    'no-underscore-dangle': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'no-restricted-syntax': 'off',
    'object-shorthand': 'off',
    'default-param-last': 'off',
    'no-useless-return': 'off',
    'max-classes-per-file': 'off',
    'prettier/prettier': 'error',
  },
};
