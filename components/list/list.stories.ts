import type { Meta, StoryObj } from '@storybook/html-vite';

export default {
  title: 'Components/List'
} satisfies Meta;

export const Basic: StoryObj = {
  render: () => `
    <ul class="collection">
      <li class="collection-item">Alvin</li>
      <li class="collection-item">Simon</li>
      <li class="collection-item">Theodore</li>
      <li class="collection-item">Brittany</li>
    </ul>
  `
};

export const WithHeader: StoryObj = {
  render: () => `
    <ul class="collection with-header">
      <li class="collection-header"><h4>First Names</h4></li>
      <li class="collection-item">Alvin</li>
      <li class="collection-item">Simon</li>
      <li class="collection-item">Theodore</li>
    </ul>
  `
};

export const Links: StoryObj = {
  render: () => `
    <div class="collection">
      <a href="#!" class="collection-item">Alvin</a>
      <a href="#!" class="collection-item active">Simon</a>
      <a href="#!" class="collection-item">Theodore</a>
    </div>
  `
};

export const SecondaryContent: StoryObj = {
  render: () => `
    <ul class="collection">
      <li class="collection-item">
        Alvin
        <a href="#!" class="secondary-content"><i class="material-icons">send</i></a>
      </li>
      <li class="collection-item">
        Simon
        <a href="#!" class="secondary-content"><i class="material-icons">send</i></a>
      </li>
    </ul>
  `
};
