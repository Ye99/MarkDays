# Mark Days - Daily Activity Tracker

A simple and lightweight desktop application for macOS to help you track your daily activities and habits.

![Mark Days Screenshot](screenshot.png)

## Features

*   **Simple Calendar View**: Displays a clear monthly calendar.
*   **Easy Marking**: Simply click on a day to mark it as completed. Click again to unmark it.
*   **Data Persistence**: Your marked days are saved automatically on your computer, so your data is safe between sessions.
*   **Flexible Usage**: Perfect for tracking medication, exercise, habits, or any daily activity you want to monitor.

## Data Storage

The application stores your tracking data locally on your computer in a JSON file. The data is automatically saved when you mark or unmark days.

**Storage Location (macOS):**
```
~/Library/Application Support/com.markdays.tracker/markdays.json
```

You can view your stored data by navigating to this location in Finder (press `Cmd + Shift + G` and paste the path) or by using Terminal:
```bash
cat ~/Library/Application\ Support/com.markdays.tracker/markdays.json
```

The file contains your marked days in JSON format, ensuring your data persists between app sessions.

## Technology Stack

*   **Frontend**: [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Desktop Framework**: [Tauri](https://tauri.app/) (v2)

## Project Setup

### Prerequisites

Before you begin, ensure you have the necessary system dependencies installed for Tauri. See the [official Tauri prerequisites guide](https://tauri.app/v2/guides/getting-started/prerequisites) for detailed macOS instructions.

You will need:
*   [Node.js](https://nodejs.org/) (which includes `npm`)
*   [Rust](https://www.rust-lang.org/tools/install)

### Installation

1.  **Clone the repository and navigate to the project directory:**

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Running the Application

To run the application in development mode, execute the following command. This will start the Vite development server and launch the Tauri window. The app will automatically reload when you make changes to the source code.

```bash
npm run tauri dev
```

## Building the Application

To create a standalone, distributable version of the application, run:

```bash
npm run tauri build
```

This will compile the frontend, build the Rust backend, and bundle everything into a native macOS application.

### Build Output

The build process creates the following outputs:

**macOS App Bundle:**
```
src-tauri/target/release/bundle/macos/markdays.app/
```

**DMG Installer:**
```
src-tauri/target/release/bundle/dmg/markdays_0.1.0_aarch64.dmg
```

### Running the Built Application

You can run the built application in several ways:

**Option 1: Run the App Bundle**
```bash
open src-tauri/target/release/bundle/macos/markdays.app
```

**Option 2: Install from DMG**
1. Double-click the DMG file: `src-tauri/target/release/bundle/dmg/markdays_0.1.0_aarch64.dmg`
2. Drag the Mark Days app to your Applications folder
3. Launch from Applications or Spotlight

**Option 3: Run from Terminal**
```bash
./src-tauri/target/release/bundle/macos/markdays.app/Contents/MacOS/markdays
```

### Distribution

- **For personal use**: Use the `.app` bundle directly
- **For sharing**: Use the `.dmg` file for a standard macOS installation experience 