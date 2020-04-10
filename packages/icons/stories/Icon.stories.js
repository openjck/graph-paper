import AllIconsStory from "./AllIcons.svelte";
import { withKnobs, number, color } from "@storybook/addon-knobs";
export default {
  title: "Icon",
  decorators: [withKnobs],
};

export const AllIcons = () => ({
  Component: AllIconsStory,
  props: {
    size: number("size", 24),
    color: color("color", "#000"),
  },
});
