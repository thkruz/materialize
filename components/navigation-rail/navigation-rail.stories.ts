import type { Meta, StoryObj } from '@storybook/html-vite';

export default {
  title: 'Components/Navigation Rail'
} satisfies Meta;

const item = (icon: string, label: string, active = false) => `
  <a class="navigation-rail__item${active ? ' active' : ''}">
    <span class="navigation-rail__indicator"><i class="navigation-rail__icon material-icons">${icon}</i></span>
    <span class="navigation-rail__label">${label}</span>
  </a>`;

// The navigation rail is position:fixed to the leading edge, so wrap it in a
// relatively-positioned box so it renders inside the story canvas.
const frame = (inner: string) => `
  <div style="position:relative;height:520px">
    <nav class="navigation-rail" style="position:absolute">
      ${inner}
    </nav>
  </div>`;

export const Default: StoryObj = {
  render: () =>
    frame(
      [
        item('home', 'Home', true),
        item('search', 'Search'),
        item('favorite', 'Favorites'),
        item('person', 'Profile')
      ].join('')
    )
};

export const WithHeaderFab: StoryObj = {
  name: 'With menu + FAB header',
  render: () =>
    frame(
      `<div class="navigation-rail__header">
        <button class="btn-icon icon-button" aria-label="Menu"><i class="material-icons">menu</i></button>
        <button class="btn-flat fab" aria-label="Compose"><i class="material-icons">edit</i></button>
      </div>` +
      [
        item('home', 'Home', true),
        item('search', 'Search'),
        item('favorite', 'Favorites'),
        item('person', 'Profile')
      ].join('')
    )
};

export const BottomAligned: StoryObj = {
  render: () =>
    `<div style="position:relative;height:520px">
      <nav class="navigation-rail navigation-rail--bottom" style="position:absolute">
        ${[
          item('home', 'Home', true),
          item('search', 'Search'),
          item('person', 'Profile')
        ].join('')}
      </nav>
    </div>`
};
