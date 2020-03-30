import Button from '../';
import ButtonGroupStory01 from './ButtonGroupStory01.svelte'
import { withKnobs, text } from '@storybook/addon-knobs';
import knobs from './knobs';
export default {
    title: 'Button',
    decorators: [withKnobs],
  };

export const BasicButton = () => ({
  Component: Button,
  props: {
    label: text('label', 'button text'),
    ...knobs(),
  },
})

export const BasicButtonGroup = () => ({
  Component: ButtonGroupStory01,
  props: {
    ...knobs()
  }
});