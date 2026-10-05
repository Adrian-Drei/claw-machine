<script setup lang="ts">
import { CLAW_GEOMETRY, type GamePhase } from '~/composables/useClawMachine'
defineProps<{
  phase: GamePhase
  x: number
  y: number
  closure: number
  prizes: number[]
  caught: number | null
  won: boolean
  fall: number
}>()
const emit = defineEmits<{ aim: [event: PointerEvent] }>()
</script>

<template>
  <svg viewBox="0 0 600 430" role="img" aria-label="Mint claw machine with three soccer ball friends and a prize chute on the right" class="w-full touch-none select-none overflow-visible" @pointerdown="emit('aim', $event)">
    <defs>
      <!-- The toy disappears through the floor opening, never over the controls. -->
      <clipPath id="prize-drop-path">
        <rect x="46" y="83" width="510" height="216" />
        <path :transform="`translate(${CLAW_GEOMETRY.chuteX}, 0)`" d="M-54 299L-20 298L25 320H-46Z" />
      </clipPath>
      <clipPath id="prize-pickup-window">
        <rect x="466" y="342" width="111" height="58" rx="5" />
      </clipPath>
      <linearGradient id="mint-cabinet" x2="0" y2="1">
        <stop offset="0" stop-color="#b4ead1" /><stop offset="1" stop-color="#8dd0b4" />
      </linearGradient>
      <linearGradient id="glass-window" x2="0.8" y2="1">
        <stop offset="0" stop-color="#e2f6f4" /><stop offset="1" stop-color="#bee5e4" />
      </linearGradient>
      <linearGradient id="cream-sign" x2="0" y2="1">
        <stop offset="0" stop-color="#fff8d1" /><stop offset="1" stop-color="#fff0ae" />
      </linearGradient>
    </defs>
    <ellipse cx="300" cy="418" rx="310" ry="17" class="fill-[#eed9ad]" opacity="0.65" />
    <rect x="28" y="405" width="33" height="21" rx="8" class="fill-[#53514b] stroke-[#292725]" stroke-width="5" />
    <rect x="540" y="405" width="33" height="21" rx="8" class="fill-[#53514b] stroke-[#292725]" stroke-width="5" />
    <path d="M28 78H572L586 344H15Z" fill="url(#mint-cabinet)" class="stroke-[#292725]" stroke-width="5" />
    <path d="M40 78L32 335M560 78L568 335" class="stroke-[#ddf8e8]" stroke-width="7" />
    <path d="M53 83H548L555 330H46Z" fill="url(#glass-window)" class="stroke-[#292725]" stroke-width="4" />
    <path d="M53 83L104 108H499L548 83M104 108V279L46 309M499 108V279L555 309M104 279H499" class="fill-none stroke-[#9abec1]" stroke-width="4" />
    <path d="M53 83L104 108V279L46 309Z" class="fill-white" opacity="0.18" />
    <path d="M46 309L104 279H499L555 309V330H46Z" class="fill-[#fff0b0] stroke-[#bdba83]" stroke-width="3" />
    <path d="M47 310L104 279H499L554 310" class="fill-none stroke-[#fff8df]" stroke-width="7" />
    <path d="M133 117L99 155M424 117L391 155" class="stroke-white" stroke-width="17" stroke-linecap="round" opacity="0.4" />
    <path d="M75 134L61 155M71 214L60 236M531 124L516 148M536 217L523 239" class="stroke-[#fffef0]" stroke-width="9" stroke-linecap="round" opacity="0.85" />
    <g :transform="`translate(${CLAW_GEOMETRY.chuteX}, 0)`" stroke-linejoin="round">
      <path d="M-60 295L-18 293L33 324H-51Z" class="fill-[#a7e6ce] stroke-[#292725]" stroke-width="2.5" />
      <path d="M-54 299L-20 298L25 320H-46Z" class="fill-[#34433a] stroke-[#6f9f87]" stroke-width="2" />
      <path d="M-49 321H27" class="fill-none stroke-[#e2fff0]" stroke-width="3" stroke-linecap="round" />
      <path d="M-30 285L-29 276M-14 287L-9 279" class="stroke-[#fffef0]" stroke-width="7" stroke-linecap="round" />
      <path d="M-30 285L-29 276M-14 287L-9 279" class="stroke-[#ffda6a]" stroke-width="4" stroke-linecap="round" />
    </g>
    <ellipse v-for="position in prizes" :key="position" :cx="position" cy="315" rx="52" ry="8" class="fill-[#d6bc75]" opacity="0.6" />
    <image v-for="(position, index) in prizes" v-show="caught !== index" :key="index" href="/images/ball-idle.png" :x="position - 75" y="194" width="150" height="150" />
    <g clip-path="url(#prize-drop-path)">
      <image v-if="caught !== null && !won" :href="phase === 'releasing' ? '/images/ball-falling.png' : '/images/ball-picked-up.png'" :x="x - 75" :y="y + 15 + fall" width="150" height="150" />
    </g>
    <g :transform="`translate(${x}, 90)`">
      <path :d="`M0 0V${y - 90}`" class="stroke-[#292725]" stroke-width="6" />
      <path :d="`M28 0Q58 ${Math.max(0, (y - 90) / 2)} 26 ${y - 85}`" class="fill-none stroke-[#292725]" stroke-width="8" stroke-dasharray="1 6" stroke-linecap="round" />
    </g>
    <g :transform="`translate(${x}, ${y}) scale(0.8)`"><ClawIllustration :closure="closure" /></g>
    <path d="M27 332H573Q594 332 596 355L598 397Q598 415 575 415H25Q2 415 3 395L5 357Q7 332 27 332Z" fill="url(#mint-cabinet)" class="stroke-[#292725]" stroke-width="5" />
    <path d="M25 340H575Q585 340 587 358M13 360V391Q13 406 29 406H570" class="fill-none stroke-[#d4f4df]" stroke-width="5" stroke-linecap="round" />
    <rect x="455" y="334" width="134" height="85" rx="18" fill="url(#cream-sign)" class="stroke-[#292725]" stroke-width="3" />
    <rect x="466" y="342" width="111" height="58" rx="7" class="fill-[#789a81] stroke-[#292725]" stroke-width="3" />
    <path d="M476 354H567V386H476Z" class="fill-[#30332e]" />
    <path d="M467 399L478 386H565L576 399" class="fill-[#a4d8af] stroke-[#292725]" stroke-width="2" stroke-linejoin="round" />
    <g v-if="won" clip-path="url(#prize-pickup-window)">
      <image href="/images/ball-idle.png" :x="CLAW_GEOMETRY.chuteX - 42.5" y="323" width="85" height="85" />
    </g>
    <path d="M466 343H577V351Q577 362 566 362Q555 362 555 353Q555 362 544 362Q532 362 532 353Q532 362 521 362Q510 362 510 353Q510 362 499 362Q488 362 488 353Q488 362 477 362Q466 362 466 351Z" class="fill-[#ffaac1] stroke-[#292725]" stroke-width="2" />
    <path d="M489 344H508V350Q508 360 499 360Q489 360 489 350Z M533 344H553V350Q553 360 544 360Q533 360 533 350Z" class="fill-[#ffced7]" />
    <text x="521" y="412" text-anchor="middle" class="fill-[#292725] text-[9px] font-bold">Your new friend!</text>
    <path d="M470 405C465 398 461 404 465 408L470 413L475 408C479 404 475 398 470 405Z M574 405C569 398 565 404 569 408L574 413L579 408C583 404 579 398 574 405Z" class="fill-[#ff91b1]" />
    <circle cx="581" cy="342" r="11" class="fill-[#fff0ae] stroke-[#292725]" stroke-width="2" />
    <path d="M581 335L584 339L589 340L585 344L586 349L581 347L577 349L577 344L573 340L578 339Z" class="fill-[#ffda6a] stroke-[#292725]" stroke-width="1.5" stroke-linejoin="round" />
    <rect x="14" y="23" width="573" height="64" rx="22" fill="url(#mint-cabinet)" class="stroke-[#292725]" stroke-width="5" />
    <path d="M26 39Q29 29 48 29H554" class="fill-none stroke-[#d9f6e3]" stroke-width="5" stroke-linecap="round" />
    <circle cx="46" cy="58" r="11" class="fill-[#ffdf76] stroke-[#292725]" stroke-width="4" />
    <circle cx="555" cy="58" r="11" class="fill-[#ffdf76] stroke-[#292725]" stroke-width="4" />
    <rect x="79" y="17" width="443" height="70" rx="26" fill="url(#mint-cabinet)" class="stroke-[#292725]" stroke-width="5" />
    <rect x="89" y="27" width="423" height="51" rx="18" fill="url(#cream-sign)" class="stroke-[#accdb0]" stroke-width="2.5" />
    <path d="M126 39L130 47L140 48L133 56L134 65L125 61L116 65L117 55L110 49L121 47Z M476 39L480 47L490 48L483 56L484 65L475 61L466 65L467 55L460 49L471 47Z" class="fill-[#ffdb6b] stroke-[#292725]" stroke-width="3" stroke-linejoin="round" />
    <text x="152" y="66" class="fill-[#ff9fbd] stroke-[#292725] text-[44px] font-black" stroke-width="7" stroke-linejoin="round" paint-order="stroke">CLAW</text>
    <text x="291" y="66" class="fill-[#ffdf78] stroke-[#292725] text-[44px] font-black" stroke-width="7" stroke-linejoin="round" paint-order="stroke">CLUB</text>
  </svg>
</template>




