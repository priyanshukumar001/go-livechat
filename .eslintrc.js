module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    "quotes": "off",
    "react-native/no-inline-styles": "off",
    "react-hooks/exhaustive-deps": "warn",
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "no-unused-vars": ["off", { "argsIgnorePattern": "^_" }], // Allows variables prefixed with `_`
    "jsx-quotes": "off",
    "@typescript-eslint/no-var-requires": "off",
  },
};
