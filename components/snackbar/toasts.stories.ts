import type { Meta, StoryObj } from '@storybook/html-vite';
import { Toast } from './toasts';
import { renderAndInit } from '../storyInit';

export default {
  title: 'Components/Toasts'
} satisfies Meta;

export const Basic: StoryObj = {
  render: renderAndInit(
    `<a class="btn" id="toast-basic-btn">Show Toast</a>`,
    (root) => {
      root.querySelector<HTMLElement>('#toast-basic-btn')!.addEventListener('click', () => {
        new Toast({ text: 'I am a toast!' });
      });
    }
  )
};

export const RoundedWithClasses: StoryObj = {
  render: renderAndInit(
    `<a class="btn" id="toast-rounded-btn">Show Rounded Toast</a>`,
    (root) => {
      root.querySelector<HTMLElement>('#toast-rounded-btn')!.addEventListener('click', () => {
        new Toast({ text: 'I am a rounded toast!', classes: 'rounded', displayLength: 6000 });
      });
    }
  )
};
