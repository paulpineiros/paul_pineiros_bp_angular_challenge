module.exports = {
    preset: 'jest-preset-angular',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
    moduleFileExtensions: ['ts', 'html', 'js', 'json'],
    transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    collectCoverageFrom: [
      'src/app/**/*.ts',
      '!src/main.ts',
      '!src/environments/**', 
    ],
  };
  