module.exports = {
  roots: ['<rootDir>/src/tests'],  // This tells Jest to look for tests in the 'src/tests' folder
  testMatch: ['**/?(*.)+(test|spec).[jt]s?(x)'], // Matches files with .test.js or .spec.js extensions
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest', // If using TypeScript, it will use ts-jest for transformation
  },
};
