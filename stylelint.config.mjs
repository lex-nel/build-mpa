/** @type {import('stylelint').Config} */

export default {
  extends: ['stylelint-config-standard', 'stylelint-prettier/recommended'],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['reference', 'theme'],
      },
    ],
    'at-rule-no-deprecated': [
      true,
      {
        ignoreAtRules: ['apply'],
      },
    ],
    'media-query-no-invalid': [
      true,
      {
        ignoreFunctions: ['theme'],
      },
    ],
    'import-notation': 'string',
  },
}
