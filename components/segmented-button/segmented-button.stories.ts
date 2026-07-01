import type { Meta, StoryObj } from '@storybook/html-vite';

export default {
  title: 'Components/Segmented Button'
} satisfies Meta;

// A selected segment may carry a leading check icon (class `check`).
const segment = (label: string, opts: { selected?: boolean; icon?: string; disabled?: boolean } = {}) => {
  const check = opts.selected ? `<i class="material-icons check">check</i>` : '';
  const icon = opts.icon ? `<i class="material-icons">${opts.icon}</i>` : '';
  return `<button class="segment${opts.selected ? ' selected' : ''}"${opts.disabled ? ' disabled' : ''}>${check}${icon}<span>${label}</span></button>`;
};

const group = (segments: string) => `<div class="segmented-button">${segments}</div>`;

export const TwoSegments: StoryObj = {
  render: () => group([segment('On', { selected: true }), segment('Off')].join(''))
};

export const ThreeSegments: StoryObj = {
  render: () =>
    group([segment('Day', { selected: true }), segment('Week'), segment('Month')].join(''))
};

export const WithIcons: StoryObj = {
  render: () =>
    group(
      [
        segment('List', { selected: true, icon: 'view_list' }),
        segment('Grid', { icon: 'grid_view' }),
        segment('Map', { icon: 'map' })
      ].join('')
    )
};

export const Disabled: StoryObj = {
  render: () =>
    group(
      [
        segment('Day', { selected: true }),
        segment('Week'),
        segment('Month', { disabled: true })
      ].join('')
    )
};
