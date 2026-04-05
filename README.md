# BharatTruck Driver App

A React Native / Expo mobile application for truck drivers and fleet operators on the BharatTruck logistics platform. The app covers the full driver workflow — browsing available loads, tracking an active trip, logging fuel, and managing driver identity & documents.

## Features

### Trips (Load Board)
- Browse available freight loads with origin, destination, distance, cargo type, weight, and rate
- Online / Offline availability toggle with visual status pill
- Filter loads by vehicle category (All / Heavy / Medium / Light)
- Urgent load badges for time-sensitive shipments
- One-tap accept flow with confirmation dialog

### Active Trip
- Cargo details card (type, weight, shipper, consignee, PO reference)
- Live route summary with freight rate, estimated duration, and departure time
- Step-by-step delivery checkpoint timeline (Loading → Toll → Rest → Delivery)
- Advance checkpoints with timestamp logging
- Photo proof attachment at each checkpoint
- OTP-based delivery confirmation flow
- Shipper contact shortcut
- SOS emergency button

### Fuel Log
- Per-fill fuel entries with date, pump location, liters, amount, and odometer reading
- Associated trip route for each fill
- Running fuel cost tracking

### Driver Profile
- Digital Driver Identification Card (KYC-verified badge, driver ID, fleet operator)
- Trip count, star rating, and total distance stats
- Vehicle information (type, registration, make/model, capacity, fuel type)
- KYC document status tracker (Aadhaar, PAN, Driving Licence, RC Book, Police Clearance)
- Vehicle document expiry tracker (RC, Fitness, Insurance, PUC, Permit)
- Settings: push notifications, location sharing with operator, dark/light mode toggle

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React Native 0.74 + Expo 51 |
| Routing | Expo Router 3.5 (file-based) |
| State | Zustand 4 |
| HTTP | Axios (auth service + booking service) |
| Storage | AsyncStorage (session persistence) |
| Maps | react-native-maps |
| Camera | expo-camera |
| Location | expo-location |
| Fonts | Nunito (via @expo-google-fonts) |
| Language | TypeScript 5 |

## Project Structure

```
bt-driver-app/
├── app/
│   ├── _layout.tsx          # Root layout — font loading, ThemeProvider, splash screen
│   ├── index.tsx            # Auth entry / redirect
│   └── (tabs)/
│       ├── _layout.tsx      # Bottom tab bar (Trips / Active / Fuel / Driver)
│       ├── index.tsx        # Trips / Load board screen
│       ├── active.tsx       # Active trip tracker screen
│       ├── earnings.tsx     # Fuel log screen
│       └── profile.tsx      # Driver profile & documents screen
├── components/
│   ├── ThemeContext.tsx      # Dark/light theme context + useTheme hook
│   ├── LoadCard.tsx         # Reusable load listing card
│   ├── Button.tsx           # Shared button component
│   └── Input.tsx            # Shared input component
├── lib/
│   ├── api.ts               # Axios instances for auth & booking services
│   ├── types.ts             # Shared TypeScript types
│   ├── theme.ts             # Design tokens (colors, fonts, spacing, radius)
│   └── store/
│       └── auth.ts          # Zustand auth store (login, logout, hydrate)
└── .env.example             # Environment variable template
```

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (macOS) or Android Emulator, or the Expo Go app on a physical device

### Installation

```bash
git clone <repo-url>
cd bt-driver-app
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and set the backend service URLs:

```bash
cp .env.example .env.local
```

```env
EXPO_PUBLIC_AUTH_URL=http://localhost:3001
EXPO_PUBLIC_BOOKING_URL=http://localhost:3002
EXPO_PUBLIC_CARGO_LEDGER_URL=http://localhost:3005
```

### Running

```bash
# Start Expo dev server
npm start

# iOS simulator
npm run ios

# Android emulator
npm run android

# Web
npm run build:web
```

## Authentication

Auth is managed by the Zustand store at `lib/store/auth.ts`. On launch, `hydrate()` rehydrates the session from AsyncStorage. `login()` currently uses mock user fixtures (individual driver or fleet operator) — replace the body with a real API call to `authApi` when the backend is ready.

Two user roles are supported:
- `individual_driver` — single driver managing their own vehicle and trips
- `fleet_operator` — company account with visibility over a fleet of drivers

## API Integration

`lib/api.ts` exports two pre-configured Axios instances:

```ts
import { authApi, bookingApi, setAuthToken } from '../lib/api'

// After login, attach the JWT to all subsequent requests
setAuthToken(user.token)
```

All service base URLs are injected at build time via `EXPO_PUBLIC_*` environment variables.

## Design System

Design tokens live in `lib/theme.ts` and are consumed through `ThemeContext`. The app ships with dark mode as the default and supports runtime toggling.

Accent color: **#FF6B2B** (BharatTruck orange)
Font family: **Nunito** (400 / 600 / 700 / 800)
