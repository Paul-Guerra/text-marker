module.exports = {
  "extends": "airbnb",
  "plugins": [],
  "parserOptions": {
   "ecmaVersion": 6,
   "sourceType": "module",
   "ecmaFeatures": {
     "experimentalObjectRestSpread": true
   }
 },
 "env": {
   "browser": true
 },
// See ESLint Rules: http://eslint.org/docs/rules/
"rules": {
  "prefer-const": "off",
  "semi": ["error", "always"],
  "comma-dangle": ["off", "always-multiline"],
  "arrow-body-style": ["error", "as-needed"],
  "no-unused-vars": "warn",
  "no-redeclare": "error",
  "no-console": "warn",
  "no-unused-vars": "warn",
  "no-mixed-operators": ["error", {"allowSamePrecedence": true}],
  "import/no-extraneous-dependencies": ["error", {"devDependencies": true, "optionalDependencies": false, "peerDependencies": false}],
}
};
