<script>
  // eslint-disable-next-line import/no-extraneous-dependencies
  import { onMount } from 'svelte';
  import { format } from 'd3-format';
  import { randomNormal } from 'd3-random';

  // eslint-disable-next-line import/no-extraneous-dependencies
  import { cubicOut as easing } from 'svelte/easing';
  import { DataGraphic } from '@graph-paper/datagraphic/base';
  import { RightAxis, BottomAxis } from '@graph-paper/guides/base';
  import { Line } from '../..';

  import HorizontalWindow from './HorizontalWindow.svelte';
  import MetricMouseover from './MetricMouseover.svelte';

  export let title = 'A Graph';
  export let supertitle;
  export let description;

  const duration = 250;
  let v1 = 50 * 10;
  let v2 = 120 * 10;

  let data;
  let mounted = false;
  let startDate = new Date(2019, 4, 4);

  onMount(() => {
    data = Array.from({ length: 200 }).map((_, i) => {
      const date = new Date(+startDate);
      date.setDate(date.getDate() + i);
      v1 += randomNormal()() * 10;
      v2 += randomNormal(0.1)() * 10;
      return {
        date, v1, v2,
      };
    });
    mounted = true;
  });

  $: datasets = [
    {
      data,
      x: 'date',
      y: 'v1',
      color: 'var(--digital-blue-500)',
      label: 'ex. 1',
    },
    {
      data,
      x: 'date',
      y: 'v2',
      color: 'var(--pantone-red-500',
      label: 'ex. 2',
    },
  ];

  </script>

  <style>
  .simple-graph {
    padding-top: var(--space-2x);
    padding-bottom: var(--space-2x);
  }

  h3 {
    font-size: var(--text-06);
    margin: 0;
  }

  .supertitle {
    /* margin-bottom: calc(var(--space-base) * -1.25); */
    font-size: var(--text-04);
    color: var(--cool-gray-600);
    text-transform: uppercase;
  }

  .description {
    font-style: italic;
    color: var(--cool-gray-650);
  }
  </style>

  <div class="simple-graph">
    <div style="padding-left: 8px;">
      {#if supertitle}
        <div class="supertitle">
          {supertitle}
        </div>
      {/if}
      <h3>{title}</h3>
      {#if description}
        <div class="description">
          {description}
        </div>
      {/if}
    </div>
    {#if mounted}
    <DataGraphic
        width={60 * 12}
        height={400}
        left={8}
        right={36}
        xType=time
        yType=linear
        yDomainMin={0}
        xDomain={[startDate, new Date('2019-12-15')]}
        xDomainTween={{ duration, easing }}
        yDomainTween={{ duration, easing }}
    >
        <RightAxis />
        <BottomAxis />
        <Line {data} x=date y=v1 />
        <Line {data} x=date y=v2 color=var(--pantone-red-500) />
        <g slot=annotation let:hoverValue let:xScale let:top let:bottom>
          <HorizontalWindow
            datasets={datasets}
            value={hoverValue.x}
            let:output
          >
          {#if hoverValue.x && hoverValue.body}
            <line
              x1={xScale(output[0].match.date)}
              x2={xScale(output[0].match.date)}
              y1={top}
              y2={bottom}
              stroke-dasharray=3,1
              stroke=var(--cool-gray-300) />

            {/if}

            <MetricMouseover
              point={(hoverValue.x ? output
                 : datasets.map((di) => ({ ...di, match: di.data.slice(-1)[0] }))).map((o) => ({
                  x: o.match[o.x],
                  y: o.match[o.y],
                  color: o.color,
                  label: o.label,
              }))}
            formatValue={format('$,r')}
          />
          </HorizontalWindow>
        </g>
    </DataGraphic>
    {/if}
  </div>
