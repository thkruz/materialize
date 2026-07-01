import type { Meta, StoryObj } from '@storybook/html-vite';

export default {
  title: 'Components/RadioButtons'
} satisfies Meta;

export const Default: StoryObj = {
  render() {
    return `
<form action="#">
  <p>
    <label>
      <input name="group1" type="radio" checked />
      <span>Red</span>
    </label>
  </p>
  <p>
    <label>
      <input name="group1" type="radio" />
      <span>Yellow</span>
    </label>
  </p>
  <p>
    <label>
      <input class="with-gap" name="group1" type="radio"  />
      <span>Green</span>
    </label>
  </p>
  <p>
    <label>
      <input name="group1" type="radio" disabled="disabled" />
      <span>Brown</span>
    </label>
  </p>
</form>
    `;
  }
};

export const WithGap: StoryObj = {
  render() {
    return `
<p>
  <label>
    <input class="with-gap" name="group3" type="radio" checked />
    <span>Red</span>
  </label>
</p>
    `;
  }
};

export const ErrorState: StoryObj = {
  name: 'Error',
  render() {
    return `
<form action="#">
  <p>Error radios recolor the ring, dot and state layer with the M3 <code>error</code> role.</p>
  <p>
    <label>
      <input class="error" name="group4" type="radio" />
      <span>Error unselected</span>
    </label>
  </p>
  <p>
    <label>
      <input name="group4" type="radio" checked aria-invalid="true" />
      <span>Error selected</span>
    </label>
  </p>
</form>
    `;
  }
};
