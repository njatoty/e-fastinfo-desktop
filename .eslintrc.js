module.exports = {
  extends: [
    'erb',
    'plugin:react-hooks/recommended',
    'plugin:tailwindcss/recommended', // optional but helpful for Tailwind users
  ],
  rules: {
    // A temporary hack related to IDE not resolving correct package.json
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'error',

    // Since React 17 and typescript 4.1 you can safely disable the rule
    'react/react-in-jsx-scope': 'off',

    // Disable prefer-default-export
    'import/prefer-default-export': 'off',

    // Allow spreading props (used often in shadcn/ui components)
    'react/jsx-props-no-spreading': 'off',

    // Prettier-related rules
    'prettier/prettier': [
      'warn',
      {
        singleQuote: true,
        jsxSingleQuote: false,
        printWidth: 100,
        trailingComma: 'all',
        bracketSpacing: true,
        arrowParens: 'avoid',
        semi: true,
      },
    ],
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    createDefaultProgram: true,
  },
  settings: {
    'import/resolver': {
      node: {},
      webpack: {
        config: require.resolve('./.erb/configs/webpack.config.eslint.ts'),
      },
      typescript: {},
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
};
