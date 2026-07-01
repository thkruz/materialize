/**
 * Storybook helper for the interactive (JavaScript) components.
 *
 * Returns a Storybook `render` function that injects an HTML fragment and then
 * runs the component's `init()` once the markup is attached to the document.
 * Initialization is deferred to the next animation frame so that
 * layout-dependent setup — tab indicators, dropdown/tooltip positioning,
 * carousel measurements — sees the mounted, laid-out DOM.
 *
 * @param html Markup for the story.
 * @param init Callback that initializes the component, scoped to the story root.
 */
export function renderAndInit(
  html: string,
  init: (root: HTMLElement) => void
): () => HTMLElement {
  return () => {
    const root = document.createElement('div');
    root.innerHTML = html.trim();
    requestAnimationFrame(() => init(root));
    return root;
  };
}
