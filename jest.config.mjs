
/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  verbose: true,
  preset: "ts-jest",
  roots: ["<rootDir>/e2e/"],
  testEnvironment: "node",
  moduleNameMapper: {
    "^@e2e/(.*)": "<rootDir>/e2e/$1",
  },
};
