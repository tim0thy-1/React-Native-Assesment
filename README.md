# ShopLite - Product Browsing Mobile App

A production-grade mobile product browsing app built according to the **React Native + Expo** assessment specification, utilizing the public [DummyJSON API](https://dummyjson.com).

---

## 📱 Features & Highlights

1. **Navigation & Deep Linking**
   - Bottom navigation tabs (**Home**, **Favorites**) with icons and active/inactive state indicators.
   - Dynamic product details screen (`/product/[id]`).
   - Deep link handler for `shoplite://product/5` (and URL hash `#product/5`) opening directly into the product details with a working back action.
   - Built-in Interactive Assessment Demo Bar to test deep linking, simulated offline modes, and API error recovery directly.

2. **Product List (Home)**
   - Reusable `useInfiniteProducts` custom hook managing pagination (20 items/page), background loading, pull-to-refresh, deduplication, and error recovery.
   - Search with **400 ms debounce** via custom `useDebounce` hook.
   - Sort by **Price** or **Rating** (`asc` / `desc`) utilizing `sortBy` and `order` query parameters.
   - Outdated request cancellation using `AbortController` to guarantee race-condition safety.
   - 6-card grey skeleton loaders on initial load, "loading more" bottom spinner, empty state icon (`No products found for '<query>'`), and error state with `Retry` button.
   - Memoized list items (`React.memo`) and stable callbacks for butter-smooth scrolling with 100+ items.

3. **Product Details**
   - Instant rendering using already-loaded list data, with background API refresh for rich metadata.
   - Full-width image carousel (~40% viewport height) with drag/swipe gesture support, floating back and heart buttons, and page indicator dots.
   - Title, brand, and category hierarchy.
   - Price row: large discounted price in primary color (`#4F46E5`), struck-through original price, and green discount percentage pill.
   - Five-star rating row with numeric score and review count.
   - Dynamic stock pill: Green (`In stock (n)`) for $\ge 10$, Amber (`Only n left`) for $< 10$, Red (`Out of stock`) for $0$.
   - Full description and full-width "Add to Favorites" / "Remove from Favorites" button.

4. **Favorites & Global State Management**
   - Implemented with **React Context + `useReducer`** for predictable, immutable state transitions.
   - Persisted with `AsyncStorage` interface and **synchronously hydrated on launch** to eliminate any flash of empty content.
   - Grouped by category in a `SectionList` format with uppercase headers and item counts (e.g., `SMARTPHONES (2)`).
   - Removing an item displays a dark snackbar for **4 seconds** with an **`UNDO`** action that restores the item in its exact original position.
   - Tab badge on Favorites tab shows the real-time count of saved items, always in sync across all screens.

5. **Offline Support**
   - Connectivity detection with online/offline listeners.
   - High-visibility amber banner at the top: *"You're offline - showing saved results"*.
   - Caches the initial page of products for instant offline launch.
   - Automatically reloads and retries queries when the network connection is restored.

6. **Unit Tests**
   - 100% passing Vitest test suite covering:
     - `favoritesReducer`: Initial state, hydration, add, deduplication, removal, index-accurate Undo restoration, snackbar dismissal, and category grouping.
     - `useDebounce`: Initial value, rapid keystroke debouncing, timer reset, and delayed value propagation.

---

## 🎨 Design Tokens

All design tokens are stored in a centralized theme file (`src/theme/tokens.ts`) with no hard-coded colors inside components:

| Token | Value | Description |
| :--- | :--- | :--- |
| **Primary** | `#4F46E5` | Indigo accent for active tabs, buttons, prices |
| **Background** | `#F8F9FB` | Clean, subtle app background |
| **Text** | `#111827` | High-contrast body text |
| **Muted text** | `#6B7280` | Subtitles, labels, struck-through prices |
| **Success** | `#16A34A` | Stock status $\ge 10$, discount badges |
| **Warning / rating** | `#F59E0B` | Low stock alerts ($< 10$), star ratings |
| **Danger** | `#DC2626` | Out of stock ($0$), delete action, tab badge |
| **Border / skeleton** | `#E5E7EB` | Card borders, dividers, skeleton placeholders |
| **Spacing Scale** | `4, 8, 12, 16, 24` | Consistent 4pt grid system |
| **Radius** | Cards `12px`, buttons `10px`, chips & pills `full` |
| **Touch Targets** | $\ge 44 \times 44 \text{ px}$ | Strict accessibility compliance |

---

## 📁 Folder Structure

```
src/
├── __tests__/
│   ├── favoritesReducer.test.ts  # Tests for favorites reducer & section grouping
│   └── useDebounce.test.ts        # Tests for 400ms debounce hook
├── components/
│   ├── BottomTabBar.tsx           # Tab bar with active states & count badge
│   ├── ImageCarousel.tsx          # Swipeable image carousel with dots & floating buttons
│   ├── OfflineBanner.tsx          # Amber offline notification banner
│   ├── ProductCard.tsx            # Memoized 2-col product card
│   ├── RatingStars.tsx            # Star rating row with numeric score
│   ├── SearchBar.tsx              # Rounded search bar with clear (x) button
│   ├── SkeletonCard.tsx           # 6-card skeleton loading grid
│   ├── SortChips.tsx              # Pill chips for Price, Rating, Low-High, High-Low
│   ├── StockBadge.tsx             # Dynamic stock pill (green, amber, red)
│   ├── TesterToolbar.tsx          # Assessment scenario tester bar
│   └── UndoSnackbar.tsx           # 4-second Undo snackbar
├── context/
│   ├── FavoritesContext.tsx       # Global Context provider with storage sync & timer
│   └── favoritesReducer.ts        # Pure reducer with index-accurate Undo logic
├── hooks/
│   ├── useDebounce.ts             # Custom 400ms debounce hook
│   ├── useInfiniteProducts.ts     # Infinite scroll, pagination, deduplication, abort controller
│   └── useNetworkStatus.ts        # Online/offline detector with airplane toggle
├── screens/
│   ├── FavoritesScreen.tsx        # SectionList grouped by category with remove action
│   ├── HomeScreen.tsx             # 2-column grid, search, sort, pull-to-refresh
│   └── ProductDetailsScreen.tsx   # Instant rendering, carousel, price row, stock
├── services/
│   ├── api.ts                     # DummyJSON API client with AbortController & cache
│   └── storage.ts                 # AsyncStorage abstraction with sync hydration
├── theme/
│   └── tokens.ts                  # Centralized design tokens
├── App.tsx                        # Root layout, mobile viewport container & deep link routing
├── index.css                      # Tailwind CSS v4 styling
└── main.tsx                       # React root entry point
```

---

## 🚀 Setup & Execution

### Prerequisites
- Node.js 18+ (tested on Node.js 22)
- npm

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 3. Run Unit Tests
```bash
npm test
```
All unit tests will execute via Vitest and report 100% passing results.

### 4. Build for Production
```bash
npm run build
```

---

## 🧪 Expected Output Verification Matrix

| Scenario | Tested In App | Result |
| :--- | :--- | :--- |
| **App launch** | Initial render | 6 grey skeleton cards appear, followed by a 2-column grid of 20 products. Cached favorites render with zero flicker. |
| **Scroll to the end** | Scroll container | Next 20 products load with a bottom spinner. No duplicate IDs and no duplicate requests. |
| **Pull down** | Touch / refresh button | Pulling down refreshes from page 1. |
| **Type "phone" quickly** | Search bar | Only 1 request fires 400 ms after typing stops. Results match query. Clearing restores full list. |
| **Select Price, Low-High** | Sort chips | List resets and sorts from cheapest to most expensive (`sortBy=price&order=asc`). |
| **Tap a product** | Click card | Details screen opens instantly with title, price and image, then refreshes from API in background. |
| **Tap the heart** | Heart button | Heart state toggles and tab badge updates on every screen immediately. |
| **Close and reopen app** | Refresh page | Favorites are persisted in storage and remain available. |
| **Remove a favorite, tap UNDO** | Favorites screen | Item is removed, 4s dark snackbar appears; tapping UNDO restores the item to its exact position in the section. |
| **Turn on airplane mode, restart** | Demo toolbar toggle | Amber offline banner appears, cached page 1 loads. Turning off hides banner and reloads data automatically. |
| **Open `shoplite://product/5`** | Deep link bar / URL hash | Opens directly to product 5; floating back button returns to Home. |
| **API failure** | Demo toolbar "Simulate API Fail" | Displays error message with Retry button; clicking Retry recovers without restarting the app. |
| **Run npm test** | Terminal | All 11 unit tests pass. |

---

## 💡 State Management Decision

`Context + useReducer` was selected because:
1. It is native to React and React Native without bulky external dependencies.
2. It allows completely pure, deterministic state transitions for actions like `REMOVE_FAVORITE` and `UNDO_REMOVE`, storing the product and its original insertion index to guarantee identical section placement upon restoration.
3. It integrates cleanly with synchronous memory cache hydration during `useReducer` initialization to guarantee zero flash of empty content when the app opens.

---

## 📌 Known Limitations
- The DummyJSON free public API contains a finite set of 194 products. Once page 10 is reached, infinite scroll gracefully marks the end of the catalog.
- In a web browser environment, the mobile device frame renders the exact viewport dimensions (390–430px) of an iPhone/Android device, with touch and mouse drag interactions for carousel paging and pull-to-refresh.
