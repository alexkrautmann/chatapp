const eslintPluginJest = require('eslint-plugin-jest');
const typescriptEslintPlugin = require('@typescript-eslint/eslint-plugin');

module.exports = {
  extends: ["airbnb-typescript", "plugin:monorepo/recommended"],
  settings: {
    'import/resolver': {
      "typescript": {
        "directory": "./tsconfig.eslint.json"
      }
    }
  },
  plugins: ["monorepo"],
  rules: {
    // prefer named exports (tree-shaking)
    'import/prefer-default-export': ['off'],
    // unfortunately this needs to be turned off since the above import/resolver clashes with it
    'monorepo/no-relative-import': ['off'],
  },
  "overrides": [
    {
      "files": ["*.ts", '*.tsx'],
      "rules": {
        ...typescriptEslintPlugin.configs.recommended.rules,
        'import/no-default-export': ['error'],
        '@typescript-eslint/indent': ['error', 2],
        '@typescript-eslint/camelcase': ['error', { properties: 'never' }]
      }
    },
    {
      "files": ["*.spec.ts", "*.spec.tsx"],
      plugins: ['jest'],
      env: {
        'jest': true
      },
      rules: {
        ...eslintPluginJest.configs.recommended.rules,
        ...eslintPluginJest.configs.recommended.rules,
      }
    },
    {
      "files": ["*.stories.ts", "*.stories.tsx"],
      plugins: ['jest'],
      rules: {
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }]
      }
    }
  ]
};
