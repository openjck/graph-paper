<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import { setContext, getContext, onMount } from 'svelte';
// eslint-disable-next-line import/no-extraneous-dependencies
import { writable, derived } from 'svelte/store';
// eslint-disable-next-line import/no-extraneous-dependencies
import { tweened } from 'svelte/motion';
import {
  scalePoint, scaleLinear, scaleSymlog, scaleTime, scaleBand,
} from 'd3-scale';

import { getDomainFromExtents } from './extents';

export let svg;
// key is used to uniquely identify a DataGraphic.
// users can supply their own, but one must exist.
// http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
export let key = Math
  .random()
  .toString(36)
  .substring(2, 15) + Math.random()
  .toString(36).substring(2, 15);

export let xDomainMin;
export let xDomainMax;
export let xDomain = [xDomainMin, xDomainMax];
export let xDomainTween = { duration: 0 };

export let yDomainMin;
export let yDomainMax;
export let yDomain = [yDomainMin, yDomainMax];
export let yDomainTween = { duration: 0 };

export let xType = 'linear';
export let yType = 'linear';

export let left = 50;
export let right = 16;
export let top = 50;
export let bottom = 20;
export let laneGap = 30;
export let buffer = 5;

// borders
export let borderColor = 'var(--cool-gray-200)';
export let borderThickness = 1;
export let borderOpacity = 1;
export let leftBorder;
export let rightBorder;
export let topBorder;
export let bottomBorder;
export let leftBorderColor = borderColor;
export let rightBorderColor = borderColor;
export let topBorderColor = borderColor;
export let bottomBorderColor = borderColor;
export let leftBorderThickness = borderThickness;
export let rightBorderThickness = borderThickness;
export let topBorderThickness = borderThickness;
export let bottomBorderThickness = borderThickness;
export let leftBorderOpacity = borderOpacity;
export let rightBorderOpacity = borderOpacity;
export let topBorderOpacity = borderOpacity;
export let bottomBorderOpacity = borderOpacity;

export let backgroundColor = 'transparent';

let borders = [];
$: borders = [
  [leftBorder, leftBorderColor, leftBorderThickness,
    leftBorderOpacity, $leftPlot, $leftPlot,
    $topPlot - topBorderThickness / 2, $bottomPlot + bottomBorderThickness / 2],
  [rightBorder, rightBorderColor, rightBorderThickness,
    rightBorderOpacity, $rightPlot, $rightPlot,
    $topPlot - topBorderThickness / 2, $bottomPlot + bottomBorderThickness / 2],
  [topBorder, topBorderColor, topBorderThickness,
    topBorderOpacity, $leftPlot, $rightPlot,
    $topPlot, $topPlot],
  [bottomBorder, bottomBorderColor, bottomBorderThickness,
    bottomBorderOpacity, $leftPlot, $rightPlot,
    $bottomPlot, $bottomPlot],
];

export let xPadding = 0.5;
export let xInnerPadding = xPadding;
export let xOuterPadding = xPadding;
export let yPadding = 0;
export let yInnerPadding = yPadding;
export let yOuterPadding = yPadding;

export let margins = {
  left,
  right,
  top,
  bottom,
  laneGap,
  buffer,
};

const DEFAULTS = {
  elementWidth: 60,
  axisTickFontSize: 10,
  flyParams: { y: 10, duration: 300 },
  fadeParams: { duration: 300 },
};

setContext('defaults', DEFAULTS);
setContext('margins', margins);

setContext('key', key);

export let width = getContext('width') || 800;
export let height = getContext('height') || 300;

// graphic width, graphic height, body width, body height
export let graphicWidth = writable(width);
$: $graphicWidth = width;

export let graphicHeight = writable(height);
$: $graphicHeight = height;

export let bodyWidth = derived(graphicWidth, ($width) => $width - margins.left - margins.right);
export let bodyHeight = derived(graphicHeight, ($height) => $height - margins.top - margins.bottom);


// set the locations of the plot bounds
export let leftPlot = derived(graphicWidth, () => margins.left);
export let rightPlot = derived(graphicWidth, ($width) => $width - margins.right);

export let topPlot = derived(graphicHeight, () => margins.top);
export let bottomPlot = derived(graphicHeight, ($height) => $height - margins.bottom);

setContext('graphicWidth', graphicWidth);
setContext('graphicHeight', graphicHeight);
setContext('bodyWidth', bodyWidth);
setContext('bodyHeight', bodyHeight);

setContext('leftPlot', leftPlot);
setContext('rightPlot', rightPlot);
setContext('topPlot', topPlot);
setContext('bottomPlot', bottomPlot);

