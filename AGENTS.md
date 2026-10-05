# Project instructions

## Stack and scope
- Use Nuxt, Vue 3, TypeScript, and Tailwind CSS.
- Follow the versions, package manager, and conventions already in the repository.
- Keep solutions simple and focused on the requested feature.
- Do not add dependencies, UI libraries, or game engines unless needed. Explain any additions.

## Nuxt conventions
- Use Vue single-file components with `<script setup lang="ts">`.
- Follow the existing directory structure. For a Nuxt 4 project, use `app/pages`, `app/components`, `app/composables`, and `app/assets`.
- Keep route components focused on page composition. Extract reusable UI into components and shared logic into composables.
- Use Nuxt auto-imports where supported.
- Use `NuxtLink` for internal navigation.
- Store unchanged public assets in `public/` and reference them from root-relative URLs.
- Access browser APIs only on the client, using lifecycle hooks or client guards as appropriate.
- Clean up event listeners, timers, and animation frames on unmount.
- Keep existing rendering settings unless the task requires changing them.
- Never expose secrets in client code or public runtime configuration.

## Styling: Tailwind only
- Use Tailwind utility classes for layout, spacing, colors, typography, borders, responsive behavior, and interaction states.
- Do not add handwritten CSS, Vue `<style>` blocks, CSS modules, or inline styles for static presentation.
- The global stylesheet may contain the Tailwind import and necessary Tailwind theme configuration.
- Prefer existing design tokens and utility classes. Use arbitrary values when the design requires them.
- Build mobile-first layouts and add breakpoint variants where needed.
- Keep full class names visible in source. Map variants to complete class strings instead of constructing classes such as `bg-${color}-500`.
- For continuously changing game coordinates or animation transforms, a narrowly scoped dynamic style binding is allowed. Keep static appearance in Tailwind.
- If a requirement truly needs custom CSS, explain why before introducing it.

## Code quality
- Prefer clear names, small functions, and straightforward logic.
- Define types for props, events, and shared data. Avoid `any` unless justified.
- Use Vue reactive state instead of direct DOM manipulation for UI state.
- Avoid unrelated refactors and unnecessary abstractions.
- Preserve existing behavior unless a change is requested.
- Add comments only when they explain non-obvious decisions.

## Formatting with Prettier
- Use the repository's Prettier configuration as the source of truth.
- Format changed files with Prettier when available.
- Use `prettier-plugin-tailwindcss` for automatic class sorting when configured.
- If no configuration exists, use two-space indentation, single quotes in JavaScript/TypeScript, no semicolons, and trailing commas where supported.
- Do not manually reformat unrelated files.
- Do not claim formatting passed if Prettier was unavailable or was not run.

## Accessibility and interaction
- Use semantic HTML and real buttons for controls.
- Provide labels, image alt text, and visible keyboard focus states.
- Support keyboard and pointer input for interactive controls.
- Ensure touch targets are comfortable to use on tablets.
- Respect reduced-motion preferences where practical.

## Interactive classroom games
- Keep games lightweight for school Chromebooks, tablets, and whiteboards.
- Use `requestAnimationFrame` with elapsed time for continuous animation.
- Prefer transform-based movement and avoid unnecessary reactive updates per frame.
- Represent game phases explicitly, such as idle, dropping, grabbing, lifting, and releasing.
- Prevent overlapping actions while an animation sequence is running.
- Keep input handlers separate from game logic.
- Do not introduce a backend, login, physics engine, or analytics unless requested.

## Verification and delivery
- Inspect `package.json` and use existing scripts for formatting, linting, type checking, and building.
- Run checks appropriate to the changes. Add meaningful tests for nontrivial logic when a test setup exists.
- For UI changes, check responsive layouts and relevant input methods when a browser is available.
- Report what changed, what was verified, and any remaining limitations.
- Never claim checks or browser testing that were not performed.
