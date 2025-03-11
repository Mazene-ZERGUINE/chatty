module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    // Enforce return type in functions
    '@typescript-eslint/explicit-function-return-type': ['error', {
      allowExpressions: false,
      allowTypedFunctionExpressions: false,
      allowHigherOrderFunctions: false,
    }],

    // Enforce explicit return types for modules
    '@typescript-eslint/explicit-module-boundary-types': 'error',

    // Disallow any usage
    '@typescript-eslint/no-explicit-any': 'error',

    // Disallow unused variables
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

    // Disallow let if variables are not reassigned
    'prefer-const': 'error',

    // Disallow unnecessary constructors in classes
    '@typescript-eslint/no-useless-constructor': 'error',

    // Disallow empty functions unless they have a specific reason
    '@typescript-eslint/no-empty-function': ['error', { allow: ['arrowFunctions', 'methods'] }],

    // Enforce consistent member ordering in classes/interfaces
    '@typescript-eslint/member-ordering': [
      'error',
      {
        default: [
          'public-static-field',
          'protected-static-field',
          'private-static-field',
          'public-instance-field',
          'protected-instance-field',
          'private-instance-field',
          'constructor',
          'public-instance-method',
          'protected-instance-method',
          'private-instance-method'
        ]
      }
    ],

    // Require using Error objects when throwing exceptions
    '@typescript-eslint/no-throw-literal': 'error',

    // Disallow unnecessary boolean literals in conditions
    'no-constant-binary-expression': 'error',

    // Disallow promise rejections with non-Error values
    '@typescript-eslint/no-redundant-type-constituents': 'error',


    // Disallow fallthrough in switch cases
    'no-fallthrough': 'error',

    // Prevent multiple variable declarations
    'one-var': ['error', 'never'],

    // Enforce consistent spacing inside curly braces
    'object-curly-spacing': ['error', 'always'],

    // Prevent excessive function nesting
    'max-depth': ['error', 4],

    // Limit the number of parameters in functions
    'max-params': ['error', 4],

    // Prevent long lines
    'max-len': ['error', { code: 100, ignoreComments: true }],

    // Enforce consistent spacing around operators
    'space-infix-ops': 'error',
  },
};
