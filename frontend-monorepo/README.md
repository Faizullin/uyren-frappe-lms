# Frontend Monorepo Development Setup

This is the monorepo for the frontend applications of the LMS system.

## Prerequisites

- Node.js
- pnpm package manager

## Development Setup

### 1. Install pnpm

If you don't have pnpm installed globally, install it:

```bash
npm install -g pnpm
```

### 2. Install Dependencies

Navigate to the frontend-monorepo directory and install all dependencies:

```bash
cd frontend-monorepo
pnpm install
```

### 3. Environment Configuration

Before running the development server, copy the example environment file to the website folder:

```bash
cp .example.env website/.env.development
```

Edit `website/.env.development` as needed for your local development environment.

### 4. Start Development Server

Run the development server:

```bash
pnpm run dev
```

This will start the development server with hot module replacement enabled.

## Commands

- `pnpm install` - Install all dependencies
- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build

## Project Structure

```
frontend-monorepo/
├── website/          # Main website application
├── packages/         # Shared packages
└── proxier/         # Proxy configuration
```

## Notes

- Make sure to copy `.example.env` to `website/.env.development` before starting development
- The development server typically runs on `http://localhost:8080`
- Hot reload is enabled for all changes

### Import Convention

When working in this monorepo, use the monorepo-specific import paths instead of the standard frappe-ui imports:

```javascript
// ❌ Don't use
import { Button, FormControl } from 'frappe-ui'

// ✅ Use instead
import { Button, FormControl } from '@mono/mono-frappe-ui'
```

This ensures proper module resolution within the monorepo structure.
