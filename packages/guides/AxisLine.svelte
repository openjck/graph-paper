<script>
  import { getContext } from "svelte"; // eslint-disable-line import/no-extraneous-dependencies

  export let orientationScale = getContext("gp:axis:orientationScale");
  export let side = getContext("side");
  export let response = getContext("gp:axis:response");
  export let orientation = getContext("gp:axis:orientation");
  export let bodyDimension = getContext("bodyDimension");
  export let minimumDimension = getContext("minimumDimension");
  export let maximumDimension = getContext("maximumDimension");
  export let start;
  export let end;
  export let color = "var(--cool-gray-400)";
  export let width = 1;
  export let offset = 0;

  $: if (!start) start = $orientationScale.domain()[0]; //eslint-disable-line
  $: if (!end) end = $orientationScale.domain().slice(-1)[0]; //eslint-disable-line
  let sideOffset = side === "left" || side === "top" ? -offset : offset;

  $: parameters = {
    [`${orientation}1`]: $minimumDimension,
    [`${orientation}2`]: $maximumDimension,
    [`${response}1`]: $bodyDimension + sideOffset,
    [`${response}2`]: $bodyDimension + sideOffset,
  };
</script>

<line {...parameters} stroke={color} stroke-width={width} />
