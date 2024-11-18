// jest.config.js
module.exports = {
    transform: {
      '^.+\\.js$': 'babel-jest',
    },
    testEnvironment: 'jest-environment-jsdom',
    moduleNameMapper: {
      '^firebase/(.*)$': '<rootDir>/node_modules/firebase/$1',
    },
};