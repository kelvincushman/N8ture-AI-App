# Agent Quick Reference

This document provides a quick reference for all available agents in the N8ture AI App project.

## Core Agents (4)

| Agent | Purpose | When to Use |
|-------|---------|-------------|
| **git-agent** | Git operations | Commits, branches, pushes, version control |
| **expo-expert** | Expo configuration | Native modules, permissions, builds |
| **react-native-expert** | React Native best practices | Performance, platform-specific code |
| **navigation-expert** | App navigation | Routes, deep linking, navigation structure |

## Backend Agents (2)

| Agent | Purpose | When to Use |
|-------|---------|-------------|
| **firebase-expert** | Firebase services | Cloud Functions, Firestore, Storage |
| **gemini-api-expert** | AI integration | Species identification, image analysis |

## Feature Agents (5)

| Agent | Purpose | When to Use |
|-------|---------|-------------|
| **clerk-auth-expert** | Authentication | Sign-in, sign-up, trial system, OAuth |
| **audio-bird-identification-expert** | Bird song ID | Audio recording, bird identification |
| **bluetooth-audiomoth-expert** | Device connectivity | AudioMoth BLE integration |
| **feature-implementation-agent** | Business logic | Core features, data services, API integration |
| **component-implementation-agent** | UI components | Reusable components, styling |

## UI/UX Agent (1)

| Agent | Purpose | When to Use |
|-------|---------|-------------|
| **ui-ux-implementation-agent** | User interfaces | Screens, design system, accessibility |

## Quality Assurance Agent (1)

| Agent | Purpose | When to Use |
|-------|---------|-------------|
| **testing-implementation-agent** | Testing | Unit tests, integration tests, E2E tests |

## DevOps Agent (1)

| Agent | Purpose | When to Use |
|-------|---------|-------------|
| **devops-agent** | Deployment | EAS builds, CI/CD, app store deployment |

## Planning Agents (2)

| Agent | Purpose | When to Use |
|-------|---------|-------------|
| **prd-agent** | Requirements | Feature specs, user stories, documentation |
| **enhanced-project-manager-agent** | Coordination | Task planning, agent coordination, timeline |

---

## Total: 16 Agents

## Common Workflows

### Implementing a New Feature
1. **prd-agent** - Define requirements
2. **feature-implementation-agent** - Implement business logic
3. **component-implementation-agent** - Build UI components
4. **testing-implementation-agent** - Write tests
5. **git-agent** - Commit and push

### Adding Camera/AI Features
1. **expo-expert** - Configure camera permissions
2. **gemini-api-expert** - Set up AI integration
3. **firebase-expert** - Create Cloud Functions
4. **ui-ux-implementation-agent** - Design UI
5. **testing-implementation-agent** - Test feature

### Setting Up Authentication
1. **clerk-auth-expert** - Implement Clerk
2. **firebase-expert** - Configure backend
3. **ui-ux-implementation-agent** - Create auth screens
4. **navigation-expert** - Add protected routes

### Deployment
1. **devops-agent** - Configure EAS Build
2. **testing-implementation-agent** - Run tests
3. **git-agent** - Tag release
4. **devops-agent** - Deploy to stores

## Agent Expertise Matrix

| Task | Primary Agent | Supporting Agents |
|------|--------------|-------------------|
| Authentication | clerk-auth-expert | firebase-expert, navigation-expert |
| Camera Capture | expo-expert | gemini-api-expert, ui-ux-implementation-agent |
| AI Identification | gemini-api-expert | firebase-expert, testing-implementation-agent |
| UI Screens | ui-ux-implementation-agent | component-implementation-agent, react-native-expert |
| Backend APIs | firebase-expert | gemini-api-expert, testing-implementation-agent |
| Navigation | navigation-expert | react-native-expert, ui-ux-implementation-agent |
| Testing | testing-implementation-agent | All agents |
| Deployment | devops-agent | expo-expert, git-agent |

## Quick Selection Guide

**"I need to..."**
- Add authentication → **clerk-auth-expert**
- Build a screen → **ui-ux-implementation-agent**
- Add camera feature → **expo-expert** + **gemini-api-expert**
- Create backend API → **firebase-expert**
- Add navigation → **navigation-expert**
- Write tests → **testing-implementation-agent**
- Deploy app → **devops-agent**
- Commit code → **git-agent**
- Plan feature → **prd-agent**
- Coordinate team → **enhanced-project-manager-agent**

---

Last Updated: October 24, 2025
