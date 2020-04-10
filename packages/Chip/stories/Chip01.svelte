<script>
import Stack from '@graph-paper/stack';
import { Button } from '@graph-paper/button';
import Chip from '..';

let which = 0;
function setToggle(w) {
  return () => { which = w; };
}


let index = 0;
let cancelables = [];
function addCancelable() {
  cancelables = [...cancelables, index];
  index += 1;
}

function removeCancelable(k) {
  cancelables = [...cancelables.filter((c) => c !== k)];
}

addCancelable();
addCancelable();
addCancelable();

</script>

<style>
div {
  display: flex;
  --chip-group-gap: var(--space-2x);
  gap: var(--space-2x) var(--space-base);
}
</style>

<Stack space={2}>
<div>
  <Chip>One</Chip>
  <Chip>Two</Chip>
  <Chip>Three</Chip>
  <Chip>Four</Chip>
</div>

<div>
  <Chip togglable toggled={which === 0} on:click={setToggle(0)}>One</Chip>
  <Chip togglable toggled={which === 1} on:click={setToggle(1)}>Two</Chip>
  <Chip togglable toggled={which === 2} on:click={setToggle(2)}>Three</Chip>
  <Chip togglable toggled={which === 3} on:click={setToggle(3)}>Four</Chip>
</div>

<div>
  {#each cancelables as c, i (c)}
    <Chip cancelable key={c} on:cancel={removeCancelable(c)}>cancel {c}</Chip>
  {/each}
</div>

<Button compact level=low on:click={addCancelable}>+ Add Item</Button>

</Stack>
