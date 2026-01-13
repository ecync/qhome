# Frontend Web Application - QHome Automation System

## Overview
The **Frontend Web Application** serves as the user interface for the Smart Home Automation System. Built with **React** and **Vite**, it provides a responsive, modern dashboard for real-time monitoring, control, and data analysis of connected IoT nodes.

## Features
- **📊 Real-time Dashboard**: Live monitoring of sensor data (Temperature, Humidity, Gas, Power, etc.) via Websockets/MQTT integration.
- **🔐 Secure Authentication**: User verification system protecting access to controls and configuration.
- **📈 Analytics**: Interactive charts visualizing historical sensor data using `recharts`.
- **⚙️ Remote Configuration**: Interface to update system settings and node parameters remotely.
- **📱 Responsive Design**: Built with **Tailwind CSS** for a seamless experience across desktop and mobile devices.

## Technology Stack

| Category | Technology | Usage |
| :--- | :--- | :--- |
| **Framework** | [React 18+](https://react.dev/) | Component-based UI architecture |
| **Build Tool** | [Vite](https://vitejs.dev/) | Ultra-fast development server and bundling |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS framework |
| **Routing** | [React Router 6](https://reactrouter.com/) | Client-side navigation |
| **Charts** | [Recharts](https://recharts.org/) | Data visualization |
| **Icons** | [Lucide React](https://lucide.dev/) | Consistent & clean icon set |
| **Connectivity** | [Socket.io-client](https://socket.io/) | Real-time bidirectional communication |

## Application Structure

### Directory Layout
```
frontend/
├── src/
│   ├── components/     # UI Pages & Widgets
│   │   ├── Analytics.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Layout.tsx
│   │   ├── Login.tsx
│   │   └── Settings.tsx
│   ├── hooks/          # Custom React Hooks
│   ├── utils/          # API & Helper functions
│   ├── App.tsx         # Main Routing Logic
│   └── main.tsx        # Entry Point
├── images/             # Documentation screenshots
└── package.json        # Dependencies & Scripts
```

## User Interface

### 1. Dashboard
The central hub displaying live cards for all active nodes.
![Dashboard](images/web-dashboard.png)

### 2. Analytics
Historical data visualization for power consumption and environmental trends.
![Analytics](images/web-analytics.png)

### 3. Settings
Configuration panel for user management and system preferences.
![Settings](images/web-settings.png)

### 4. Login
Secure entry point.
![Login](images/web-login.png)

## System Architecture

### Application Flow
```mermaid
graph TD
    User((User)) -->|Visits| Browse[Browser]
    Browse -->|Checks Session| Auth{Authenticated?}
    
    Auth -- No --> Login[Login Page]
    Login -->|Credentials| API[Backend API]
    API -- Success --> Session[Set Session Storage]
    Session --> Dashboard
    
    Auth -- Yes --> Layout[Main Layout]
    
    Layout -->|route: /| Dashboard[Dashboard View]
    Layout -->|route: /analytics| Analytics[Analytics View]
    Layout -->|route: /settings| Settings[Settings View]
    
    Dashboard -->|Subscribes| Socket[Socket.IO / MQTT]
    Socket -->|Updates| LiveData[Real-time UI Updates]
```

### Component Hierarchy
```mermaid
graph TD
    App --> RouteProvider
    RouteProvider --> Login
    RouteProvider --> ProtectedLayout
    
    ProtectedLayout --> Sidebar
    ProtectedLayout --> Header
    ProtectedLayout --> Outlet
    
    Outlet --> Dashboard
    Dashboard --> SensorCard
    Dashboard --> QuickActions
    
    Outlet --> Analytics
    Analytics --> PowerChart
    Analytics --> EnvChart
    
    Outlet --> Settings
    Settings --> UserConfig
```

## Installation & Setup

### Prerequisites
- **Node.js**: v16 or higher
- **npm**: v7 or higher

### Steps
1.  **Navigate to frontend directory**:
    ```bash
    cd frontend
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Setup**:
    Create a `.env` file (optional if defaults are used) to specify the backend URL.
    ```env
    VITE_API_URL=http://localhost:3000
    ```
4.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Access the app at `http://localhost:5173`.

5.  **Build for Production**:
    ```bash
    npm run build
    ```

## Integration Details
*   **Authentication**: Uses custom Headers `X-USERNAME` and `X-PASSWORD` stored in SessionStorage.
*   **Data Fetching**: The `src/utils/api.ts` module handles HTTP requests with automatic auth header injection.
*   **Real-time Updates**: Socket.io connects to the backend to receive live updates from the MQTT gateway, updating the Dashboard state without page reloads.

---
