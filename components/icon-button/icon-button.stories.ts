import type { Meta, StoryObj } from '@storybook/html-vite';

export default {
  title: 'Components/Icon Button'
} satisfies Meta;

const button = (modifier: string, icon: string, extra = '') =>
  `<button class="icon-button${modifier ? ' ' + modifier : ''}"${extra}><i class="material-icons">${icon}</i></button>`;

// Render a small representative row for each variant.
const row = (buttons: string) =>
  `<div style="display:flex;gap:16px;align-items:center">${buttons}</div>`;

export const Standard: StoryObj = {
  render: () =>
    row([button('', 'favorite'), button('', 'search'), button('', 'settings')].join(''))
};

export const Filled: StoryObj = {
  render: () =>
    row([button('filled', 'favorite'), button('filled', 'add'), button('filled', 'edit')].join(''))
};

export const Tonal: StoryObj = {
  render: () =>
    row([button('tonal', 'favorite'), button('tonal', 'bookmark'), button('tonal', 'share')].join(''))
};

export const Outlined: StoryObj = {
  render: () =>
    row([button('outlined', 'favorite'), button('outlined', 'menu'), button('outlined', 'more_vert')].join(''))
};

export const Selected: StoryObj = {
  render: () =>
    row(
      [
        button('selected', 'favorite'),
        button('filled selected', 'favorite'),
        button('tonal selected', 'favorite'),
        button('outlined selected', 'favorite')
      ].join('')
    )
};

export const Disabled: StoryObj = {
  render: () =>
    row(
      [
        button('', 'favorite', ' disabled'),
        button('filled', 'favorite', ' disabled'),
        button('tonal', 'favorite', ' disabled'),
        button('outlined', 'favorite', ' disabled')
      ].join('')
    )
};
