<script>
  import { getContext } from "svelte"; // eslint-disable-line import/no-extraneous-dependencies

  export let side = getContext("side");
  export let mainDim = getContext("mainDim");
  export let orientation = getContext("gp:axis:orientation");
  export let mainScale = getContext("mainScale");
  export let bodyDimension = getContext("bodyDimension");
  export let tickDirection = getContext("tickDirection");
  export let fontSizeCorrector = getContext("fontSizeCorrector");
  export let buffer = getContext("gp:datagraphic:buffer");
  export let tickFormatter =
    getContext("tickFormatter") ||
    function format(v) {
      return v;
    };

  // the domain value where the placement should occur
  export let placement;
  export let offset = 0;
  export let fontSize = 10;
  export let fontWeight = "normal";
  export let color = "black";

  function place(v, dim, sc, bd, buff) {
    if (mainDim === dim) {
      return (
        bd +
        tickDirection * buff +
        (side === "top" || side === "bottom"
          ? tickDirection * fontSizeCorrector
          : 0) +
        (side === "left" || side === "top" ? -offset : offset)
      );
    }
    let step = sc.type === "scaleBand" ? sc.bandwidth() / 2 : 0;
    return sc(v) + step;
  }

  // let's set alignment dynamically as a dx property
  let container;
  let label;

  let textAnchor = "middle";
  if (side === "left") textAnchor = "end";
  if (side === "right") textAnchor = "start";

  $: parameters = {
    [`${mainDim}`]: place(
      placement,
      mainDim,
      $mainScale,
      $bodyDimension,
      $buffer
    ),
    [`${orientation}`]: place(
      placement,
      orientation,
      $mainScale,
      $bodyDimension,
      $buffer
    ),
    dy: orientation === "y" ? ".35em" : 0,
    "text-anchor": textAnchor,
  };
</script>

<g bind:this={container}>
  <text
    bind:this={label}
    {...parameters}
    font-size={fontSize}
    font-weight={fontWeight}
    fill={color}>
    <slot>{tickFormatter(placement)}</slot>
  </text>
</g>
