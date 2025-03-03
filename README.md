## Features

- 📋 View and manage users in a responsive table interface
- ➕ Add new users with form validation
- ✏️ Edit existing user information
- 🗑️ Delete users
- 🔄 Restore original user data
- 🧪 Comprehensive test coverage (unit and E2E)

## Technologies

- React 19
- TypeScript
- Vite for building and development
- Jest for unit testing
- Playwright for end-to-end testing
- Service-oriented architecture
- CSS for styling

## Project Structure

```
├── src/
│   ├── components/       # UI components
│   ├── interfaces/       # TypeScript interfaces
│   ├── services/         # API and business logic 
│   ├── tests/
│   │   ├── e2e/          # End-to-end tests with Playwright
│   │   └── unit/         # Unit tests with Jest
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
├── public/               # Static assets
└── ...config files       # Configuration for TS, Vite, Jest, etc.
```

## Getting Started

### Prerequisites

- Node.js (version 16 or later)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/carlostrcs/prueba-tecnica-frontend-react.git
   cd prueba-tecnica-frontend-react
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Running Tests

### Unit Tests

```bash
npm run test:unit
# or
yarn test:unit
```

### E2E Tests

Make sure the development server is running first.

```bash
npm run test:e2e
# or
yarn test:e2e
```

### All Tests

```bash
npm run test
# or
yarn test
```

## Build

To build the application for production:

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.