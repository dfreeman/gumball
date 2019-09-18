module.exports = {
  extends: ['@dfreeman'],
  env: {
    es6: true
  },
  overrides: [
    {
      files: ['**/*.test.ts'],
      env: {
        jest: true,
      },
    },
  ],
};
