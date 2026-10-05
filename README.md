# Claw Club

A lightweight classroom claw machine built with Nuxt 4, Vue 3, TypeScript, and Tailwind CSS. No added dependencies, accounts, backend, or game engine.

## Run and export

Use Node 22.12+ (Node 24 recommended); the existing Vite 8 toolchain fails under the system Node 20.12.2.

```sh
npm install
npm run dev
npm run generate
```

Upload the contents of `.output/public` to a static web host. The generated demo requires HTTP hosting; opening `index.html` directly with `file://` is not supported. `claw-club-static.zip` contains the static site for upload, rather than a standalone offline HTML file.

## Controls

- Hold left/right buttons or arrow keys to move.
- Click or tap the machine window to aim.
- Click Drop Claw, use Enter on that button, or press Space while the game has focus.
- Play again starts the next attempt with the remaining prizes, refilling to three only when the machine is empty.
- Sound uses short browser-generated tones; it starts off.
- Fullscreen uses the native browser API when supported.

Catches are deterministic within 48 logical units of a prize. Coordinates share a 600 × 430 SVG viewBox. The animation composable uses elapsed-time requestAnimationFrame updates and explicit phases. Reduced motion shortens sequences. Held input stops on release, cancellation, blur, focus changes, and dropping; listeners and animation frames are cleaned up on unmount.

## Supplied artwork mapping

Original PNG files are copied unchanged into `public/images`.

| Original filename | Asset |
| --- | --- |
| 3fb2682a-607d-4940-bc47-26e2c8b38b1b.png | ball-idle.png |
| 074cfb9e-b35e-4e2e-bcc2-2d50cac14a78.png | ball-picked-up.png |
| 9711648c-5f11-4672-9790-37c37b776b0f.png | ball-falling.png |
| 0b537d72-f885-4ccd-98f5-742f30112e67.png | left-button-normal.png |
| eed89905-16b3-4041-8190-aaf35ad66cca.png | left-button-pressed.png |
| c12d8e64-882b-4190-b541-950e97061525.png | right-button-normal.png |
| d0fe4490-8a8f-4c76-858a-bc3548a67afa.png | right-button-pressed.png |
| c80cf9be-1d64-43ea-b263-5d6de1ad7cf2.png | drop-button-normal.png |
| e733cf37-b38d-4d28-8eb6-d65ea37aaa73.png | drop-button-pressed.png |

All nine assets are present. Machine and claw are native SVG. The supplied Claw Club mockup guides the illustrated mint cabinet, glass perspective, cream marquee, smiling claw, rounded heading, and right-hand prize chute.

## Verification

Static generation passes using bundled Node 24. Prettier, vue-tsc, lint scripts, and an existing test framework are unavailable in this starter; no formatting, lint, or full TypeScript-check pass is claimed. Browser checks use installed Edge through the bundled Playwright runtime. The local `browser-check.mjs` is a verification helper and depends on that machine-specific runtime path.

## Submission

The ZIP can be uploaded to Google Drive with viewer sharing enabled, or hosted as a static site and submitted as a browser link. No Google Drive connection is configured in this workspace, so no upload or sharing verification has been performed.

For planning only, a similar small game with supplied artwork could take roughly 12–24 hours including interactions, responsive design, and browser QA. At an example rate of $40/hour, that is $480–$960; this is an illustrative project budget, not a market-rate survey or binding quote. More artwork, sound, teacher settings, and revisions increase scope.

Verified in headless Edge: aligned catch and delivery, tap aiming, keyboard drop, miss recovery, held arrow movement, held pointer movement, and replay. Desktop and mobile screenshots were inspected. The 390 × 844 mobile view has no horizontal overflow. No browser runtime errors were recorded. Safari and physical tablet/whiteboard testing remain unverified.


The claw stops at the shared grab height (179), lifts continuously to 110, and releases at the chute center (521). A floor opening clips falling toys behind the control panel, and the collected toy appears in the pickup window. Browser regression checks verify drop height, continuous lifting, chute alignment, and swapped left-button sprite states.

The latest design uses the Scoot / Drop / Say hello instruction badges, the buddy subtitle, a mint-rimmed floor slot, and a larger pickup window with a pink awning, hearts, star badge, and Your new friend label.

Space drops during normal play and restores the game after a successful catch. The visible Space badge supports the same action with a pointer or touch. The floor opening follows the supplied slanted quadrilateral reference.

Background music: the supplied Yummy Flavor MP3 is copied unchanged to public/audio/yummy-flavor.mp3. Sound starts off; the sound button starts, pauses, and resumes the looping track at 35% volume. Music continues across replay and stops when the component unmounts. Edge checks verified playback, pause/resume, replay continuity, and looping at the end.


Delivered prizes are removed from the active inventory. The claw returns smoothly to center before the attempt finishes. Retry keeps all remaining prizes and refills only an empty machine. Inventory checks in Edge cover three successive catches, misses at an empty position, center return, preserved inventory, and empty-machine refill.

