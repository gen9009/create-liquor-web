import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['node_modules', 'main.ts'],
  rules: {
    'no-console': 'off',
    'antfu/if-newline': 'off',
  },
})
