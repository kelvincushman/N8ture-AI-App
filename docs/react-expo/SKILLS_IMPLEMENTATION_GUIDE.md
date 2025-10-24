# N8ture AI App - Skills Implementation Guide

## Overview

This document provides a comprehensive guide to implementing all skills (agents) for the N8ture AI React Expo application. Each skill is designed to work with Claude Code and provides specialized expertise for specific aspects of the app development.

## Skills Directory Structure

```
N8ture-AI-App/
├── agents/                                    # Agent definitions (.md format)
│   ├── clerk-auth-expert.md
│   ├── expo-expert.md
│   ├── react-native-expert.md
│   ├── gemini-api-expert.md
│   ├── firebase-expert.md
│   ├── ui-ux-implementation-agent.md
│   ├── navigation-expert.md
│   ├── audio-bird-identification-expert.md
│   └── bluetooth-audiomoth-expert.md
└── skills/                                    # Skill packages (SKILL.md format)
    ├── clerk-auth-expert/
    │   └── SKILL.md
    ├── expo-expert/
    │   └── SKILL.md
    ├── react-native-expert/
    │   └── SKILL.md
    ├── gemini-api-expert/
    │   └── SKILL.md
    ├── firebase-expert/
    │   └── SKILL.md
    ├── ui-ux-implementation/
    │   └── SKILL.md
    ├── navigation-expert/
    │   └── SKILL.md
    ├── audio-bird-identification-expert/
    │   └── SKILL.md
    ├── bat-identification-expert/
    │   └── SKILL.md
    ├── insect-identification-expert/
    │   └── SKILL.md
    └── bluetooth-audiomoth-expert/
        └── SKILL.md
```

## Available Skills

### 1. Clerk Authentication Expert
**Purpose:** Implement secure user authentication using Clerk  
**Key Features:**
- User sign-in/sign-up flows
- Session management
- Protected routes
- JWT token handling
- Social authentication
- User profile management

**When to use:** Implementing authentication, managing user sessions, or integrating with backend services

### 2. Expo Expert
**Purpose:** Configure and manage Expo/EAS Build  
**Key Features:**
- app.json configuration
- Native module setup (camera, audio, BLE)
- Permission management
- EAS Build configuration
- Environment variables
- SDK upgrades

**When to use:** Configuring app settings, adding native modules, or troubleshooting Expo issues

### 3. React Native Expert
**Purpose:** Optimize performance and implement React Native best practices  
**Key Features:**
- Performance optimization
- Memory management
- Platform-specific code
- State management patterns
- Custom hooks
- List optimization

**When to use:** Optimizing app performance, implementing complex components, or handling platform differences

### 4. Gemini API Expert
**Purpose:** Integrate Google Gemini AI for species identification  
**Key Features:**
- Gemini API integration
- Image analysis
- Multimodal prompts
- Response parsing
- Cost optimization
- Error handling

**When to use:** Implementing AI-powered species identification from images

### 5. Firebase Expert
**Purpose:** Implement Firebase backend services  
**Key Features:**
- Cloud Functions
- Firestore database
- Firebase Storage
- Security rules
- Authentication integration
- Error monitoring

**When to use:** Setting up backend infrastructure, database operations, or file storage

### 6. UI/UX Implementation Expert
**Purpose:** Build beautiful, accessible user interfaces  
**Key Features:**
- Component design
- Design system implementation
- Responsive layouts
- Animations
- Accessibility
- N8ture branding

**When to use:** Creating UI components, implementing designs, or ensuring accessibility

### 7. Navigation Expert
**Purpose:** Implement React Navigation patterns  
**Key Features:**
- Navigation structure
- Stack/Tab/Drawer navigation
- Authentication flows
- Deep linking
- Protected routes
- State persistence

**When to use:** Setting up navigation, implementing routing, or handling deep links

### 8. Audio Bird Identification Expert
**Purpose:** Implement bird song identification using BirdNET  
**Key Features:**
- Audio recording with expo-av
- BirdNET API integration
- xeno-canto database integration
- Species matching
- Confidence scoring
- Multi-species detection

**When to use:** Implementing bird song identification from audio recordings

### 9. Bat Identification Expert
**Purpose:** Implement ultrasonic bat echolocation identification  
**Key Features:**
- Ultrasonic audio processing
- BatDetect integration
- Echolocation analysis
- Species classification
- AudioMoth integration

