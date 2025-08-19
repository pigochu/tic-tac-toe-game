<template>
  <div style="width: min(90vw, 80vh, 600px);">
    <svg :viewBox="`0 0 ${size} ${size}`" :width="size" :height="size" @click="onBoardClick($event)">
      <!-- grid lines -->
      <line v-for="(l,i) in lines" :key="i" :x1="l.x1" :y1="l.y1" :x2="l.x2" :y2="l.y2" stroke="#333" stroke-width="4" stroke-linecap="round" />

      <!-- cells: draw X or O -->
      <g v-for="(cell, idx) in cells" :key="idx">
        <g v-if="cell === 'X'">
          <line :x1="cellPos(idx).x1" :y1="cellPos(idx).y1" :x2="cellPos(idx).x2" :y2="cellPos(idx).y2" stroke="#e11d48" stroke-width="8" stroke-linecap="round" />
          <line :x1="cellPos(idx).x3" :y1="cellPos(idx).y3" :x2="cellPos(idx).x4" :y2="cellPos(idx).y4" stroke="#e11d48" stroke-width="8" stroke-linecap="round" />
        </g>
        <g v-else-if="cell === 'O'">
          <circle :cx="cellCenter(idx).x" :cy="cellCenter(idx).y" :r="cellRadius" stroke="#0ea5e9" stroke-width="8" fill="none" />
        </g>
      </g>

      <!-- winning line -->
      <line v-if="winLine" :x1="winLine.x1" :y1="winLine.y1" :x2="winLine.x2" :y2="winLine.y2" stroke="#16a34a" stroke-width="10" stroke-linecap="round" />
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue'

type Cell = null | 'X' | 'O'

