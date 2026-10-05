<script setup lang="ts">
withDefaults(defineProps<{ closure?: number }>(), { closure: 0 })
</script>

<template>
  <g stroke-linecap="round" stroke-linejoin="round">
    <rect x="-14" y="-28" width="28" height="27" rx="8" class="fill-[#aaa9a4] stroke-[#292725]" stroke-width="5" />
    <path d="M-9-23V-10" class="stroke-[#e5e4de]" stroke-width="5" />
    <path d="M-17 17L-50 43Q-54 47-51 65L-37 82" :transform="`rotate(${-closure * 32}, -17, 17)`" class="fill-none stroke-[#292725]" stroke-width="15" />
    <path d="M17 17L50 43Q54 47 51 65L37 82" :transform="`rotate(${closure * 32}, 17, 17)`" class="fill-none stroke-[#292725]" stroke-width="15" />
    <path d="M-17 17L-50 43Q-54 47-51 65L-37 82" :transform="`rotate(${-closure * 32}, -17, 17)`" class="fill-none stroke-[#c8c7c1]" stroke-width="7" />
    <path d="M17 17L50 43Q54 47 51 65L37 82" :transform="`rotate(${closure * 32}, 17, 17)`" class="fill-none stroke-[#c8c7c1]" stroke-width="7" />
    <rect x="-15" y="15" width="30" height="25" rx="10" class="fill-[#b1b0aa] stroke-[#292725]" stroke-width="5" />
    <rect x="-27" y="-3" width="54" height="33" rx="10" class="fill-[#ffc7cd] stroke-[#292725]" stroke-width="5" />
    <path d="M-18 3H17" class="stroke-[#ffe9e3]" stroke-width="4" />
    <ellipse cx="-10" cy="11" rx="2.7" ry="3.5" class="fill-[#292725]" />
    <ellipse cx="10" cy="11" rx="2.7" ry="3.5" class="fill-[#292725]" />
    <circle cx="-16" cy="18" r="3.5" class="fill-[#ff8b9d]" />
    <circle cx="16" cy="18" r="3.5" class="fill-[#ff8b9d]" />
    <path d="M-4 16Q0 22 4 16" class="fill-none stroke-[#292725]" stroke-width="2.5" />
  </g>
</template>
