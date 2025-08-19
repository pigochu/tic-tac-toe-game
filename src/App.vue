<template>
  <div class="app-shell">
    <header class="header">井字遊戲</header>
    <main class="container">
      <section class="board-area">
        <Board ref="board" :started="started" @gameEnd="onGameEnd" />
      </section>
      <aside class="side-area">
        <div class="card">
          <div class="card-body">
            <h3 class="card-title">控制面板</h3>
            <div class="space-y-4">
              <button class="btn btn-primary w-full" @click="toggleGame">{{ started ? '重新開始' : '開始遊戲' }}</button>

              <div class="">
                <p class="label-text">玩家 (你) 勝利: <span class="font-medium">{{ wins.player }}</span></p>
                <p class="label-text">電腦 勝利: <span class="font-medium">{{ wins.cpu }}</span></p>
              </div>
            </div>
            <div class="card-actions mt-4">
              <button class="btn btn-outline" @click="toggleGame">{{ started ? '停止' : '開始' }}</button>
            </div>
          </div>
        </div>
      </aside>
  </main>

  <!-- FAQ removed -->

    <!-- Vue controlled modal -->
    <Transition name="modal">
      <div v-if="showModal" class="modal-backdrop" @click.self="showModal = false">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="modal-title text-lg font-medium">遊戲結果</h3>
            </div>
            <div class="modal-body py-4">
              <p class="text-center text-xl">{{ modalMessage }}</p>
            </div>
            <div class="modal-footer">
              <button class="btn btn-primary w-full sm:w-auto" @click="showModal = false">關閉</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <footer class="footer">採用 Vue 3 + TypeScript + FlyonUI 2.4 開發</footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Board from './components/Board.vue'

export default defineComponent({
  components: { Board },
  setup() {
  const started = ref(false)
  const wins = ref({ player: 0, cpu: 0 })
  const modalMessage = ref<string>('')
  const showModal = ref(false)

    function toggleGame() {
      started.value = !started.value
      // trigger child to reset via event or ref
      const ev = new CustomEvent('game-toggle', { detail: { started: started.value } })
      window.dispatchEvent(ev)
      // when stopping, ensure modal is closed
      if (!started.value) {
        showModal.value = false
      }
    }

    function onGameEnd(winner: string) {
      modalMessage.value = winner === 'player' ? '你贏了！' : (winner === 'cpu' ? '電腦贏了！' : '平手')
      if (winner === 'player') wins.value.player += 1
      if (winner === 'cpu') wins.value.cpu += 1
      // game ended -> stop started state
      started.value = false
      // show modal with result
      showModal.value = true
    }

  // export bindings from setup
  return { started, wins, modalMessage, showModal, toggleGame, onGameEnd }
  }
})
</script>

<style scoped>
/* Modal styles */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}
.modal-dialog {
  width: 90%;
  max-width: 32rem;
  margin: 1rem;
}
.modal-content {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
}
.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}
.modal-body {
  padding: 1.5rem;
}
.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
}
/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
/* minimal fallback for btn in case FlyonUI isn't loaded yet */
.btn { padding: 0.5rem 0.9rem; border-radius: 6px; background:#2563eb; color:#fff; border: none }
.btn:disabled { opacity: 0.6 }
</style>

