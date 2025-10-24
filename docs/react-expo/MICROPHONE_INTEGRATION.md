# Microphone Integration Guide

This document describes how to integrate microphone functionality into the React Expo version of the N8ture AI App using the `expo-av` library, specifically for recording bird songs and other wildlife sounds for identification.

## 1. Overview

The ability to record audio is essential for identifying birds and other animals by their sounds. The `expo-av` library provides a comprehensive suite of tools for audio recording and playback.

## 2. Installation

Add the `expo-av` library to your project:

```bash
npm install expo-av
```

## 3. Permissions

Requesting microphone permissions is similar to requesting camera permissions.

```javascript
import { Audio } from 'expo-av';
import { useState, useEffect } from 'react';

const [hasPermission, setHasPermission] = useState(null);

useEffect(() => {
  (async () => {
    const { status } = await Audio.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  })();
}, []);

if (hasPermission === null) {
  return <View />;
}
if (hasPermission === false) {
  return <Text>No access to microphone</Text>;
}
```

## 4. Recording Audio

Here is a basic example of how to record and play back audio.

```javascript
import React, { useState } from 'react';
import { View, Button } from 'react-native';
import { Audio } from 'expo-av';

const AudioScreen = () => {
  const [recording, setRecording] = useState();
  const [sound, setSound] = useState();

  async function startRecording() {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      }); 
      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(
         Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI(); 
    console.log('Recording stopped and stored at', uri);
    
    // You can now upload the audio file from the URI to your backend for processing
  }

  return (
    <View>
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
    </View>
  );
}

export default AudioScreen;
```

## 5. Integration with AI Identification

After stopping the recording, you get a URI for the audio file. This file can then be uploaded to your backend for processing and identification using the Gemini API or a specialized audio analysis model.

This guide provides a basic framework for audio recording. For more advanced features like audio playback, metering, and format conversion, please refer to the official `expo-av` documentation.

