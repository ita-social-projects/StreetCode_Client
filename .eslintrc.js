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

        'linebreak-style': 'off',
        'no-console': 'off',
        'import/no-cycle': 'off',
        'react/jsx-indent': 'off',
        'no-nested-ternary': 'off',
        '@typescript-eslint/indent': 'off',
        'consistent-return': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/require-default-props': 'off',
        'react/jsx-props-no-spreading': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        'react/default-props-match-prop-types': 'off',

        curly: 'warn',
        '@typescript-eslint/no-empty-interface': 'warn',
        'no-empty-function': 'warn',
        'react/no-array-index-key': 'warn',
        'react/jsx-no-useless-fragment': 'warn',

        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',

        'brace-style': ['warn', '1tbs'],
        'object-curly-newline': [
            'error', {
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

        indent: ['error', 4, {
            ObjectExpression: 'first',
            MemberExpression: 1,
            ImportDeclaration: 'first',
        }],
        'react/jsx-indent-props': ['error', 'first'],
        'max-len': ['error', 120],
        complexity: ['error', 10],

        'react/function-component-definition': [
            2, {
                namedComponents: 'arrow-function',
                unnamedComponents: 'arrow-function',
            },
        ],
        'no-restricted-imports': [
            'error', {
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
                            ['^.+\\.?(s(c|a)ss)$'],
                            // Assets imports.
                            ['^@(images|fonts)+(/.*|$)'],
                            // Packages `react` or `MobX` related packages come first.
                            ['^@?(react|mobx)', '^@?\\w'],
                            // Ant-Design related imports.
                            ['^antd', '^@?\\w'],
                            // Internal packages.
                            ['^(@)(/.*|$)'],
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
