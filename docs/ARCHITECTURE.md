# Project Architecture

## Overview

This app is a React Native Expo application for managing and organizing clothing items and outfits. It features a modern, scalable architecture inspired by the bulletproof-react pattern, using Drizzle ORM with SQLite for local data, Redux for state management, and a repository pattern for data access. This document is intended to help contributors understand and follow the project’s structure and conventions for consistent, maintainable development.

## File Structure

The project is organized for feature-based development and clear separation of concerns. Key top-level folders:

- `app/` — Navigation entry points and screen components (Expo Router).
- `features/` — Feature modules, each with its own components and logic (e.g., add-item, create-outfit, navigation).
- `components/` — Shared, reusable components (e.g., Camera, ItemPreview).
- `components/ui/` — Core UI primitives enforcing the app’s design system (e.g., AppButton, AppText, AppModal, Input, Snackbar).
- `constants/` — Shared constants, enums, color palettes, and types.
- `db/` — Drizzle ORM schemas for SQLite tables.
- `drizzle/` — Database migration files and metadata.
- `repo/` — Repository interfaces and implementations for data access (database and API).
- `redux/` — Redux store configuration and slices.
- `hooks/` — Custom hooks (e.g., typed Redux hooks).
- `assets/` — Fonts, icons, and images.

Example directory tree:

```
app/
  _layout.tsx
  add-item.tsx
  camera-screen.tsx
  ...
features/
  add-item/components/AddItemForm.tsx
  create-outfit/components/OutfitEditor.tsx
  navigation/components/TopBar.tsx
components/
  Camera.tsx
  ItemPreview.tsx
  ui/
    AppButton.tsx
    AppModal.tsx
    AppText.tsx
    Input.tsx
    Snackbar.tsx
constants/
  constants.ts
  types.ts
  images.ts
  icons.ts
db/
  schemas/
    items.ts
    outfits.ts
drizzle/
  migrations.js
  0000_familiar_human_robot.sql
  ...
repo/
  item_repo/
    ItemRepo.ts
    AppItemRepo.ts
    SqliteItemRepo.ts
  outfit_repo/
    OutfitRepo.ts
    AppOutfitRepo.ts
    SqliteOutfitRepo.ts
redux/
  store.ts
  slices/
    itemSlice.ts
    outfitSlice.ts
    cameraSlice.ts
hooks/
  redux-hooks.ts
assets/
  fonts/
  icons/
```

**Conventions:**

- New features go in `features/feature-name/` with their own components and logic.
- Shared code (components, hooks, constants, types) lives in the respective shared folders.
- Keep feature modules decoupled for parallel development.

## Database: Drizzle ORM + SQLite

- **Initialization:**
  - Drizzle ORM is configured in `drizzle.config.ts` to use SQLite via Expo (`driver: "expo"`).
  - Schemas are defined in `db/schemas/` (e.g., `items.ts`, `outfits.ts`).
- **Entities:**
  - `items`: Clothing items with fields for id, name, type, size, and image URL.
  - `outfits`: Outfits with id, name, array of item ids, image URL, and update flag.
- **Migrations:**
  - Migration SQL files are in `drizzle/` (e.g., `0000_familiar_human_robot.sql`).
  - `drizzle/migrations.js` wires up migration files for Expo/React Native.
- **Usage:**
  - Drizzle is used with Expo SQLite for local persistent storage.
  - To extend the schema, add a new file in `db/schemas/`, update `drizzle.config.ts`, and generate a migration.

## Repository Layer

- **Pattern:**
  - Each data entity has an abstract repository interface (e.g., `ItemRepo.ts`, `OutfitRepo.ts`).
  - Concrete implementations:
    - `SqliteItemRepo.ts`/`SqliteOutfitRepo.ts`: Use Drizzle/SQLite for data access.
    - `AppItemRepo.ts`/`AppOutfitRepo.ts`: App-level wrapper, can combine multiple sources.
- **Usage:**
  - Features and hooks use the `App*Repo` classes for all data access.
  - Repositories encapsulate all Drizzle/SQLite or API logic.
- **Adding a New Repository:**
  1. Create an abstract interface in `repo/your_entity_repo/YourEntityRepo.ts`.
  2. Implement a concrete class for SQLite in the same folder (e.g., `SqliteYourEntityRepo.ts`).
  3. Optionally, add an app-level wrapper (e.g., `AppYourEntityRepo.ts`) to combine sources or add logic.
  4. Use dependency injection or direct instantiation in hooks/components.
- **For a new data source (API):**
  - Add a new implementation (e.g., `ApiYourEntityRepo.ts`) following the same interface.
  - Wire up in the app-level repo or feature as needed.
- **Conventions:**
  - Always use the repository pattern for data access to keep UI and data logic decoupled.

## State Management: Redux

- **Store:**
  - Configured in `redux/store.ts` using Redux Toolkit.
  - Slices: `itemSlice.ts`, `outfitSlice.ts`, `cameraSlice.ts` (in `redux/slices/`).
- **Slices:**
  - `itemSlice`: Manages current item selection.
  - `outfitSlice`: Manages current outfit, items in outfit, and related actions.
  - `cameraSlice`: Manages image state for new items.
- **Provider Setup:**
  - The Redux store is injected at the root of the app (see `app/_layout.tsx` or entry point).
  - Typed hooks in `hooks/redux-hooks.ts` (`useAppDispatch`, `useAppSelector`).
- **Async Logic:**
  - Thunks or async logic can be added using Redux Toolkit conventions.
- **State Location:**
  - Use Redux for cross-feature state (items, outfits, camera image).
  - Use local state for UI-only or ephemeral state.
- **Conventions:**
  - New slices go in `redux/slices/` and are registered in `redux/store.ts`.
  - Prefer Redux for any state shared across features or screens.

## UI Components & Styling

- **Shared UI Components:**
  - Located in `components/ui/` (e.g., `AppButton`, `AppText`, `AppModal`, `Input`, `Snackbar`, `IconButton`, `MainButton`).
  - Enforce the app’s design system and styling conventions.
- **Design System:**
  - Colors, spacing, and typography are defined in `constants/constants.ts`.
  - Use enums and constants for item types and colors.
- **Core Components:**
  - Always use app-specific components (e.g., `AppButton`, `AppText`) instead of raw React Native primitives for consistency.
  - Layout primitives and modals are also provided.
- **Guidelines:**
  - When creating new UI components, place them in `components/ui/` and follow the existing style and API.
  - Use the shared color palette and typography from `constants/`.
  - This ensures visual consistency and maintainability.

## Application Architecture & Data Flow

- **Layering:**
  - Feature-based structure: shared (components, constants, hooks) → features → app (navigation/screens).
  - Unidirectional data flow: UI → hooks/Redux → repositories → Drizzle/SQLite or API → back to UI.
- **Typical Flow:**
  1. User interacts with a UI component (e.g., presses a button).
  2. UI dispatches a Redux action or calls a hook.
  3. The action/hook uses a repository to fetch or mutate data.
  4. Repository interacts with Drizzle/SQLite or an API.
  5. Data is returned, Redux state is updated, and UI re-renders.
- **Patterns:**
  - Clear separation of concerns between UI, state, and data access.
  - Repository pattern ensures all data access is consistent and testable.
  - Feature-based folders allow multiple contributors to work independently.
- **Scalability:**
  - New features, entities, and data sources can be added by following the established patterns.
  - Shared code and design system ensure maintainability and a consistent developer experience.

---

For any new contributions, follow the structure and conventions outlined above to keep the codebase clean, scalable, and easy for all team members to work with.
