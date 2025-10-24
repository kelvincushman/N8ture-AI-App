# Claude Code Configuration for N8ture AI App

This directory contains the Claude Code agent and skill configurations for the N8ture AI App project.

## Directory Structure

```
.claude/
├── README.md              # This file
├── config.json            # Project configuration
├── agents/                # Agent definitions
│   ├── git-agent.md
│   ├── expo-expert.md
│   ├── clerk-auth-expert.md
│   ├── firebase-expert.md
│   ├── gemini-api-expert.md
│   ├── react-native-expert.md
│   ├── navigation-expert.md
│   ├── ui-ux-implementation-agent.md
│   ├── component-implementation-agent.md
│   ├── feature-implementation-agent.md
│   ├── testing-implementation-agent.md
│   ├── devops-agent.md
│   ├── audio-bird-identification-expert.md
│   ├── bluetooth-audiomoth-expert.md
│   ├── prd-agent.md
│   └── enhanced-project-manager-agent.md
└── skills/                # Skill definitions
    └── clerk-auth-expert/ # Clerk authentication skill
```

## Available Agents

### Core Development Agents

**git-agent** - Git repository management
- Branch management and version control
- Commit operations with proper messages
- Push/pull operations and conflict resolution
- Enforces project branching strategy

**expo-expert** - Expo configuration and native modules
- Manages app.json and eas.json
- Handles native module setup (camera, audio, Bluetooth)
- Build configuration for development and production
- Permission management

**react-native-expert** - React Native optimization
- Performance optimization
- Component best practices
- Platform-specific implementations
- Bundle size optimization

**navigation-expert** - Navigation structure
- React Navigation setup
- Route type definitions
- Deep linking configuration
- Navigation patterns

### Feature Implementation Agents

**clerk-auth-expert** - Authentication implementation
- Clerk SDK integration
- User management and sessions
- Trial system and premium tracking
- OAuth providers (Google, Apple)

**firebase-expert** - Firebase backend services
- Cloud Functions development
- Firestore database operations
- Firebase Storage integration
- Authentication and security rules

**gemini-api-expert** - AI integration
- Google Gemini Vision API
- Prompt engineering for species identification
- Response parsing and error handling
- Cost optimization strategies

**audio-bird-identification-expert** - Bird song identification
- Audio recording with expo-av
- Bird song analysis
- Audio file processing
- Species identification from sound

**bluetooth-audiomoth-expert** - AudioMoth device connectivity
- BLE integration with react-native-ble-plx
- Device scanning and connection
- AudioMoth protocol implementation
- Data retrieval and configuration

### UI/UX Agents

**ui-ux-implementation-agent** - UI component implementation
- Design system adherence
- Accessibility compliance
- Component styling with N8ture AI branding
- Responsive design

**component-implementation-agent** - Component development
- Reusable component creation
- Component documentation
- Storybook setup (if applicable)
- Component testing

### Quality Assurance Agents

**testing-implementation-agent** - Testing implementation
- Unit test creation with Jest
- Integration testing
- E2E testing with Detox
- Test coverage reporting

**devops-agent** - Deployment and CI/CD
- EAS Build configuration
- App Store deployment
- Google Play deployment
- CI/CD pipeline setup
- Environment management

### Planning Agents

**prd-agent** - Product Requirements Documentation
- Feature specification
- Technical requirements
- User stories and acceptance criteria
- API documentation

**enhanced-project-manager-agent** - Project coordination
- Task breakdown and planning
- Agent coordination
- Progress tracking
- Timeline management

## Available Skills

### clerk-auth-expert
Comprehensive Clerk authentication implementation skill that includes:
- Complete authentication flow setup
- Trial management system
- User profile management
- Protected route implementation

## Agent Usage

Agents are invoked using the Task tool in Claude Code. Each agent has specific expertise and tools available to complete tasks autonomously.

### Agent Selection Guide

**For Authentication:**
- Use clerk-auth-expert for sign-in/sign-up flows
- Handles trial system and premium subscriptions

**For Camera Features:**
- Use expo-expert for camera setup and permissions
- Use gemini-api-expert for AI identification

**For UI Development:**
- Use ui-ux-implementation-agent for screens
- Use component-implementation-agent for reusable components

**For Backend:**
- Use firebase-expert for Cloud Functions
- Use gemini-api-expert for AI integration

**For Git Operations:**
- Use git-agent for commits, branches, pushes

## Project Configuration

The project configuration is stored in `config.json` and includes:

- Project metadata and repository info
- Enabled agents and skills
- Git workflow settings
- Development environment details
- Branding colors and theme
- Documentation locations

## Git Workflow

The project uses a specific git workflow:
- Branch naming: `claude/feature-name-sessionId`
- All branches must end with session ID: `011CUSCnd5FiC6H9kv3qLH9c`
- Commits include Claude co-authorship
- Stop hooks ensure all changes are committed before finishing

## Branding Guidelines

All UI implementations must follow N8ture AI branding:
- Primary: #708C6A (Leaf Khaki)
- Accent: #8FAF87 (Accent Green)
- Dark: #2D3A30 (Forest Charcoal)
- Theme: react-expo-app/src/constants/theme.ts

## Documentation

Main documentation locations:
- Project README: /README.md
- Setup Guide: /react-expo-app/SETUP_GUIDE.md
- API Docs: /docs/
- Integration Guides: /docs/react-expo/

## Maintenance

### Adding New Agents
1. Create agent markdown file in `.claude/agents/`
2. Follow the YAML frontmatter format
3. Add to `config.json` available agents list
4. Document in this README

### Adding New Skills
1. Create skill directory in `.claude/skills/`
2. Add SKILL.md with skill definition
3. Add to `config.json` available skills list
4. Document in this README

## Support

For issues or questions:
- Repository: https://github.com/kelvincushman/N8ture-AI-App
- Issues: https://github.com/kelvincushman/N8ture-AI-App/issues

---

Generated for N8ture AI App
Claude Code Configuration
