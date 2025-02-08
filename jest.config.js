/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  roots: ["<rootDir>/src"], 
  testMatch: ["**/*.test.ts"], 
  preset: "ts-jest",
  testEnvironment: "node",
};
