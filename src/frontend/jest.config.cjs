module.exports = {
  testEnvironment: "jsdom",
  verbose: true,
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  // Explicitly set root directory
  rootDir: "./",

  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },

  transform: {
    "^.+\\.(js|jsx)$": [
      "babel-jest",
      {
        presets: ["@babel/preset-env", "@babel/preset-react"],
      },
    ],
  },

  // Look for test files anywhere in src/
  testMatch: [
    "**/src/**/*.test.js",
    "**/src/**/*.test.jsx",
    "**/src/**/__tests__/**/*.js",
    "**/src/**/__tests__/**/*.jsx",
  ],

  // Make sure these file extensions are recognized
  moduleFileExtensions: ["js", "jsx", "json"],
};
