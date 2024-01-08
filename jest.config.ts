import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    roots: ['<rootDir>'],
    moduleNameMapper: {
        '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
        'antd': '<rootDir>/__mocks__/antd/Modal'
        // DEV_NOTE: Down below is the right solution for compiling files by path
        // But before that we need to fix ALL typo error before it could be complied
        // Temp solution - mocking store/root-store. It will be added in mocks folder
        // After fixing type error remove mock or continue using it(as more simple solution)
        /*
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@app/(.*)$': '<rootDir>/src/app/$1',
        '^@assets/(.*)$': '<rootDir>/src/assets/fonts/$1',
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
        "src/**/*.{ts, tsx, js, jsx}"
    ],
    globals: {
        _env_: {
            API_URL: 'https://mock_URL.com',
        }
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
