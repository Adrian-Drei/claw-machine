<script setup lang="ts">
const { phase, x, y, closure, direction, caught, won, fall, message, prizes, available, move, stop, aim, drop, reset } = useClawMachine()
const game = ref<HTMLElement | null>(null)
const sound = ref(true)
const backgroundMusic = ref<HTMLAudioElement | null>(null)
let playbackRequest = 0
const fullscreen = ref(false)
let audio: AudioContext | null = null
useHead({ title: 'Claw Club · Classroom Arcade', meta: [{ name: 'description', content: 'Catch a little friend in this playful classroom claw machine. Touch, mouse, and keyboard ready.' }] })
async function startMusic() {
  const music = backgroundMusic.value
  if (!sound.value || !music || !music.paused) return
  const request = ++playbackRequest
  music.volume = 0.35
  try {
    await music.play()
  } catch {
    if (request === playbackRequest) {
      message.value = 'Tap any game button to start the music.'
    }
  }
}
function toggleSound() {
  sound.value = !sound.value
  playbackRequest++
  if (sound.value) void startMusic()
  else backgroundMusic.value?.pause()
}
function musicOnButton(event: Event) {
  const button = (event.target as Element).closest('button')
  if (button && !button.disabled && !button.hasAttribute('data-sound-toggle')) {
    void startMusic()
  }
}
function tone(frequency: number) {
  if (!sound.value) return
  try {
    audio ??= new AudioContext()
    void audio.resume()
    const oscillator = audio.createOscillator()
    const gain = audio.createGain()
    oscillator.connect(gain); gain.connect(audio.destination)
    oscillator.frequency.value = frequency
    gain.gain.setValueAtTime(0.08, audio.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.2)
    oscillator.start(); oscillator.stop(audio.currentTime + 0.2)
  } catch { sound.value = false }
}
function startDrop() {
  if (!available.value) return
  game.value?.focus({ preventScroll: true })
  tone(440)
  drop()
}
watch(won, value => { if (value) tone(880) })
function activateSpace() {
  if (phase.value === 'finished') reset()
  else startDrop()
}
function keyDown(event: KeyboardEvent) {
  if (!['ArrowLeft', 'ArrowRight', ' '].includes(event.key)) return
  event.preventDefault()
  void startMusic()
  if (event.key === 'ArrowLeft') move(-1)
  else if (event.key === 'ArrowRight') move(1)
  else if (!event.repeat) activateSpace()
}
function keyUp(event: KeyboardEvent) {
  if (['ArrowLeft', 'ArrowRight'].includes(event.key)) { event.preventDefault(); stop() }
}
function windowAim(event: PointerEvent) {
  const bounds = (event.currentTarget as Element).getBoundingClientRect()
  game.value?.focus({ preventScroll: true })
  aim((event.clientX - bounds.left) / bounds.width * 600)
}
async function toggleFullscreen() {
  try {
    if (document.fullscreenElement) await document.exitFullscreen()
    else if (game.value?.requestFullscreen) await game.value.requestFullscreen()
    else message.value = 'Fullscreen isn’t available in this browser.'
  } catch { message.value = 'Fullscreen isn’t available. You can still play here!' }
}
function syncFullscreen() { fullscreen.value = Boolean(document.fullscreenElement) }
onMounted(() => document.addEventListener('fullscreenchange', syncFullscreen))
onUnmounted(() => {
  playbackRequest++
  backgroundMusic.value?.pause()
  document.removeEventListener('fullscreenchange', syncFullscreen)
  void audio?.close()
})

</script>


