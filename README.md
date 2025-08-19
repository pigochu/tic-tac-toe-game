# 井字遊戲 (Tic-Tac-Toe)

一個使用 Vue 3 和 TypeScript 開發的簡單、現代化且響應式的井字遊戲。

在開始之前，我想告訴大家，本專案其實是我為了練習 AI 而創造出來的，井字遊戲本來就很簡單，但專案使用了目前較新的開發套件，AI 都能理解，我只是提供了一份 [SPECS.md](SPECS.md)，請 `github copilot` 幫我生成專案，過程中也會有錯誤，但跟 AI 慢慢聊，就能修復錯誤，最終做成了一個可玩的版本，而且我永遠贏不了，也許您可以請 AI 加入新手等級的功能練習看看。

為了鼓勵學習 AI ，本專案的版權除了不能販售，但可以用於教學，修改，散佈，版權宣告位於 [LICENSE.md](LICENSE.md)

## 功能

- 與簡易的電腦 AI 對戰。
- 響應式設計，可在各種螢幕尺寸上正常運作。
- 記錄玩家與電腦的勝利次數。
- 使用 Tailwind CSS 打造的現代化使用者介面。

## 技術棧

- **前端框架**: [Vue 3](https://vuejs.org/)
- **建置工具**: [Vite](https://vitejs.dev/)
- **程式語言**: [TypeScript](https://www.typescriptlang.org/)
- **CSS 框架**: [Tailwind CSS](https://tailwindcss.com/)
- **UI 元件庫**: [FlyonUI](https://www.flyonui.com/)

## 專案設定

### 環境需求

- [Node.js](https://nodejs.org/) (建議使用 16 或更高版本)
- [npm](https://www.npmjs.com/) (隨 Node.js 安裝)

### 安裝步驟

1. 複製專案倉庫：
   ```bash
   git clone https://github.com/your-username/tic-tac-toe-game.git
   ```
2. 進入專案目錄：
   ```bash
   cd tic-tac-toe-game
   ```
3. 安裝依賴套件：
   ```bash
   npm install
   ```

## 可用指令

### 啟動開發環境
執行以下指令以啟動開發伺服器。應用程式將會運行在 `http://localhost:5173` (或下一個可用的埠號)。
```bash
npm run dev
```

### 建置生產版本
執行以下指令以建置用於生產環境的應用程式：
```bash
npm run build
```
這會在專案根目錄下建立一個 `dist` 資料夾，存放優化後的檔案。

### 預覽生產版本
如需在本機預覽生產版本的建置結果，請執行：
```bash
npm run preview
```
這會啟動一個本地伺服器來預覽 `dist` 資料夾中的內容。

## 作者

Pigo Chu <pigochu@gmail.com>