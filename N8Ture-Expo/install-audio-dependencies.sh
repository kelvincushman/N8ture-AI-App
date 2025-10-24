#!/bin/bash

# Install Audio Recording Dependencies
# Phase 4 - N8ture AI App

echo "Installing audio recording dependencies..."
echo ""

# Install expo-file-system
echo "1. Installing expo-file-system..."
npm install expo-file-system

echo ""
echo "2. Installing testing dependencies..."
npm install --save-dev @testing-library/react-native @testing-library/jest-native jest

echo ""
echo "✅ Dependencies installed successfully!"
echo ""
echo "Next steps:"
echo "1. Run 'npm start' to start the development server"
echo "2. Run 'npm test' to run the test suite"
echo "3. See AUDIO_RECORDING_GUIDE.md for usage documentation"
echo ""