<template>
  <main ref="game" tabindex="0" aria-label="Claw Club game. Arrow keys to move, Space to drop or play again after a catch." class="relative isolate min-h-screen bg-gradient-to-b from-[#fffdf2] via-[#fff9ed] to-[#fff0f3] px-3 py-3 font-sans text-[#292725] outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-violet-500 sm:px-6" @keydown="keyDown" @keyup="keyUp" @focusout="stop" @pointerdown.capture="musicOnButton" @click.capture="musicOnButton">
    <GameBackdrop />
    <audio ref="backgroundMusic" src="/audio/yummy-flavor.mp3" loop preload="none" aria-hidden="true" />
    <header class="relative z-10 mx-auto flex max-w-[1400px] items-center justify-between gap-2">
      <div class="flex items-center gap-1 text-base font-black sm:gap-3 sm:text-3xl">
        <svg viewBox="-64 -38 128 132" aria-hidden="true" class="h-14 w-14 sm:h-20 sm:w-20"><ClawIllustration /></svg>
        <span>Classroom Arcade</span>
      </div>
      <div class="flex gap-3 sm:gap-5">
        <button data-sound-toggle :aria-pressed="sound" :aria-label="sound ? 'Turn sound off' : 'Turn sound on'" class="flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-[#292725] bg-gradient-to-b from-[#fff1aa] to-[#ffda6a] shadow-[inset_0_0_0_4px_#fff8ce,0_3px_0_#cdb664] focus-visible:outline-4 focus-visible:outline-violet-500 sm:h-16 sm:w-16 sm:border-[4px]" @click="toggleSound">
          <svg viewBox="0 0 40 40" aria-hidden="true" class="h-8 w-8 sm:h-10 sm:w-10"><path d="M7 15H13L22 8V32L13 25H7Z" class="fill-current stroke-current" stroke-width="3" stroke-linejoin="round" /><path v-if="sound" d="M27 13Q35 20 27 27M32 8Q44 20 32 32" class="fill-none stroke-current" stroke-width="3" stroke-linecap="round" /><path v-else d="M27 16L35 24M35 16L27 24" class="stroke-current" stroke-width="3" stroke-linecap="round" /></svg>
        </button>
        <button :aria-pressed="fullscreen" :aria-label="fullscreen ? 'Exit fullscreen' : 'Fullscreen'" class="flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-[#292725] bg-gradient-to-b from-[#f3fbff] to-[#c9e5f4] shadow-[inset_0_0_0_4px_#f4fbff,0_3px_0_#b9d4df] focus-visible:outline-4 focus-visible:outline-violet-500 sm:h-16 sm:w-16 sm:border-[4px]" @click="toggleFullscreen">
          <svg viewBox="0 0 40 40" aria-hidden="true" class="h-8 w-8 sm:h-10 sm:w-10"><path d="M14 8H8V14M26 8H32V14M8 26V32H14M32 26V32H26" class="fill-none stroke-current" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </button>
      </div>
    </header>
    <section class="relative z-10 mx-auto max-w-[min(1100px,118vh)] text-center">
      <h1 class="text-[clamp(2rem,5.5vw,4.8rem)] leading-[1.12] font-black tracking-tight [text-shadow:1px_0_0_currentColor,-1px_0_0_currentColor,0_1px_0_currentColor,0_-1px_0_currentColor]">Catch a little friend!</h1>
      <p class="mt-1 text-sm font-bold sm:text-[clamp(1rem,2vw,1.7rem)]">Scoot, drop, and meet your new buddy!</p>
      <div class="relative mx-auto mt-1 max-w-[min(1000px,80vh)] sm:mt-2">
        <GameScene :phase="phase" :x="x" :y="y" :closure="closure" :prizes="prizes" :caught="caught" :won="won" :fall="fall" @aim="windowAim" />
        <GameControls class="absolute bottom-[4%] left-[9%] h-[18%] w-[65%]" :disabled="!available" :direction="direction" @move="move" @stop="stop" @drop="startDrop" />
      </div>
      <ol aria-label="How to play" class="mx-auto mt-2 flex max-w-[1000px] flex-wrap justify-center gap-2 text-sm font-bold sm:text-lg">
        <li class="flex items-center gap-2 rounded-full border-[3px] border-[#292725] bg-gradient-to-b from-[#fffbea] to-[#fff0bd] px-4 py-2">
          <span>1. Scoot</span>
          <kbd aria-label="Left arrow" class="rounded-md border-2 border-[#77766f] bg-gradient-to-b from-white to-[#e6e5df] px-3 py-0.5 shadow-[inset_0_-2px_0_#bdbcb5]">←</kbd>
          <kbd aria-label="Right arrow" class="rounded-md border-2 border-[#77766f] bg-gradient-to-b from-white to-[#e6e5df] px-3 py-0.5 shadow-[inset_0_-2px_0_#bdbcb5]">→</kbd>
        </li>
        <li class="flex items-center gap-2 rounded-full border-[3px] border-[#292725] bg-gradient-to-b from-[#fffbea] to-[#fff0bd] px-4 py-2">
          <span>{{ won ? 'Play again' : '2. Drop' }}</span><button :aria-label="won ? 'Play again with Space' : 'Drop with Space'" class="min-h-11 rounded-md border-2 border-[#77766f] bg-gradient-to-b from-white to-[#e6e5df] px-3 py-0.5 shadow-[inset_0_-2px_0_#bdbcb5] focus-visible:outline-4 focus-visible:outline-violet-500" @click="activateSpace"><kbd>Space</kbd></button>
        </li>
        <li class="flex items-center gap-2 rounded-full border-[3px] border-[#292725] bg-gradient-to-b from-[#fffbea] to-[#fff0bd] px-4 py-2">
          <span>3. Say hello!</span><svg viewBox="0 0 32 30" aria-hidden="true" class="h-7 w-7"><path d="M16 8C5-7-8 9 16 27C40 9 27-7 16 8Z" class="fill-[#ffaac1] stroke-[#292725]" stroke-width="2.5" stroke-linejoin="round" /></svg>
        </li>
      </ol>
      <button class="mt-2 rounded-full border-[3px] border-[#292725] bg-gradient-to-b from-[#ffc4ce] to-[#ffa2b9] px-8 py-2 text-base font-bold shadow-[inset_0_3px_0_#ffe4e7] focus-visible:outline-4 focus-visible:outline-violet-500 sm:text-xl" @click="reset"><span class="mr-3 text-2xl" aria-hidden="true">⟳</span> Play again</button>
      <p role="status" aria-live="polite" class="mt-2 min-h-6 text-sm font-bold text-[#5c6554]">{{ won ? '★ ' : '' }}{{ message }}</p>
    </section>
  </main>
</template>







