export type GamePhase = 'idle' | 'dropping' | 'closing' | 'lifting' | 'delivering' | 'releasing' | 'finished'

export const CLAW_GEOMETRY = {
  homeY: 110,
  grabY: 179,
  chuteX: 521,
  fallDistance: 215,
} as const

export function useClawMachine() {
  const phase = ref<GamePhase>('idle')
  const x = ref(300)
  const y = ref<number>(CLAW_GEOMETRY.homeY)
  const closure = ref(0)
  const direction = ref(0)
  const target = ref<number | null>(null)
  const caught = ref<number | null>(null)
  const won = ref(false)
  const fall = ref(0)
  const message = ref('Your little friends are waiting!')
  const prizes = [155, 300, 445]
  let frame = 0
  let last = 0
  let elapsed = 0
  let startX = 300
  let reduced = false
  const available = computed(() => phase.value === 'idle')
  function release() { direction.value = 0 }
  function stop() { direction.value = 0; target.value = null }
  function move(value: number) {
    if (!available.value) return
    target.value = null
    direction.value = value
  }
  function aim(value: number) {
    if (available.value) { direction.value = 0; target.value = Math.max(75, Math.min(525, value)) }
  }
  function advance(next: GamePhase) { phase.value = next; elapsed = 0 }
  function drop() {
    if (!available.value) return
    stop()
    message.value = 'Here we go…'
    advance('dropping')
  }
  function reset() {
    stop(); x.value = 300; y.value = CLAW_GEOMETRY.homeY; closure.value = 0
    caught.value = null; won.value = false; fall.value = 0
    message.value = 'Your little friends are waiting!'
    advance('idle')
  }
  const ease = (t: number) => t * t * (3 - 2 * t)
  function tick(time: number) {
    const dt = Math.min((time - (last || time)) / 1000, 0.05)
    last = time
    elapsed += dt * (reduced ? 2.5 : 1)
    const p = Math.min(elapsed / 1.1, 1)
    switch (phase.value) {
      case 'idle': {
        const distance = target.value === null ? direction.value * 240 * dt : target.value - x.value
        const step = target.value === null ? distance : Math.sign(distance) * Math.min(Math.abs(distance), 240 * dt)
        x.value = Math.max(75, Math.min(525, x.value + step))
        break
      }
      case 'dropping':
        y.value = CLAW_GEOMETRY.homeY + (CLAW_GEOMETRY.grabY - CLAW_GEOMETRY.homeY) * ease(p)
        if (p === 1) advance('closing')
        break
      case 'closing':
        closure.value = Math.min(elapsed / 0.35, 1)
        if (closure.value === 1) {
          caught.value = prizes.findIndex(position => Math.abs(position - x.value) <= 48)
          if (caught.value === -1) caught.value = null
          message.value = caught.value === null ? 'Almost! Let’s try again.' : 'Got a little friend!'
          advance('lifting')
        }
        break
      case 'lifting':
        y.value = CLAW_GEOMETRY.grabY - (CLAW_GEOMETRY.grabY - CLAW_GEOMETRY.homeY) * ease(p)
        if (p === 1) {
          if (caught.value === null) { closure.value = 0; message.value = 'Try again! Line up over a ball.'; advance('idle') }
          else { startX = x.value; advance('delivering') }
        }
        break
      case 'delivering':
        x.value = startX + (CLAW_GEOMETRY.chuteX - startX) * ease(p)
        if (p === 1) advance('releasing')
        break
      case 'releasing':
        closure.value = 1 - Math.min(elapsed / 0.3, 1)
        fall.value = CLAW_GEOMETRY.fallDistance * Math.min(elapsed / 0.85, 1) ** 2
        if (elapsed >= 0.85) { won.value = true; message.value = 'Hooray! A new friend for you!'; advance('finished') }
        break
    }
    frame = requestAnimationFrame(tick)
  }
  onMounted(() => {
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    frame = requestAnimationFrame(tick)
    window.addEventListener('blur', stop)
    window.addEventListener('pointerup', release)
    window.addEventListener('pointercancel', release)
  })
  onUnmounted(() => {
    cancelAnimationFrame(frame)
    window.removeEventListener('blur', stop)
    window.removeEventListener('pointerup', release)
    window.removeEventListener('pointercancel', release)
  })
  return { phase, x, y, closure, direction, caught, won, fall, message, prizes, available, move, stop, aim, drop, reset }
}





