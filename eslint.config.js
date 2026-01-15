//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  ...tanstackConfig,
  {
    rules: {
      // Prevent await in loops - use Promise.all instead
      '@typescript-eslint/no-floating-promises': 'error',
      'no-await-in-loop': 'warn',

      // Disallow `any` type
      '@typescript-eslint/no-explicit-any': 'error',

      // Disallow type assertions with `as` (use type guards instead)
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        {
          assertionStyle: 'never',
        },
      ],

      // Disallow non-null assertions (!)
      '@typescript-eslint/no-non-null-assertion': 'error',
    },
  },
]
