export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(png|jpg|jpeg|gif|svg|webp)$': '<rootDir>/src/__mocks__/fileMock.ts',
    'lib/axios$': '<rootDir>/src/__mocks__/axiosClientMock.ts',
    'checkout/api$': '<rootDir>/src/__mocks__/checkoutApiMock.ts',
    'constants/wompi$': '<rootDir>/src/__mocks__/wompiConstantsMock.ts',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        verbatimModuleSyntax: false,
        esModuleInterop: true,
      },
      useESM: false,
      isolatedModules: true,
    }],
  },
  extensionsToTreatAsEsm: [],
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/**/__mocks__/**',
    '!src/setupTests.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
