<script>
  import { getContext } from "svelte"; // eslint-disable-line import/no-extraneous-dependencies

  export let dashArray;
  export let orientationScale = getContext("gp:axis:orientationScale");
  export let response = getContext("gp:axis:response");
  export let orientation = getContext("gp:axis:orientation");
  export let tickDirection = getContext("tickDirection");
  export let bodyDimension = getContext("bodyDimension");
  export let side = getContext("side");

  export let buffer = getContext("gp:datagraphic:buffer");

  export let placement;
  export let offset = 0;
  export let length = $buffer; // $tickEnd;
  export let width = 1;
  export let color = "var(--cool-gray-300)";

  let sideOffset;
  $: sideOffset = side === "left" || side === "top" ? -offset : offset;
  export let step =
    $orientationScale.type === "scaleBand"
      ? $orientationScale.bandwidth() / 2
      : 0;

  $: parameters = {
    [`${response}2`]: $bodyDimension + sideOffset + tickDirection * length,
    [`${response}1`]: $bodyDimension + sideOffset,
    [`${orientation}1`]: $orientationScale(placement) + step,
    [`${orientation}2`]: $orientationScale(placement) + step,
  };
</script>

<line
  class="tick"
  {...parameters}
  stroke-dasharray={dashArray}
  stroke={color}
  stroke-width={width} />
