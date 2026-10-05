<script setup lang="ts">
const doodles = [
  { shape: 'star', classes: 'left-[3%] top-[18%] h-7 w-7 -rotate-12 text-[#e9cc85] sm:left-[6%] sm:h-11 sm:w-11' },
  { shape: 'heart', classes: 'right-[3%] top-[23%] h-6 w-6 rotate-12 text-[#e9b3c4] sm:right-[7%] sm:h-9 sm:w-9' },
  { shape: 'heart', classes: 'left-[2%] top-[52%] h-6 w-6 -rotate-12 text-[#e9b3c4] sm:left-[5%] sm:h-10 sm:w-10' },
  { shape: 'star', classes: 'right-[2%] top-[57%] h-8 w-8 rotate-12 text-[#b2d7c4] sm:right-[5%] sm:h-12 sm:w-12' },
  { shape: 'star', classes: 'left-[10%] bottom-[12%] hidden h-8 w-8 rotate-12 text-[#b2d7c4] sm:block' },
  { shape: 'heart', classes: 'right-[12%] bottom-[8%] hidden h-8 w-8 -rotate-12 text-[#e9b3c4] sm:block' },
]
</script>

<template>
  <div aria-hidden="true" class="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none">
    <div class="absolute inset-x-0 top-[12%] h-[70%] bg-[radial-gradient(ellipse_at_center,#fffdf0_0%,#fffbeecc_35%,transparent_72%)]" />
    <svg v-for="(doodle, index) in doodles" :key="index" viewBox="0 0 40 40" class="absolute fill-current stroke-current opacity-40" :class="doodle.classes" stroke-width="2" stroke-linejoin="round">
      <path v-if="doodle.shape === 'star'" d="M20 4L25 14L36 16L28 24L30 35L20 30L10 35L12 24L4 16L15 14Z" />
      <path v-else d="M20 12C8-4-6 15 20 35C46 15 32-4 20 12Z" />
    </svg>
  </div>
</template>

