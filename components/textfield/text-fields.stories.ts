import type { Meta, StoryObj } from '@storybook/html-vite';
import { Forms } from './forms';
import { CharacterCounter } from '../../src/characterCounter';
import { renderAndInit } from '../storyInit';

export default {
  title: 'Components/TextFields'
} satisfies Meta;

export const Basic: StoryObj = {
  render: renderAndInit(
    `
<div class="input-field">
  <label for="text-fields-text-input">text</label>
  <input id="text-fields-text-input" type="text" />
</div>
<div class="input-field">
  <label for="text-fields-password-input">password</label>
  <input id="text-fields-password-input" type="password" />
</div>
<div class="input-field">
  <label for="text-fields-email-input">email</label>
  <input id="text-fields-email-input" type="email" />
</div>
<div class="input-field">
  <label for="text-fields-number-input">number</label>
  <input id="text-fields-number-input" type="number" />
</div>
<div class="input-field">
  <textarea id="text-fields-textarea" class="materialize-textarea"></textarea>
  <label for="text-fields-textarea">Textarea</label>
</div>`,
    (root) => {
      // Attach the global change/keyup/textarea handlers.
      Forms.Init();
      // Init the auto-resizing textarea directly (Forms.Init() defers this to
      // DOMContentLoaded, which has already fired in Storybook).
      root
        .querySelectorAll<HTMLTextAreaElement>('.materialize-textarea')
        .forEach((textarea) => Forms.InitTextarea(textarea));
    }
  )
};

export const CharacterCounterStory: StoryObj = {
  name: 'Character Counter',
  render: renderAndInit(
    `
<div class="input-field">
  <label for="text-fields-character-counter">character counter</label>
  <input id="text-fields-character-counter" type="text" data-length="10" maxlength="10" />
</div>`,
    (root) => {
      CharacterCounter.init(
        root.querySelector<HTMLInputElement>('#text-fields-character-counter')!
      );
    }
  )
};
