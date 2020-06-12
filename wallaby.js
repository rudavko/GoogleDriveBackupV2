module.exports = function (wallaby) {
  return {
    files: [
      'src/**/*.ts'
    ],

    tests: [
      'test/**/*test.js'
    ],
    env: {
      type: 'node',
      params: {
        env: 'CLIENT_ID=ABCD1234;CLIENT_SECRET=secret789'
      }
    },
    compilers: {
      '**/*.ts?(x)': wallaby.compilers.typeScript({
        module: "CommonJS"
      })
    },
    testFramework: 'jest',
  };
};