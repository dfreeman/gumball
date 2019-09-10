module.exports = {
  extends: ['@dfreeman'],
  overrides: [
    {
      files: ['**/*.test.ts'],
      env: {
        jest: true,
      },
    },
  ],
};
