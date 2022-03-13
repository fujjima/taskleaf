module.exports = {
  env: {
    browser: true, // document, consoleでエラーが出ないようにする
    es6: true, // es6絡みでのエラーが出ないようにする(let, constなど)
  },
  parser: 'babel-eslint',
  plugins: ['react', 'prettier'],
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  ignorePatterns: ['dist/*.js', 'dist/*.js.map'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'prettier/react',
  ],
  globals: {
    _: true,
    IMap: true,
    IOrderedMap: true,
    ISeq: true,
    ISet: true,
    IRecord: true,
    IList: true,
  },
};
