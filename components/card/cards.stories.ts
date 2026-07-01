import type { Meta, StoryObj } from '@storybook/html-vite';
import { Cards } from './cards';
import { renderAndInit } from '../storyInit';

export default {
  title: 'Components/Cards'
} satisfies Meta;

const image =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Crect width='400' height='200' fill='%2364b5f6'/%3E%3C/svg%3E";

export const Basic: StoryObj = {
  render: renderAndInit(
    `<div class="row">
  <div class="col s12 m6">
    <div class="card" id="card-basic">
      <div class="card-image">
        <img src="${image}">
        <span class="card-title">Card Title</span>
      </div>
      <div class="card-content">
        <p>
          I am a very simple card. I am good at containing small bits of information.
          I am convenient because I require little markup to use effectively.
        </p>
      </div>
      <div class="card-action">
        <a href="#">This is a link</a>
      </div>
    </div>
  </div>
</div>`,
    (root) => {
      Cards.init(root.querySelectorAll<HTMLElement>('.card'));
    }
  )
};

export const Reveal: StoryObj = {
  render: renderAndInit(
    `<div class="row">
  <div class="col s12 m6">
    <div class="card reveal" id="card-reveal">
      <div class="card-image waves-effect waves-block waves-light">
        <img class="activator" src="${image}">
      </div>
      <div class="card-content">
        <span class="card-title activator grey-text text-darken-4">
          Card Title
          <i class="material-icons right">more_vert</i>
        </span>
        <p><a href="#">This is a link</a></p>
      </div>
      <div class="card-reveal">
        <span class="card-title grey-text text-darken-4">
          Card Title
          <i class="material-icons right">close</i>
        </span>
        <p>
          Here is some more information about this product that is only revealed once clicked on.
        </p>
      </div>
    </div>
  </div>
</div>`,
    (root) => {
      Cards.init(root.querySelectorAll<HTMLElement>('.card'));
    }
  )
};
