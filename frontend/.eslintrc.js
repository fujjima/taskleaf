module.exports = {
  env: {
    browser: true, // document, consoleでエラーが出ないようにする
    es6: true, // es6絡みでのエラーが出ないようにする(let, constなど)
  },
  // parser: 'babel-eslint',
  plugins: ['react', 'prettier'],
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'prettier/react',
  ],
};
