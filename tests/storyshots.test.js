import initStoryshots, { renderOnly } from "@storybook/addon-storyshots";

// eslint-disable-next-line no-unused-vars
import ResizeObserver from "./__mocks__/ResizeObserver";

initStoryshots({
  test: renderOnly,
});
