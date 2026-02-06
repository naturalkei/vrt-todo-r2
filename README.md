# 🍃 VRT Todo R2

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-5-FF6B6B?style=flat-square)
![Vitest](https://img.shields.io/badge/Vitest-4-729B1B?style=flat-square&logo=vitest&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-1-2EAD33?style=flat-square&logo=playwright&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

> **🎮 Nook Exchange Themed Todo App with Rigorous QA**
> <br> A production-ready todo list application featuring **comprehensive testing**, **full accessibility**, and a delightful **Animal Crossing aesthetic**.
> <br> Built with strict **PR-per-feature** workflow and **zero A11y violations**.

## ✨ Key Features

### 🧪 **Rigorous Testing (NEW!)**
- **14 Unit Tests** - Comprehensive Zustand store coverage
- **11 E2E Tests** - Full user flow validation with Playwright
- **A11y Tests** - Automated accessibility checks with axe-core
- **Zero Violations** - WCAG 2.1 AA compliance

### 🎨 **Nook Exchange Aesthetic**
- Soft pastel color palette (cream, mint, yellow, green, brown)
- Bubbly, rounded UI elements
- Custom background pattern
- Korean/English bilingual interface
- `Baloo 2` + `Noto Sans KR` typography

### 📋 **Full Todo Management**
- ✅ CRUD operations with validation
- 🔍 Real-time search functionality
- 🏷️ Tag support
- 📅 Due date tracking
- 🔄 Drag-and-drop reordering
- 💾 IndexedDB persistence
- 🎯 Filter (All/Active/Completed)

### ♿ **Accessibility First**
- Semantic HTML throughout
- Proper ARIA labels on all interactive elements
- Full keyboard navigation support
- Screen reader friendly
- Focus management with visual indicators
- Automated axe-core validation

## 📦 Tech Stack

| Category | Technology | Version |
| :--- | :--- | :--- |
| **Framework** | [React](https://react.dev) | v19 |
| **Build Tool** | [Vite](https://vitejs.dev) | v7 |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) | v4 |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs) | v5 |
| **Database** | [idb (IndexedDB)](https://github.com/jakearchibald/idb) | v8 |
| **Drag & Drop** | [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) | v18 |
| **Date Utilities** | [date-fns](https://date-fns.org) | v4 |
| **Unit Testing** | [Vitest](https://vitest.dev) | v4 |
| **E2E Testing** | [Playwright](https://playwright.dev) | v1 |
| **A11y Testing** | [axe-core](https://www.deque.com/axe/) | v2 |
| **Language** | [TypeScript](https://www.typescriptlang.org) | v5 |
| **Linter** | [ESLint](https://eslint.org) | v9 |
| **Package Manager** | [pnpm](https://pnpm.io) | v10+ |
| **Versioning** | [standard-version](https://github.com/conventional-changelog/standard-version) | v9 |

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/naturalkei/vrt-todo-r2.git
cd vrt-todo-r2
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Install Playwright browsers (for E2E tests)

```bash
pnpm exec playwright install
```

### 4. Run Development Server

```bash
pnpm dev
```

Open `http://localhost:5173` to see the app! 🎉

## 📜 Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start Vite development server with HMR |
| `pnpm build` | Run TypeScript check and build for production |
| `pnpm serve` | Preview the production build locally |
| `pnpm lint` | Run ESLint to check for code style issues |
| `pnpm lint:fix` | Automatically fix ESLint issues |
| `pnpm test` | **Run unit tests with Vitest** |
| `pnpm test:ui` | Run unit tests with Vitest UI |
| `pnpm test:coverage` | Generate test coverage report |
| `pnpm e2e` | **Run E2E tests with Playwright** |
| `pnpm e2e:ui` | Run E2E tests with Playwright UI |
| `pnpm release` | Generate changelog and bump version |

## 🧩 Project Structure

```text
vrt-todo-r2/
├── .github/
│   └── workflows/
│       ├── ci.yml              # PR validation (lint, test, build)
│       └── deploy.yml          # GitHub Pages deployment
├── public/
│   ├── bg-pattern.svg          # Seamless background pattern
│   ├── favicon-source.svg      # App icon
│   └── og-image.svg            # Social media preview
├── src/
│   ├── components/
│   │   ├── SearchBar.tsx       # Search input with A11y
│   │   ├── TodoItem.tsx        # Individual todo with drag handle
│   │   └── TodoList.tsx        # Main list with filters
│   ├── lib/
│   │   └── db.ts               # IndexedDB wrapper
│   ├── stores/
│   │   ├── __tests__/
│   │   │   └── todo-store.test.ts  # Unit tests
│   │   └── todo-store.ts       # Zustand store
│   ├── test/
│   │   └── setup.ts            # Vitest setup
│   ├── App.tsx                 # App entry point
│   ├── main.tsx                # React DOM rendering
│   └── index.css               # Tailwind + fonts
├── tests/
│   └── app.spec.ts             # E2E & A11y tests
├── playwright.config.ts        # Playwright configuration
├── vite.config.ts              # Vite + Vitest configuration
├── tailwind.config.ts          # Nook Exchange theme
└── package.json
```

## 🧪 Testing

This project follows a **rigorous testing standard**:

### Unit Tests (Vitest)

```bash
pnpm test
```

**Coverage:**
- Store actions (load, add, toggle, update, delete)
- Filter logic (all/active/completed)
- Search functionality (text + tags)
- Error handling

**14 tests** - All passing ✅

### E2E Tests (Playwright)

```bash
pnpm e2e
```

**Scenarios:**
- Todo CRUD operations
- Drag-and-drop reordering
- Search and filter
- Keyboard navigation
- IndexedDB persistence (refresh test)
- Stats display
- Empty states

**11 tests** - All passing ✅

### Accessibility Tests (axe-core)

Automated accessibility scanning with **zero violations**:
- ARIA labels validation
- Keyboard navigation
- Focus management
- Color contrast
- Screen reader compatibility

## 🎨 Design System

### Color Palette (Nook Exchange)

```typescript
colors: {
  nook: {
    cream: '#FFF8E7',         // Warm cream background
    'cream-dark': '#FFE4BC',  // Darker cream borders
    mint: '#B8E6D5',          // Completed todo background
    'mint-dark': '#8ED3B8',   // Mint accents
    sky: '#C9E4F5',           // Edit button background
    'sky-dark': '#A5D3F0',    // Sky hover state
    peach: '#FFD5C2',         // Delete button background
    'peach-dark': '#FFBB9F',  // Peach hover state
    yellow: '#FFF4A3',        // Active todo background
    'yellow-dark': '#FFE87C', // Yellow accents
    brown: '#8B6F47',         // Text color
    'brown-dark': '#6B5434',  // Heading color
    green: '#7EC850',         // Primary action color
    'green-dark': '#5FA732',  // Green hover state
  }
}
```

### Typography

- **Baloo 2** - English text and numbers (bubbly, playful)
- **Noto Sans KR** - Korean text (clean, readable)

### Border Radius

- `rounded-bubble`: 1.5rem (24px)
- `rounded-bubbly`: 2rem (32px)

### Shadows

- `shadow-soft`: Subtle shadow for cards
- `shadow-bubble`: Deeper shadow for interactive elements
- `shadow-glow`: Green glow for focused inputs

## 🤖 Automated Development Workflow

This project was built using a **strict PR-per-feature** workflow:

1. **Step 1 (PR #1):** Project scaffolding + testing infrastructure
2. **Step 2 (PR #2):** Database schema + Zustand store
3. **Step 3 (PR #3):** Accessible UI components with drag-and-drop
4. **Step 4 (PR #4):** Asset generation (background, favicon, OG image)
5. **Step 5 (PR #5):** Design integration (Nook Exchange theme)
6. **Step 6 (PR #6):** QA & Testing suite (14 unit + 11 E2E tests)
7. **Step 7 (PR #7):** CI/CD pipelines + cleanup
8. **Step 8 (PR #8):** Documentation

Each PR followed the **"Verify & Merge Routine"**:
- Lint → Test → Build → Commit → Push → PR → Merge

## 🚀 Deployment

### Automatic Deployment

Push to `main` branch triggers automatic deployment to GitHub Pages:

```bash
git push origin main
```

### Manual Testing Before Deployment

```bash
pnpm lint        # Check code style
pnpm test --run  # Run unit tests
pnpm e2e         # Run E2E tests
pnpm build       # Build for production
pnpm serve       # Preview production build
```

## 📝 Usage Guide

### Adding a Todo

1. Type your task in the input field
2. Press Enter or click "추가" button
3. Todo appears with yellow background (active state)

### Completing a Todo

1. Click the circle checkbox next to any todo
2. Background changes to mint green
3. Text gets strikethrough effect

### Editing a Todo

1. Hover over a todo to reveal edit button
2. Click the pencil icon
3. Edit text inline
4. Press Enter to save or Esc to cancel

### Drag and Drop

1. Hover over a todo to reveal drag handle
2. Drag the grip icon to reorder
3. Order persists in IndexedDB

### Searching

1. Type in the search bar
2. Todos filter in real-time
3. Searches both text and tags

### Filtering

- **전체 (All)** - Show all todos
- **진행중 (Active)** - Show incomplete todos
- **완료 (Completed)** - Show completed todos

## 🌟 Why This Stack?

- **Vite 7** - Lightning-fast HMR and builds
- **React 19** - Latest React optimizations
- **Tailwind CSS 4** - Oxide engine for faster styling
- **Zustand** - Minimalist state management (no boilerplate)
- **IndexedDB** - Persistent storage without external services
- **Vitest** - Fast unit testing with native ESM support
- **Playwright** - Reliable E2E testing across browsers
- **axe-core** - Industry-standard A11y validation
- **pnpm** - Fast, disk-efficient package management

## ♿ Accessibility Compliance

This app meets **WCAG 2.1 AA** standards:

- ✅ All interactive elements have proper ARIA labels
- ✅ Keyboard navigation fully supported
- ✅ Focus indicators visible on all interactive elements
- ✅ Color contrast ratios meet minimum requirements
- ✅ Screen reader compatible
- ✅ Semantic HTML throughout
- ✅ Zero automated accessibility violations

## 🐛 Known Issues

None currently! 🎉

## 🔮 Future Enhancements

- [ ] Todo categories/projects
- [ ] Dark mode toggle
- [ ] Due date reminders
- [ ] Recurring todos
- [ ] Export/import functionality
- [ ] Collaborative todos (sync)
- [ ] PWA support
- [ ] Mobile app wrapper

## 📄 License

MIT License - feel free to use this project for learning or as a starter template!

## 💝 Credits

- Design inspiration: **Animal Crossing: New Horizons** / **Nook Exchange** by Nintendo
- Icons: [Lucide Icons](https://lucide.dev)
- Fonts: [Google Fonts](https://fonts.google.com)

---

**Built with 🌸 following strict PR-per-feature protocol and comprehensive QA standards.**

**Enjoy your cozy, accessible todo experience!** 🦝✨
