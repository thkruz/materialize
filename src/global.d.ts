/* eslint-disable @typescript-eslint/no-explicit-any -- component instances are stored untyped on the host element; see below */

// Global type augmentations for Materialize.
//
// Every component stores its instance on the host element under a key of the
// form `el['M_ComponentName']` (e.g. `el['M_Dropdown']`). The DOM lib's Element
// type has no declaration for these dynamic keys, so each access produced an
// implicit-any (TS7053) or missing-property error. Declaring them here as `any`
// lets the established pattern type-check. This is purely type-level and changes
// no runtime behavior.
//
// Members are declared directly on Element (HTMLElement inherits them) as named
// members rather than a `[key: `M_${string}`]: any` pattern index signature,
// because such a pattern signature on a widely-used built-in type triggers
// "union type too complex to represent" (TS2590) errors elsewhere.
interface Element {
  M_Autocomplete: any;
  M_Card: any;
  M_Cards: any;
  M_Carousel: any;
  M_CharacterCounter: any;
  M_Chips: any;
  M_Collapsible: any;
  M_Datepicker: any;
  M_Dropdown: any;
  M_FloatingActionButton: any;
  M_FormSelect: any;
  M_Materialbox: any;
  M_Modal: any;
  M_Parallax: any;
  M_Pushpin: any;
  M_Range: any;
  M_ScrollSpy: any;
  M_Sidenav: any;
  M_Slider: any;
  M_Tabs: any;
  M_TapTarget: any;
  M_Timepicker: any;
  M_Toast: any;
  M_Tooltip: any;
}