function getScaleFunction(type) {
  if (type === 'time') return scaleTime;
  if (type === 'scalePoint') return scalePoint;
  if (type === 'scaleBand') return scaleBand;
  if (type === 'numeric' || type === 'linear') return scaleLinear;
  if (type === 'log') return scaleSymlog;
  return scalePoint;
}

// FIXME: refactor.
function createXPointScale(values) {
  const scaleFunction = getScaleFunction(xType);
  let scale = scaleFunction()
    .domain(values)
    .range([$leftPlot, $rightPlot]);

  if (xType === 'scalePoint') {
    scale = scale.padding(xPadding);
  }
  if (xType === 'scaleBand') {
    scale = scale.paddingInner(xInnerPadding).paddingOuter(xOuterPadding);
  }
  scale.type = xType;
  return scale;
}

// FIXME: refactor.
function createYPointScale(values) {
  // const scaleFunction = yType === 'scalePoint' ? scalePoint : scaleLinear;
  const scaleFunction = getScaleFunction(yType);

  let scale = scaleFunction().domain(values).range([$bottomPlot, $topPlot]);
  if (yType === 'scalePoint') {
    scale = scale.padding(yPadding);
  }
  if (yType === 'scaleBand') {
    scale = scale.paddingInner(yInnerPadding).paddingOuter(yOuterPadding);
  }
  scale.type = yType;
  return scale;
}

// /////////////////////////////////////////////////////////////////////////

function firstDefinedValue(...vars) {
  let i = 0;
  while (i < vars.length) {
    const v = vars[i];
    if (v !== undefined) {
      return v;
    }
    i += 1;
  }
  return undefined;
}

function initializeDomain(scaleType) {
  if (scaleType === 'time') return [new Date(), new Date()];
  return [0, 1];
}

let internalXDomain = tweened(initializeDomain(xType), xDomainTween);
let internalYDomain = tweened(initializeDomain(yType), yDomainTween);

// update the scale stores if the domain changes.
// FIXME: refactor these functions to take range arguments as well,
// and xPadding. etc. etc. – this should be completely reactive
// w/ all relevant scale arguments.

export let xScaleStore = writable(createXPointScale($internalXDomain));
export let yScaleStore = writable(createYPointScale($internalYDomain));

export let xScale = $xScaleStore;
export let yScale = $yScaleStore;

$: xScale = $xScaleStore;
$: yScale = $yScaleStore;

const xExtents = writable({});
const yExtents = writable({});

setContext('gp:datagraphic:xExtents', xExtents);
setContext('gp:datagraphic:yExtents', yExtents);

$: xPlotExtents = getDomainFromExtents($xExtents);
$: yPlotExtents = getDomainFromExtents($yExtents);

$: $internalXDomain = [
  firstDefinedValue(xDomainMin, xDomain[0], xPlotExtents[0]),
  firstDefinedValue(xDomainMax, xDomain[1], xPlotExtents[1]),
];

$: $internalYDomain = [
  firstDefinedValue(yDomainMin, yDomain[0], yPlotExtents[0]),
  firstDefinedValue(yDomainMax, yDomain[1], yPlotExtents[1]),
];

$: $xScaleStore = createXPointScale($internalXDomain);
$: $yScaleStore = createYPointScale($internalYDomain);

setContext('xScale', xScaleStore);
setContext('yScale', yScaleStore);

const internalRolloverStore = writable({
  x: undefined, y: undefined, px: undefined, py: undefined,
});

function createMouseStore(svgElem) {
  let parentSVG = svgElem;
  return {
    setSVG(mountedSVG) {
      parentSVG = mountedSVG;
    },
    subscribe: internalRolloverStore.subscribe,
    onMouseleave() {
      internalRolloverStore.set({
        x: undefined,
        y: undefined,
        px: undefined,
        py: undefined,
        body: false,
      });
    },
    onMousemove(e, xs, ys) {
      if (!parentSVG) return;
      let { clientX, clientY } = e;
      const pt = parentSVG.createSVGPoint();
      pt.x = clientX;
      pt.y = clientY;
      let svgP = pt
        .matrixTransform(parentSVG.getScreenCTM().inverse());
      let actualX = svgP.x;
      let actualY = svgP.y;
      let x;
      let y;
      // set if cursor is in body area.
      let body = false;
      if (actualX > $leftPlot
        && actualX < $rightPlot
        && actualY > $topPlot
        && actualY < $bottomPlot) {
        body = true;
      }
      if (xs.type === 'scalePoint') {
        const step = xs.step();
        const xCandidates = xs.domain()
          .filter((d) => (xs(d) - step / 2) < actualX && xs(d) < $rightPlot);
        x = xCandidates[xCandidates.length - 1];
      } else if (xs.type === 'scaleBand') {
        const xCandidates = xs.domain()
          .filter((d) => xs(d) < actualX && xs(d) < $rightPlot);
        x = xCandidates[xCandidates.length - 1];
      } else {
        x = xs.invert(actualX);
      }
      if (ys.type === 'scalePoint') {
        const yCandidates = ys.domain().filter((d) => ys(d) < actualY);
        [y] = yCandidates;
      } else {
        y = ys.invert(actualY);
      }
      const nextState = {
        x, y, px: actualX, py: actualY, body,
      };

      internalRolloverStore.set(nextState);
    },
  };
}

