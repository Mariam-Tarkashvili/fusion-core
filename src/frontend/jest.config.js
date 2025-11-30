export default {
  testEnvironment: "jsdom",
  verbose: true,
  setupFilesAfterEnv: ["./jest.setup.js"],

  // Handle CSS/SCSS imports
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^@/(.*)$": "/src/$1",
  },

  // Transform JSX with Babel
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": [
      "babel-jest",
      {
        presets: ["@babel/preset-env", "@babel/preset-react"],
      },
    ],
  },

  // Coverage configuration
  collectCoverageFrom: ["src/**/*.{js,jsx}", "!src/index.js", "!src/**/*.test.{js,jsx}", "!src/**/__tests__/**"],

  // Where to find test files
  testMatch: ["/src/**/__tests__/**/*.{js,jsx}", "/src/**/*.{spec,test}.{js,jsx}"],
};
