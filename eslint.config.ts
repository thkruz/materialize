import storybook from 'eslint-plugin-storybook';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { files: ['src/**/*.{ts,js,mjs}'] },
  {
    // https://eslint.org/docs/latest/use/configure/configuration-files
    // The *[sS]pec.js / spec/helper.js are generated from the TypeScript specs by
    // build-specs.mts (npm run pretest) and are gitignored — never lint them.
    ignores: [
      'dist',
      'storybook-static',
      'tsconfig.json',
      'node_modules',
      'components/**/*[sS]pec.js',
      'spec/*[sS]pec.js',
      'spec/helper.js'
    ]
  },
  ...tseslint.configs.recommended,
  ...storybook.configs['flat/recommended'],
  {
    rules: {
      'prefer-const': 'error',
      'prefer-rest-params': 'warn',
      'no-var': 'warn',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-unused-expressions': 'error',
      '@typescript-eslint/no-this-alias': 'warn',
      '@typescript-eslint/no-empty-object-type': ['error', { allowWithName: 'BaseOptions$' }],
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/no-unsafe-function-type': 'error'
    }
  },
  {
    // The Jasmine browser specs exercise the built global `M` bundle, which is
    // intentionally untyped (any) at test time, so `any` is expected here.
    files: ['**/*[sS]pec.ts', 'spec/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
);
