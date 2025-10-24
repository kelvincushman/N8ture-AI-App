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

2. **Navigate to the project directory:**

   ```bash
   cd N8ture-AI-App
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Start the development server:**

   ```bash
   npx expo start
   ```

## Project Structure

The React Expo project will be housed in a new `react-expo-app` directory at the root of the repository. The proposed structure is as follows:

```
/react-expo-app
|-- assets
|-- components
|-- constants
|-- hooks
|-- navigation
|-- screens
|-- services
|-- utils
|-- App.js
|-- babel.config.js
|-- package.json
```

## Development Workflow

This project will follow an agent-based development workflow, utilizing the Claude code and agents. The agents will assist in various stages of development, from generating documentation to implementing features and running tests. For more details, refer to the [Agent-Based Development](./AGENT_DEVELOPMENT.md) guide.

## Integration Guides

For detailed instructions on integrating external services and hardware, please refer to the following documents:

- [Gemini API Integration](./GEMINI_API_INTEGRATION.md)
- [Camera Integration](./CAMERA_INTEGRATION.md)
- [Microphone Integration](./MICROPHONE_INTEGRATION.md)
- [Bluetooth Integration](./BLUETOOTH_INTEGRATION.md)

