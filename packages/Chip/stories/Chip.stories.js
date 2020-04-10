import ChipStoroy01 from "./Chip01.svelte";
import { withKnobs } from "@storybook/addon-knobs";
export default {
  title: "Chip",
  decorators: [withKnobs],
};

export const Chip01 = () => ({
  Component: ChipStoroy01,
  props: {},
});
