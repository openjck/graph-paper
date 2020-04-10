<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import { cubicOut } from 'svelte/easing';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher();
export let key;
export let togglable = false;
export let cancelable = false;
export let toggled = false;

// FIXME: consider moving this to core if we can figure out the margin-left calc below.
export function fold(node, {
  delay = 0,
  duration = 400,
  easing = cubicOut,
}) {
  const style = getComputedStyle(node);
  const opacity = +style.opacity;
  const width = parseFloat(style.width);
  const paddingLeft = parseFloat(style.paddingLeft);
  const paddingRight = parseFloat(style.paddingRight);
  const marginLeft = parseFloat(style.marginTop);
  const marginRight = parseFloat(style.marginBottom);
  const borderLeftWidth = parseFloat(style.borderLeftWidth);
  const borderRightWidth = parseFloat(style.borderRightWidth);

  return {
    delay,
    duration,
    easing,
    css: (t) => 'overflow: hidden;'
      + 'white-space: nowrap;'
      + `opacity: ${Math.min(t, 1) * opacity};`
      + `width: ${t * width}px;`
      + `padding-right: ${t * paddingRight}px;`
      + `padding-left: ${t * paddingLeft}px;`
      + `margin-left: ${t * marginLeft - (1 - t) * 8}px;` // FIXME: what math should we implement here?
      + `margin-right: ${t * marginRight}px;`
      + `border-left-width: ${t * borderLeftWidth}px;`
      + `border-right-width: ${t * borderRightWidth}px;`,
  };
}

function cancel() {
  dispatch('cancel', key);
}

</script>

<div
  class:gp-chip--togglable={togglable}
  class:gp-chip--toggled={toggled}
  on:click class="gp-chip"
  transition:fold|local={{ duration: 200 }}
>
  <slot></slot>
  <!-- FIXME: move to x icon once that package has been ported over -->
  {#if cancelable}
    <div on:click={cancel}>x</div>
  {/if}
</div>
