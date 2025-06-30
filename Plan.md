# Mark Days Application: Implementation Plan

This document outlines the plan for developing the daily activity tracking application, starting with a macOS desktop version and considering the future migration path to a native iOS application.

## Phase 1: macOS Desktop Application (MVP)

The initial goal is to create a functional desktop application for macOS that allows users to mark days on a calendar to track their daily activities, habits, or routines.

### Technology Stack

*   **Framework:** [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/) for building the user interface. React provides a robust and declarative way to build UIs, and TypeScript adds static typing for better code quality and maintainability.
*   **Build Tool:** [Vite](https.vitejs.dev/) for a fast and modern development experience.
*   **Desktop Wrapper:** [Tauri](https://tauri.app/) to package the React web application into a lightweight and performant native macOS application. Tauri is chosen over Electron for its better performance, smaller bundle size, and security focus (as it uses the system's native WebView).
*   **Styling:** We will use standard CSS for styling to keep things simple.
*   **Calendar Component:** We will use the `react-calendar` library to provide a ready-to-use calendar UI.

### Core Features

1.  **Calendar Display:**
    *   Show a monthly calendar view.
    *   Allow navigation between months.
    *   The current day will be highlighted.

2.  **Marking Days:**
    *   Users can click on a day to mark it as "completed" or "done".
    *   Clicking a marked day will unmark it.
    *   Marked days will be visually distinct from unmarked days (e.g., with a colored circle or checkmark).

3.  **Data Persistence:**
    *   The state of marked days will be saved locally on the user's machine.
    *   We will use Tauri's built-in [storage API](https://tauri.app/v1/api/js/store/) which provides a simple key-value store, abstracting away the file system interaction. This is more robust than browser `localStorage`.

### Development Steps

1.  **Project Setup:**
    *   Initialize a new React + TypeScript project using Vite.
    *   Integrate Tauri into the project.
    *   Install necessary dependencies: `react-calendar`.
2.  **Component Development:**
    *   Create a main `CalendarView` component.
    *   Integrate and customize `react-calendar`.
    *   Implement the logic for marking/unmarking days and managing the state.
3.  **Persistence:**
    *   Use the `@tauri-apps/api/store` package to load the marked days when the app starts and save them whenever a day is marked or unmarked.
4.  **Build & Test:**
    *   Build the application for macOS.
    *   Perform manual testing of all features.

## Phase 2: iOS Application Migration Path

The architecture chosen in Phase 1 is conducive to a relatively smooth migration to iOS. The core business logic written in TypeScript can be largely reused. The primary task will be to create a new UI layer for the mobile platform.

### Recommended Approach: React Native

[React Native](https://reactnative.dev/) is the recommended framework for the iOS app.

*   **Why React Native?** It allows us to leverage our existing React knowledge and reuse a significant portion of the application's logic (state management, date handling, etc.). It compiles to a truly native iOS application, providing excellent performance and access to native device features.

### Migration Steps

1.  **Project Setup:**
    *   Create a new React Native project.
    *   Copy over the non-UI business logic files (e.g., state management, utility functions) from the desktop application.

2.  **UI Reconstruction:**
    *   The UI will need to be rebuilt using React Native's components (`<View>`, `<Text>`, `<TouchableOpacity>`) instead of web components (`<div>`, `<span>`, `<button>`).
    *   The `react-calendar` library used in the web app is not directly compatible with React Native. We will need to use a React Native-specific calendar library, like `react-native-calendars`.

3.  **Data Persistence on iOS:**
    *   The data storage mechanism will need to be adapted. Instead of Tauri's store, we will use a mobile-equivalent like [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) for simple local key-value storage.

4.  **Data Sync (Future Enhancement):**
    *   To share data between the macOS and iOS apps, a synchronization mechanism will be required.
    *   **Option A (Simpler): iCloud.** We can use native modules to integrate with iCloud Key-Value Storage or CloudKit. This provides a seamless experience for Apple users.
    *   **Option B (More Flexible): Backend Service.** A simple cloud backend (e.g., using Firebase, Supabase, or a custom Node.js/Python server) could be developed. This would allow for cross-platform data sync (including potential future Android or web versions) and user account management.

### Alternative Approach: Capacitor (WebView)

An alternative is to use [Capacitor](https://capacitorjs.com/) to wrap the existing React web application into an iOS app.

*   **Pros:** Maximum code reuse (~95-100%). The entire React web app runs inside a native WebView.
*   **Cons:** Performance might be slightly lower than a true native app. The UI/UX might feel more like a web page than a native application, which can be a drawback for users expecting a native experience. Accessing native device features can be more complex.

This approach is faster to implement but might compromise on the end-user experience. The React Native path is generally preferred for a higher quality application. 