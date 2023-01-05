module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: [
        '@typescript-eslint',
        'simple-import-sort',
    ],
    env: {
        node: true,
    },
    extends: [
        'airbnb',
        'airbnb-typescript',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
    ],
    rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
        'no-console': 'off',
        'max-len': ['error', 120],
        '@typescript-eslint/indent': 'off',
        'react/jsx-props-no-spreading': 'off',
        'react/react-in-jsx-scope': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',
        'no-restricted-imports': [
            'error',
            {
                patterns: ['../../'],
            },
        ],
    },
    overrides: [
        {
            files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
            rules: {
                'simple-import-sort/imports': [
                    'error',
                    {
                        groups: [
                            // Style imports.
                            ['^.+\\w?(\\.(styles|module)\\.s?(c|a)ss)$'],
                            // Packages `react` related packages come first.
                            ['^react', '^@?\\w'],
                            // Internal packages.
                            ['^(@|components)(/.*|$)'],
                            // Side effect imports.
                            ['^\\u0000'],
                            // Parent imports. Put `..` last.
                            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
                            // Other relative imports. Put same-folder imports and `.` last.
                            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
                        ],
                    },
                ],
            },
        },
    ],
};