export let rollover = createMouseStore(svg);

export let dataGraphicMounted = false;

const emptyValue = () => ({
  x: undefined, y: undefined, px: undefined, py: undefined,
});

export let hoverValue = emptyValue();

onMount(() => {
  dataGraphicMounted = true;
});

$: if (dataGraphicMounted) {
  // initiateRollovers(svg)
  rollover.setSVG(svg);
  internalRolloverStore.subscribe((v) => {
    hoverValue = v;
  });
}

</script>

<style>

.data-graphic-container {
  display: grid;
  align-content: center;
  justify-content: center;
}

</style>

<div class=data-graphic-container style="width: {$graphicWidth}px; height: {$graphicHeight}px;">
  <svg
    style="width: {$graphicWidth}px; height: {$graphicHeight}px;"
    bind:this={svg}
    shape-rendering="auto"
    viewbox='0 0 {$graphicWidth} {$graphicHeight}'
    on:mousemove={(e) => { rollover.onMousemove(e, $xScaleStore, $yScaleStore); }}
    on:mouseleave={(e) => { rollover.onMouseleave(e, $xScaleStore, $yScaleStore); }}
    on:click
    on:mousedown
    on:mouseup
    on:mousemove
  >
  <rect
    x={$leftPlot} y={$topPlot} width={$bodyWidth} height={$bodyHeight}
    fill={backgroundColor}
  />

  <clipPath id='graphic-body-{key}'>
      <rect
        x={$leftPlot}
        y={$topPlot}
        width={$bodyWidth}
        height={$bodyHeight}
      />
    </clipPath>

    {#if dataGraphicMounted}
      <g id='graphic-body-background-{key}' style="clip-path: url(#graphic-body-{key})">
        <slot name='body-background'
          xScale={xScale}
          yScale={yScale}
          left={$leftPlot}
          right={$rightPlot}
          top={$topPlot}
          bottom={$bottomPlot}
          width={$graphicWidth}
          height={$graphicHeight}
        ></slot>
      </g>
    {/if}

    {#if dataGraphicMounted}
    <g>
      <slot name='background'
        hoverValue={hoverValue}
        xScale={xScale}
        yScale={yScale}
        left={$leftPlot}
        right={$rightPlot}
        top={$topPlot}
        bottom={$bottomPlot}
        width={$graphicWidth}
        height={$graphicHeight}
      ></slot>
    </g>
  {/if}

  {#if dataGraphicMounted}
    <g id='graphic-body-{key}' style="clip-path: url(#graphic-body-{key})">
      <slot name='body'
        xScale={xScale}
        yScale={yScale}
        left={$leftPlot}
        right={$rightPlot}
        top={$topPlot}
        bottom={$bottomPlot}
        width={$graphicWidth}
        height={$graphicHeight}
        hoverValue={$internalRolloverStore}
      ></slot>
    </g>
  {/if}

    <!-- generalized slot at body level -->
    {#if dataGraphicMounted}
      <slot></slot>
    {/if}

    <use clip-path="url(#graphic-body-{key})" xlink:href="#graphic-body-content={key}" fill="transparent" />

    <!-- pass the rollover value into the scale -->
    {#if dataGraphicMounted}
      <slot name='mouseover'
        value={$internalRolloverStore}
        xScale={xScale}
        yScale={yScale}
        left={$leftPlot}
        right={$rightPlot}
        top={$topPlot}
        bottom={$bottomPlot}
        width={$graphicWidth}
        height={$graphicHeight}
      ></slot>
    {/if}

      <!-- data graphic borders -->
    {#each borders as [showBorder, color, thickness, opacity, x1, x2, y1, y2]}
      {#if showBorder}
        <line x1={x1} x2={x2} y1={y1} y2={y2} stroke={color} stroke-width={thickness} opacity={opacity} />
      {/if}
    {/each}


    <!-- Annotation layers – for additional points, comments, etc. that must sit above everything else -->
    {#if dataGraphicMounted}
      <slot name='annotation'
        xScale={xScale}
        yScale={yScale}
        left={$leftPlot}
        right={$rightPlot}
        top={$topPlot}
        bottom={$bottomPlot}
        width={$graphicWidth}
        height={$graphicHeight}
        hoverValue={$internalRolloverStore}
      ></slot>
    {/if}
  </svg>
</div>