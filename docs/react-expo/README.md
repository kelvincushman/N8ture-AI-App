# React Expo Development Guide for N8ture AI App

This document provides a comprehensive guide for developing the React Expo version of the N8ture AI App. It outlines the project structure, development workflow, and integration details for key features.

## Table of Contents

- [Project Overview](#project-overview)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Integration Guides](#integration-guides)
  - [Gemini API Integration](./GEMINI_API_INTEGRATION.md)
  - [Camera Integration](./CAMERA_INTEGRATION.md)
  - [Microphone Integration](./MICROPHONE_INTEGRATION.md)
  - [Bluetooth Integration](./BLUETOOTH_INTEGRATION.md)
- [Agent-Based Development](./AGENT_DEVELOPMENT.md)

## Project Overview

The React Expo version of the N8ture AI App aims to provide a cross-platform solution for web and mobile users, leveraging a single codebase. The app will retain the core functionalities of the original Kotlin-based application, including AI-powered species identification, while introducing new capabilities through the integration of the Gemini API, camera, microphone, and Bluetooth for connecting to external devices.

## Getting Started

This section will guide you through setting up your local development environment for the React Expo project.

### Prerequisites

- Node.js (v18 or later)
- Expo CLI
- Git

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/kelvincushman/N8ture-AI-App.git
   ```

2. **Navigate to the N8Ture-Expo directory:**

   ```bash
   cd N8ture-AI-App/N8Ture-Expo
   ```

3. **Install dependencies:**

   ```bash
   npm install --legacy-peer-deps
   ```

4. **Start the development server:**

   ```bash
   npm start
   ```

## Project Structure

The React Expo project is housed in the `N8Ture-Expo` directory at the root of the repository. The structure is as follows:

```
/N8Ture-Expo
|-- src/
|   |-- components/
|   |-- constants/
|   |-- hooks/
|   |-- navigation/
|   |-- screens/
|   |-- services/
|   |-- types/
|   |-- utils/
|   └-- config/
|-- assets/
|-- functions/
|-- App.tsx
|-- app.json
|-- eas.json
|-- package.json
└-- tsconfig.json
```

## Development Workflow

This project will follow an agent-based development workflow, utilizing the Claude code and agents. The agents will assist in various stages of development, from generating documentation to implementing features and running tests. For more details, refer to the [Agent-Based Development](./AGENT_DEVELOPMENT.md) guide.

## Integration Guides

For detailed instructions on integrating external services and hardware, please refer to the following documents:

- [Gemini API Integration](./GEMINI_API_INTEGRATION.md)
- [Camera Integration](./CAMERA_INTEGRATION.md)
- [Microphone Integration](./MICROPHONE_INTEGRATION.md)
- [Bluetooth Integration](./BLUETOOTH_INTEGRATION.md)

