import type { Meta, StoryObj } from '@storybook/html-vite';

export default {
  title: 'Components/Search'
} satisfies Meta;

export const SearchBar: StoryObj = {
  render: () => `
    <div class="search-bar">
      <i class="search-bar__icon material-icons">search</i>
      <input class="search-bar__input" type="text" placeholder="Search">
      <i class="search-bar__trailing material-icons">mic</i>
    </div>
  `
};

const resultItem = (icon: string, label: string) => `
  <li class="search-view__item"><i class="search-view__icon material-icons">${icon}</i>${label}</li>`;

export const DockedView: StoryObj = {
  render: () => `
    <div class="search-view search-view--docked">
      <div class="search-view__header">
        <i class="search-view__icon material-icons">search</i>
        <input class="search-view__input" type="text" placeholder="Search" value="mate">
      </div>
      <ul class="search-view__results">
        ${[
          resultItem('history', 'Material design'),
          resultItem('history', 'Materialize CSS'),
          resultItem('search', 'Material 3 components')
        ].join('')}
      </ul>
    </div>
  `
};