**When to use:** Implementing bat identification from ultrasonic recordings

### 10. Insect Identification Expert
**Purpose:** Implement insect sound identification  
**Key Features:**
- Insect sound analysis
- InsectSet459 dataset integration
- Species classification
- Acoustic pattern recognition
- AudioMoth integration

**When to use:** Implementing insect identification from audio recordings

### 11. Bluetooth AudioMoth Expert
**Purpose:** Connect to AudioMoth devices via BLE  
**Key Features:**
- react-native-ble-plx integration
- Device discovery and pairing
- Data transfer
- Audio file retrieval
- AudioMoth protocol
- Permission management

**When to use:** Implementing AudioMoth connectivity, transferring audio files, or configuring devices

## Using Skills in Claude Code

### Installation

1. **Add skills to your project:**
   ```bash
   # Skills are already in the repository
   cd N8ture-AI-App
   ```

2. **Reference skills in Claude Code:**
   Simply mention the skill name in your conversation:
   ```
   "Use the clerk-auth-expert skill to help me implement sign-in"
   "Use the gemini-api-expert to set up species identification"
   ```

### Best Practices

1. **Use specific skills for specific tasks** - Each skill is optimized for its domain
2. **Combine skills when needed** - Multiple skills can work together
3. **Follow skill guidelines** - Each skill provides best practices and examples
4. **Test incrementally** - Implement and test features one skill at a time

## Development Workflow

### Phase 1: Foundation (Weeks 1-2)
- **Skills:** expo-expert, clerk-auth-expert, navigation-expert
- **Tasks:** Project setup, authentication, navigation structure

### Phase 2: Core Features (Weeks 3-6)
- **Skills:** gemini-api-expert, firebase-expert, ui-ux-implementation
- **Tasks:** Species identification, database, UI components

### Phase 3: Audio Features (Weeks 7-10)
- **Skills:** audio-bird-identification-expert, bat-identification-expert, insect-identification-expert
- **Tasks:** Bird song, bat echolocation, insect sound identification

### Phase 4: Hardware Integration (Weeks 11-12)
- **Skills:** bluetooth-audiomoth-expert
- **Tasks:** AudioMoth connectivity, file transfer

### Phase 5: Optimization (Weeks 13-14)
- **Skills:** react-native-expert, expo-expert
- **Tasks:** Performance optimization, bug fixes

## Integration Points

### Authentication Flow
```
clerk-auth-expert → navigation-expert → firebase-expert
```

### Species Identification Flow
```
ui-ux-implementation → gemini-api-expert → firebase-expert
```

### Audio Identification Flow
```
audio-bird-identification-expert → firebase-expert → ui-ux-implementation
```

### AudioMoth Integration Flow
```
bluetooth-audiomoth-expert → audio-bird-identification-expert → firebase-expert
```

## Testing Strategy

1. **Unit Tests** - Test individual components and services
2. **Integration Tests** - Test skill interactions
3. **E2E Tests** - Test complete user flows
4. **Device Testing** - Test on real iOS and Android devices
5. **AudioMoth Testing** - Test with real AudioMoth hardware

## Troubleshooting

### Common Issues

**Issue:** Skill not loading  
**Solution:** Ensure SKILL.md has proper frontmatter

**Issue:** Permission errors  
**Solution:** Check app.json and platform-specific configurations

**Issue:** Build failures  
**Solution:** Use expo-expert to diagnose and fix

**Issue:** BLE connection issues  
**Solution:** Verify permissions and device compatibility

## Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Clerk Documentation](https://clerk.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [BirdNET](https://birdnet.cornell.edu/)
- [AudioMoth](https://www.openacousticdevices.info/)
- [react-native-ble-plx](https://github.com/dotintent/react-native-ble-plx)

## Next Steps

1. Review all skill documentation in `/agents` and `/skills` directories
2. Set up development environment following expo-expert guidelines
3. Implement authentication using clerk-auth-expert
4. Build core UI using ui-ux-implementation and navigation-expert
5. Integrate AI features using gemini-api-expert
6. Add audio features using audio identification experts
7. Connect AudioMoth using bluetooth-audiomoth-expert
8. Optimize using react-native-expert

All skills are ready to use with Claude Code for efficient, expert-guided development of the N8ture AI App!

