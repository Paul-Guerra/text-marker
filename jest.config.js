module.exports = {
  testPathIgnorePatterns: ['node_modules', 'tmp/'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js', '!src/**/__stubs__/**']
};
