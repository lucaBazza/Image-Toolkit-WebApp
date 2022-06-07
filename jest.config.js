module.exports = {
  name: "Image Toolkit Jest",
  preset: "@vue/cli-plugin-unit-jest/presets/typescript",
  moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1"
  }
};
