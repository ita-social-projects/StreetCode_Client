import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    roots: ['<rootDir>'],
    moduleNameMapper: {
        '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
        'antd': '<rootDir>/__mocks__/antd/Modal',
        '^@assets/(.*)$': '<rootDir>/src/assets/$1',
        // DEV_NOTE: Down below is the right solution for compiling files by path
        // But we need to fix ALL typo errors before it could be compiled
        // Temp solution - mocking modules.
        // After fixing type error remove mocks or continue using them(as more simple solution)
        /*
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@app/(.*)$': '<rootDir>/src/app/$1',
        '^@sass/(.*)$': '<rootDir>/src/assets/sass/$1',
        '^@images/(.*)$': '<rootDir>/src/assets/images/$1',
        '^@features/(.*)$': '<rootDir>/src/features/$1',
        '^@api/(.*)$': '<rootDir>/src/app/api/$1',
        '^@stores/(.*)$': '<rootDir>/src/app/stores/$1',
        '^@models/(.*)$': '<rootDir>/src/models/$1',
        '^@components/(.*)$': '<rootDir>/src/app/common/components/$1',
        '^@hooks/(.*)$': '<rootDir>/src/app/common/hooks/$1',
        '^@constants/(.*)$': '<rootDir>/src/app/common/constants/$1',
        '^@utils/(.*)$': '<rootDir>/src/app/common/utils/$1',
        */
    },
    verbose: true,
    collectCoverageFrom: [
        "src/**/*.{ts}" // temp disable coverage collection from tsx, js, jsx util type error will be fixed
    ],
    globals: {
        _env_: {
            API_URL: 'https://mock_URL.com',
        }
    },
    transform: {
        "^.+\\.svg$": "jest-transformer-svg",
    },
    coverageThreshold: {
        global: {
            statements: 0.1,
            branches: 0.0,
            functions: 0.0,
            lines: 0.1,
        }
    },
}

export default jestConfig
