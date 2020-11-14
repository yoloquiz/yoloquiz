module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'airbnb-base',
    "prettier",
  ],
  'plugins': ['prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        '#': 'prettier config in here :)',
        arrowParens: 'always',
        printWidth: 120,
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'all',
      },
    ],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // Disallow Early Use except functions and variables in upper scopes
    'no-use-before-define': ['error', { functions: false, variables: false }],
    "import/resolver": {
        "node": {
            "extensions": [".js",".jsx"]
        }
    }
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],
};
