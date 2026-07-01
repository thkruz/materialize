import type { Meta, StoryObj } from '@storybook/html-vite';
import { Chips } from './chips';
import { renderAndInit } from '../storyInit';

export default {
  title: 'Components/Chips'
} satisfies Meta;

export const Basic: StoryObj = {
  render: renderAndInit(
    `<div class="chips" id="chips-basic"></div>`,
    (root) => {
      Chips.init(root.querySelector<HTMLElement>('.chips')!, {
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

export const UserInput: StoryObj = {
  render: renderAndInit(
    `<div class="chips chips-placeholder input-field" id="chips-user-input"><input></div>`,
    (root) => {
      Chips.init(root.querySelector<HTMLElement>('.chips')!, {
        allowUserInput: true,
        placeholder: 'Enter a tag',
        secondaryPlaceholder: '+Tag'
      });
    }
  )
};
