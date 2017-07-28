module.exports = {
  "extends": "airbnb",
  "plugins": [
      "react"
  ],
  "parserOptions": {
   "ecmaVersion": 6,
   "sourceType": "module",
   "ecmaFeatures": {
     "jsx": true,
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
  "react/prop-types": "error",
  "react/no-multi-comp": "error",
  "react/jsx-closing-bracket-location": "warn",
  "no-unused-vars": "warn",
  "no-mixed-operators": ["error", {"allowSamePrecedence": true}],
  "import/no-extraneous-dependencies": ["error", {"devDependencies": true, "optionalDependencies": false, "peerDependencies": false}],
  "jsx-a11y/href-no-hash": "off", // Added to work around an incompatible peer dependency. see https://github.com/facebookincubator/create-react-app/issues/2631#issuecomment-317207675
  "jsx-a11y/anchor-is-valid": ["warn", { "aspects": ["invalidHref"] }]
}
};
