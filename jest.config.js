// jest.config.js
module.exports = {
    transform: {
      '^.+\\.js$': 'babel-jest',
    },
    testEnvironment: 'jest-environment-jsdom',
};