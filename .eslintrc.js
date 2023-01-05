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
        'jsx-a11y/click-events-have-key-events': 'off',
        'jsx-a11y/no-noninteractive-element-interactions': 'off',
        'jsx-a11y/no-static-element-interactions': 'off',

        'no-console': 'off',
        'max-len': ['error', 120],
        '@typescript-eslint/indent': 'off',
        'consistent-return': 'off',
        'object-curly-newline': [
            'error',
            {
                ObjectExpression: {
                    multiline: true,
                    minProperties: 3,
                },
                ObjectPattern: {
                    multiline: true,
                    minProperties: 5,
                },
                ImportDeclaration: {
                    multiline: true,
                    minProperties: 5,
                },
                ExportDeclaration: 'never',
            },
        ],

        'react/jsx-props-no-spreading': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/require-default-props': 'off',
        'react/function-component-definition': [
            2,
            {
                namedComponents: 'arrow-function',
                unnamedComponents: 'arrow-function',
            },
        ],

        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-empty-interface': 'off',

        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',
        'no-restricted-imports': [
            'error',
            {
                patterns: ['../'],
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
                            ['^.*(s?(a|c)ss)$'],
                            // Packages `react` related packages come first.
                            ['^@?react'],
                            // Antd-related imports.
                            ['^@?antd'],
                            // Internal packages.
                            ['^(@|components)(/.*|$)'],
                            // Side effect imports.
                            ['^\\u0000'],
                            // Other relative imports. Put same-folder imports and `.` last.
                            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
                        ],
                    },
                ],
            },
        },
    ],
};
