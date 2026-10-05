<script setup lang="ts">
defineProps<{ disabled: boolean; direction: number }>()
const emit = defineEmits<{ move: [direction: number]; stop: []; drop: [] }>()
function hold(event: PointerEvent, direction: number) {
  (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
  emit('move', direction)
}
</script>

<template>
  <div class="flex items-center justify-center gap-1 sm:gap-3">
    <button aria-label="Move claw left" :disabled="disabled" class="h-full w-[24%] touch-none rounded-full focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:opacity-50" @pointerdown.prevent="hold($event, -1)" @pointerup="emit('stop')" @pointercancel="emit('stop')" @lostpointercapture="emit('stop')" @keydown.enter.prevent="emit('move', -1)" @keydown.space.prevent.stop="emit('move', -1)" @keyup="emit('stop')" @blur="emit('stop')">
      <img :src="`/images/right-button-${direction === -1 ? 'pressed' : 'normal'}.png`" alt="" class="h-full w-full scale-125 -scale-x-125 object-contain" draggable="false" />
    </button>
    <button :disabled="disabled" aria-label="Drop claw" class="w-[52%] rounded-full focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-violet-600 active:translate-y-1 disabled:opacity-50" @click="emit('drop')">
      <img :src="`/images/drop-button-${disabled ? 'pressed' : 'normal'}.png`" alt="Drop claw" class="w-full" draggable="false" />
    </button>
    <button aria-label="Move claw right" :disabled="disabled" class="h-full w-[24%] touch-none rounded-full focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:opacity-50" @pointerdown.prevent="hold($event, 1)" @pointerup="emit('stop')" @pointercancel="emit('stop')" @lostpointercapture="emit('stop')" @keydown.enter.prevent="emit('move', 1)" @keydown.space.prevent.stop="emit('move', 1)" @keyup="emit('stop')" @blur="emit('stop')">
      <img :src="`/images/right-button-${direction === 1 ? 'pressed' : 'normal'}.png`" alt="" class="h-full w-full scale-125 object-contain" draggable="false" />
    </button>
  </div>
</template>



