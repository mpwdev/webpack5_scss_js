module.exports = {
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
  },
  root: true,
  env: {
    browser: true,
    es6: true,
  },
  rules: {
    'no-unused-vars': 'warn',
  },
  extends: ['eslint:recommended'],
};
