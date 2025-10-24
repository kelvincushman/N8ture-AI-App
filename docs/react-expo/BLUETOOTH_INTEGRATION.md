_# Bluetooth Integration Guide for AudioMoth

This document explains how to integrate Bluetooth functionality into the React Expo version of the N8ture AI App to connect with AudioMoth devices.

## 1. Overview

The AudioMoth is a low-cost, open-source acoustic monitoring device used for recording wildlife sounds. Integrating Bluetooth allows the N8ture AI App to connect to nearby AudioMoth devices to configure them, check their status, and potentially retrieve recordings.

## 2. Recommended Library

For Bluetooth Low Energy (BLE) communication, we recommend using the `react-native-ble-plx` library. It is a powerful and widely-used library for BLE in React Native and has good support for Expo.

## 3. Installation

1.  **Install the library:**

    ```bash
    npm install react-native-ble-plx
    ```

2.  **Install the Expo development client:**

    `react-native-ble-plx` requires custom native code, so you'll need to use the Expo development client. 

    ```bash
    npm install expo-dev-client
    ```

3.  **Configure the app.json:**

    Add the `expo-dev-client` plugin to your `app.json` or `app.config.js`:

    ```json
    {
      "expo": {
        "plugins": [
          "expo-dev-client"
        ]
      }
    }
    ```

4.  **Build the development client:**

    ```bash
    eas build --profile development
    ```

## 4. Permissions

Bluetooth permissions are required to scan for and connect to devices. You'll need to add the necessary permissions to your `app.json`:

```json
{
  "expo": {
    "android": {
      "permissions": [
        "android.permission.BLUETOOTH",
        "android.permission.BLUETOOTH_ADMIN",
        "android.permission.ACCESS_FINE_LOCATION"
      ]
    },
    "ios": {
      "infoPlist": {
        "NSBluetoothAlwaysUsageDescription": "Our app uses Bluetooth to connect to AudioMoth devices.",
        "NSBluetoothPeripheralUsageDescription": "Our app uses Bluetooth to connect to AudioMoth devices."
      }
    }
  }
}
```

## 5. Basic Usage

Here is a basic example of how to scan for and connect to a BLE device.

```javascript
import React, { useState, useEffect } from 'react';
import { View, Button, Text, FlatList } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const manager = new BleManager();

const BluetoothScreen = () => {
  const [devices, setDevices] = useState([]);

  const scanForDevices = () => {
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error(error);
        return;
      }

      if (device && device.name) {
        setDevices((prevDevices) => {
          if (!prevDevices.find((d) => d.id === device.id)) {
            return [...prevDevices, device];
          }
          return prevDevices;
        });
      }
    });
  };

  useEffect(() => {
    const subscription = manager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        scanForDevices();
        subscription.remove();
      }
    }, true);
    return () => {
      manager.destroy();
    };
  }, []);

  const connectToDevice = async (device) => {
    try {
      manager.stopDeviceScan();
      const connectedDevice = await manager.connectToDevice(device.id);
      console.log(`Connected to ${connectedDevice.name}`);
      // Now you can discover services and characteristics
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Button title={`Connect to ${item.name}`} onPress={() => connectToDevice(item)} />
        )}
      />
    </View>
  );
};

export default BluetoothScreen;
```

## 6. Connecting to AudioMoth

To connect specifically to an AudioMoth device, you will need to know its BLE service and characteristic UUIDs. You can filter the device scan to look for the AudioMoth's specific service UUID to make the process more efficient.

For more advanced operations, such as reading and writing data to the AudioMoth, you will need to refer to the AudioMoth's official documentation to understand its BLE API.

This guide provides a basic setup for Bluetooth integration. For more detailed information, please refer to the `react-native-ble-plx` documentation.
_
