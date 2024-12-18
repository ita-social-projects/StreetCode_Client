import type { JestConfigWithTsJest } from 'ts-jest';
const jestConfig: JestConfigWithTsJest = {

  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: ["<rootDir>"],
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "^antd/es/(.*)$": "<rootDir>/node_modules/antd/lib/$1",
    "^@assets/(.*)$": "<rootDir>/src/assets/$1",
    "^antd/es/date-picker/locale/uk_UA$": "<rootDir>/__mocks__/antd/es/date/localeprovider.tsx",
    "^@stores/root-store$": "<rootDir>/__mocks__/@stores/root-store.tsx", 
    "^@components/FileUploader/FileUploader.component$": "<rootDir>/__mocks__/@components/FileUploader.component.tsx",
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@app/(.*)$": "<rootDir>/src/app/$1",
    "^@sass/(.*)$": "<rootDir>/src/assets/sass/$1",
    "^@images/(.*)$": "<rootDir>/src/assets/images/$1",
    "^@features/(.*)$": "<rootDir>/src/features/$1",
    "^@api/(.*)$": "<rootDir>/src/app/api/$1",
    "^@stores/(.*)$": "<rootDir>/src/app/stores/$1",
    "^@models/(.*)$": "<rootDir>/src/models/$1",
    "^@components/(.*)$": "<rootDir>/src/app/common/components/$1",
    "^@hooks/(.*)$": "<rootDir>/src/app/common/hooks/$1",
    "^@constants/(.*)$": "<rootDir>/src/app/common/constants/$1",
    "^@utils/(.*)$": "<rootDir>/src/app/common/utils/$1",
  },
  verbose: true,
  collectCoverageFrom: [
    "src/**/*.{ts,js,tsx,jsx}"
  ],
  globals: {
    _env_: {
      API_URL: "https://mock_URL.com",
    },
  },
  transform: {
    "^.+\\.svg$": "jest-transformer-svg",
  },
  coverageThreshold: {
    global: {
      statements: 0.1,
      branches: 0.1,
      functions: 0.1,
      lines: 0.1,
    },
  },
  testTimeout: 15_000,
};

export default jestConfig;

