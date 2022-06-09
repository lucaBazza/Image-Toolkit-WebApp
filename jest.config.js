const {defaults} = require('jest-config') // non necessario
//const {fetch} = require('node-fetch')

module.exports = {
  name: "Image Toolkit Jest",
  preset: "@vue/cli-plugin-unit-jest/presets/typescript",
  //transform:{
  //  '^.+\\.vue$':'vue-jest'
  //},
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
//    "^@/(.*)$": "<rootDir>/src/components/$1"
  },
  transformIgnorePatterns: [
    "node_modules/(?!@ngrx|(?!deck.gl)|ng-dynamic)"
  ],
  //globals:{ fetch, Response, Request }
};