export default defineComponent({
  name: 'Board',
  props: {
    started: { type: Boolean, required: false }
  },
  emits: ['gameEnd'],
  setup(props: { started?: boolean }, { emit }: { emit: (e: 'gameEnd', payload: string) => void }) {
    const size = 600
    const cells = ref<Cell[]>(Array(9).fill(null))
    const current = ref<'player'|'cpu'>('player')
    const winLine = ref<null | { x1:number;y1:number;x2:number;y2:number }>(null)

    const cellRadius = 40

    const lines = [
      { x1: size/3, y1: 0, x2: size/3, y2: size },
      { x1: 2*size/3, y1: 0, x2: 2*size/3, y2: size },
      { x1: 0, y1: size/3, x2: size, y2: size/3 },
      { x1: 0, y1: 2*size/3, x2: size, y2: 2*size/3 }
    ]

    function reset() {
      cells.value = Array(9).fill(null)
      winLine.value = null
      current.value = 'player'
    }

    function cellRect(idx:number) {
      const col = idx % 3
      const row = Math.floor(idx / 3)
      const w = size / 3
      const h = size / 3
      return { x: col * w, y: row * h, w, h }
    }

    function cellCenter(idx:number) {
      const r = cellRect(idx)
      return { x: r.x + r.w/2, y: r.y + r.h/2 }
    }

    function cellPos(idx:number) {
      const c = cellRect(idx)
      const padding = 30
      return {
        x1: c.x + padding,
        y1: c.y + padding,
        x2: c.x + c.w - padding,
        y2: c.y + c.h - padding,
        x3: c.x + padding,
        y3: c.y + c.h - padding,
        x4: c.x + c.w - padding,
        y4: c.y + padding
      }
    }

    function onBoardClick(e: MouseEvent) {
      if (!props.started) return
      const svg = (e.currentTarget as SVGElement)
      // Use bounding client rect to compute svg-local coordinates (more compatible)
      const rect = svg.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * size
      const y = ((e.clientY - rect.top) / rect.height) * size
  const col = Math.floor(x / (size/3))
  const row = Math.floor(y / (size/3))
      const idx = row * 3 + col
      if (idx < 0 || idx >= 9) return
      if (cells.value[idx] !== null) return
      if (current.value !== 'player') return
      cells.value[idx] = 'X'
      // check win
      const winner = checkWinner(cells.value)
      if (winner) return handleWin(winner)
      current.value = 'cpu'
      // cpu move after short delay
      setTimeout(() => cpuMove(), 300)
    }

    // 檢查是否有贏的機會
    function findWinningMove(board: Cell[], player: 'X' | 'O'): number | null {
      const empties = board.map((v, i) => v === null ? i : -1).filter(i => i >= 0)
      for (const pos of empties) {
        const testBoard = [...board]
        testBoard[pos] = player
        if (checkWinner(testBoard) === player) {
          return pos
        }
      }
      return null
    }

    // 檢查對手是否有機會連成三個
    function findBlockingMove(board: Cell[], player: 'X' | 'O'): number | null {
      const opponent = player === 'X' ? 'O' : 'X'
      return findWinningMove(board, opponent)
    }

    // 檢查是否能製造雙重威脅
    function findForkMove(board: Cell[], player: 'X' | 'O'): number | null {
      const empties = board.map((v, i) => v === null ? i : -1).filter(i => i >= 0)
      for (const pos of empties) {
        const testBoard = [...board]
        testBoard[pos] = player
        let threatCount = 0
        // 計算在這步棋後，有多少贏的機會
        for (const nextPos of empties) {
          if (nextPos === pos) continue
          const nextBoard = [...testBoard]
          nextBoard[nextPos] = player
          if (checkWinner(nextBoard) === player) {
            threatCount++
          }
        }
        if (threatCount >= 2) {
          return pos
        }
      }
      return null
    }

    function cpuMove() {
      if (cells.value.filter(c => c === null).length === 0) {
        emit('gameEnd', 'draw')
        return
      }

      let move: number | null = null

      // 1. 檢查是否能贏
      move = findWinningMove(cells.value, 'O')
      if (move !== null) {
        cells.value[move] = 'O'
        return handleWin('O')
      }

      // 2. 檢查是否需要阻擋玩家
      move = findBlockingMove(cells.value, 'O')
      if (move !== null) {
        cells.value[move] = 'O'
        const winner = checkWinner(cells.value)
        if (winner) return handleWin(winner)
        current.value = 'player'
        return
      }

      // 3. 嘗試製造雙重威脅
      move = findForkMove(cells.value, 'O')
      if (move !== null) {
        cells.value[move] = 'O'
        const winner = checkWinner(cells.value)
        if (winner) return handleWin(winner)
        current.value = 'player'
        return
      }

      // 4. 優先選擇角落或中心
      const corners = [0, 2, 6, 8]
      const center = 4
      
      // 如果中心為空，優先選擇
      if (cells.value[center] === null) {
        cells.value[center] = 'O'
      } else {
        // 尋找空的角落
        const emptyCorners = corners.filter(i => cells.value[i] === null)
        if (emptyCorners.length > 0) {
          const cornerMove = emptyCorners[Math.floor(Math.random() * emptyCorners.length)]
          cells.value[cornerMove] = 'O'
        } else {
          // 如果沒有角落，選擇任意空位
          const empties = cells.value.map((v, i) => v === null ? i : -1).filter(i => i >= 0)
          const randomMove = empties[Math.floor(Math.random() * empties.length)]
          cells.value[randomMove] = 'O'
        }
      }

      const winner = checkWinner(cells.value)
      if (winner) return handleWin(winner)
      current.value = 'player'
    }

    function handleWin(winner: 'X'|'O'|'draw') {
      if (winner === 'draw') {
        emit('gameEnd', 'draw')
        return
      }
      // set win line
      const combo = winningCombo(cells.value)
      if (combo) {
        const a = cellCenter(combo[0])
        const b = cellCenter(combo[2])
        winLine.value = { x1: a.x, y1: a.y, x2: b.x, y2: b.y }
      }
      emit('gameEnd', winner === 'X' ? 'player' : 'cpu')
    }

    function checkWinner(arr: Cell[]) : 'X'|'O'|'draw'|null {
      const combos = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
      ]
      for (const c of combos) {
        const [a,b,d] = c
        if (arr[a] && arr[a] === arr[b] && arr[a] === arr[d]) return arr[a] as 'X'|'O'
      }
      if (arr.every(v=>v!==null)) return 'draw'
      return null
    }

    function winningCombo(arr: Cell[]) {
      const combos = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
      ]
      for (const c of combos) {
        const [a,b,d] = c
        if (arr[a] && arr[a] === arr[b] && arr[a] === arr[d]) return c
      }
      return null
    }

    // listen to global toggle to reset
    onMounted(()=>{
      window.addEventListener('game-toggle', (ev: any)=>{
        const started = ev.detail.started
        if (started) reset()
      })
    })

    return { size, lines, cells, cellCenter, cellPos, cellRadius, winLine, onBoardClick }
  }
})
</script>

<style scoped>
svg { width: 100%; height: auto; touch-action: manipulation }
</style>
