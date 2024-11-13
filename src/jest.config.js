module.exports = {
  roots: ['<rootDir>/src'],
  testMatch: ['**/?(*.)+(test|spec).[jt]s?(x)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
};
