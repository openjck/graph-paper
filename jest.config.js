module.exports = {
  moduleFileExtensions: ["js", "json", "svelte"],
  transform: {
    "^.+\\.js$": "babel-jest",
    "^.+\\.svelte$": "jest-transform-svelte",
    "^.+\\.stories\\.js$":
      "<rootDir>node_modules/@storybook/addon-storyshots/injectFileName",
    "^.+\\.css$": "jest-transform-css",
  },
  moduleDirectories: ["node_modules"],
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
};
