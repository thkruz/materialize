// Ambient declarations shared by the Jasmine browser specs.
//
// The specs run against the built IIFE bundle (global `M`) in a real browser via
// jasmine-browser-runner, and use DOM event helpers plus custom matchers defined
// in spec/helper.ts. None of that is visible to TypeScript on its own, so it is
// declared here. This file has no imports so it stays a global (ambient) script.

// The built library is exposed as the global `M` (Vite lib `name: 'M'`). At test
// time it is the runtime IIFE bundle with no static type information, so it is
// declared untyped rather than pulling the whole library source into the spec
// typecheck program.
declare const M: any;

// Fixture helpers defined at global scope in spec/helper.ts.
declare function XloadHtml(html: string, options?: { insertionType?: 'append' | 'prepend' }): void;
declare function XunloadFixtures(): void;

// DOM event helpers assigned onto `window` in spec/helper.ts. They are declared
// both as bare globals (specs call `click(el)`) and on Window.
declare function click(el: Element): void;
declare function mouseenter(el: Element): void;
declare function mouseleave(el: Element): void;
declare function keydown(targetElement: Element, keycode: number): void;
declare function keyup(targetElement: Element, keycode: number): void;
declare function focus(el: Element): void;
declare function blur(el: Element): void;

interface Window {
  click(el: Element): void;
  mouseenter(el: Element): void;
  mouseleave(el: Element): void;
  keydown(targetElement: Element, keycode: number): void;
  keyup(targetElement: Element, keycode: number): void;
  focus(el: Element): void;
  blur(el: Element): void;
}

declare namespace jasmine {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- T must match jasmine's Matchers<T> for declaration merging
  interface Matchers<T> {
    // Custom matchers registered via jasmine.addMatchers in spec/helper.ts.
    toExist(message?: string): boolean;
    toBeVisible(message?: string): boolean;
    toBeHidden(message?: string): boolean;
    toHaveClass(className: string, message?: string): boolean;
    toNotHaveClass(className: string, message?: string): boolean;
    hasMaxHeightZero(message?: string): boolean;
    notHasMaxHeightZero(message?: string): boolean;

    // The specs pass a trailing failure message to built-in matchers (legacy
    // Jasmine style). @types/jasmine only types the value argument, so add
    // overloads that accept the optional message.
    toBe(expected: unknown, message?: string): boolean;
    toEqual(expected: unknown, message?: string): boolean;
    toContain(expected: unknown, message?: string): boolean;
    toBeTrue(message?: string): boolean;
    toBeFalse(message?: string): boolean;
    toBeNull(message?: string): boolean;
    toBeDefined(message?: string): boolean;
    toBeUndefined(message?: string): boolean;
    toBeGreaterThan(expected: number, message?: string): boolean;
    toBeLessThan(expected: number, message?: string): boolean;
    toBeGreaterThanOrEqual(expected: number, message?: string): boolean;
    toBeLessThanOrEqual(expected: number, message?: string): boolean;
  }
}
