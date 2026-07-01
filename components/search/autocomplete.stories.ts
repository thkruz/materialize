import type { Meta, StoryObj } from '@storybook/html-vite';
import { Autocomplete } from './autocomplete';
import { renderAndInit } from '../storyInit';

export default {
  title: 'Components/Autocomplete'
} satisfies Meta;

export const Basic: StoryObj = {
  render: renderAndInit(
    `
<div class="row">
  <div class="input-field col s12">
    <input type="text" id="autocomplete-basic" class="autocomplete">
    <label for="autocomplete-basic">Autocomplete</label>
  </div>
</div>`,
    (root) => {
      Autocomplete.init(root.querySelector<HTMLInputElement>('.autocomplete')!, {
        data: [
          { id: 12, text: 'Apple' },
          { id: 13, text: 'Microsoft' },
          {
            id: 42,
            text: 'Google',
            image:
              'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
          }
        ]
      });
    }
  )
};
