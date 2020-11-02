module.exports = {
  env: {
    browser: true, // document, consoleでエラーが出ないようにする
    es6: true, // es6絡みでのエラーが出ないようにする(let, constなど)
  },
  extends: [ 'eslint:recommended', 'plugin:prettier/recommended' ],
};