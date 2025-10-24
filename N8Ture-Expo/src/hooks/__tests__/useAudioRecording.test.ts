/**
 * Tests for useAudioRecording hook
 *
 * Test cases for audio recording functionality
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';
import { Audio } from 'expo-av';
import { useAudioRecording } from '../useAudioRecording';

// Mock expo-av
jest.mock('expo-av', () => ({
  Audio: {
    requestPermissionsAsync: jest.fn(),
    getPermissionsAsync: jest.fn(),
    setAudioModeAsync: jest.fn(),
    Recording: {
      createAsync: jest.fn(),
    },
    Sound: {
      createAsync: jest.fn(),
    },
    AndroidOutputFormat: { MPEG_4: 2 },
    AndroidAudioEncoder: { AAC: 3 },
    IOSOutputFormat: { MPEG4AAC: 'aac' },
    IOSAudioQuality: { HIGH: 96 },
  },
}));

describe('useAudioRecording', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Permission handling', () => {
    it('should check permission on mount', async () => {
      (Audio.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });

      const { result } = renderHook(() => useAudioRecording());

      await waitFor(() => {
        expect(result.current.hasPermission).toBe(true);
      });

      expect(Audio.getPermissionsAsync).toHaveBeenCalled();
    });

    it('should request microphone permission', async () => {
      (Audio.requestPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });

      const { result } = renderHook(() => useAudioRecording());

      let granted = false;
      await act(async () => {
        granted = await result.current.requestPermission();
      });

      expect(granted).toBe(true);
      expect(result.current.hasPermission).toBe(true);
      expect(Audio.requestPermissionsAsync).toHaveBeenCalled();
    });

    it('should handle permission denial gracefully', async () => {
      (Audio.requestPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'denied',
      });

      const { result } = renderHook(() => useAudioRecording());

      let granted = false;
      await act(async () => {
        granted = await result.current.requestPermission();
      });

      expect(granted).toBe(false);
      expect(result.current.hasPermission).toBe(false);
      expect(result.current.error).toBeTruthy();
      expect(result.current.error?.type).toBe('PERMISSION_DENIED');
    });
  });

  describe('Recording lifecycle', () => {
    beforeEach(() => {
      (Audio.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });
      (Audio.setAudioModeAsync as jest.Mock).mockResolvedValue(undefined);
    });

    it('should start recording on button press', async () => {
      const mockRecording = {
        getStatusAsync: jest.fn().mockResolvedValue({
          isRecording: true,
          metering: -60,
        }),
        stopAndUnloadAsync: jest.fn(),
        pauseAsync: jest.fn(),
        startAsync: jest.fn(),
        getURI: jest.fn().mockReturnValue('file://recording.m4a'),
      };

      (Audio.Recording.createAsync as jest.Mock).mockResolvedValue({
        recording: mockRecording,
      });

      const { result } = renderHook(() => useAudioRecording());

      await act(async () => {
        await result.current.startRecording(30);
      });

      expect(result.current.isRecording).toBe(true);
      expect(result.current.recordingState).toBe('recording');
      expect(Audio.Recording.createAsync).toHaveBeenCalled();
    });

    it('should stop recording after max duration', async () => {
      jest.useFakeTimers();

      const mockRecording = {
        getStatusAsync: jest.fn().mockResolvedValue({
          isRecording: true,
          metering: -60,
        }),
        stopAndUnloadAsync: jest.fn(),
        getURI: jest.fn().mockReturnValue('file://recording.m4a'),
      };

      (Audio.Recording.createAsync as jest.Mock).mockResolvedValue({
        recording: mockRecording,
      });

      const { result } = renderHook(() => useAudioRecording());

      await act(async () => {
        await result.current.startRecording(1); // 1 second max
      });

      // Fast-forward time
      await act(async () => {
        jest.advanceTimersByTime(1100);
      });

      await waitFor(() => {
        expect(mockRecording.stopAndUnloadAsync).toHaveBeenCalled();
      });

      jest.useRealTimers();
    });

    it('should pause and resume recording', async () => {
      const mockRecording = {
        getStatusAsync: jest.fn().mockResolvedValue({
          isRecording: true,
          metering: -60,
        }),
        pauseAsync: jest.fn(),
        startAsync: jest.fn(),
        stopAndUnloadAsync: jest.fn(),
        getURI: jest.fn().mockReturnValue('file://recording.m4a'),
      };

      (Audio.Recording.createAsync as jest.Mock).mockResolvedValue({
        recording: mockRecording,
      });

      const { result } = renderHook(() => useAudioRecording());

      // Start recording
      await act(async () => {
        await result.current.startRecording();
      });

      expect(result.current.isRecording).toBe(true);

      // Pause recording
      await act(async () => {
        await result.current.pauseRecording();
      });

      expect(result.current.isPaused).toBe(true);
      expect(mockRecording.pauseAsync).toHaveBeenCalled();

      // Resume recording
      await act(async () => {
        await result.current.resumeRecording();
      });

      expect(result.current.isPaused).toBe(false);
      expect(mockRecording.startAsync).toHaveBeenCalled();
    });

    it('should calculate correct duration', async () => {
      jest.useFakeTimers();

      const mockRecording = {
        getStatusAsync: jest.fn().mockResolvedValue({
          isRecording: true,
          metering: -60,
        }),
        stopAndUnloadAsync: jest.fn(),
        getURI: jest.fn().mockReturnValue('file://recording.m4a'),
      };

      (Audio.Recording.createAsync as jest.Mock).mockResolvedValue({
        recording: mockRecording,
      });

      const { result } = renderHook(() => useAudioRecording());

      await act(async () => {
        await result.current.startRecording();
      });

      // Fast-forward 5 seconds
      await act(async () => {
        jest.advanceTimersByTime(5000);
      });

      expect(result.current.duration).toBeGreaterThan(4.5);
      expect(result.current.duration).toBeLessThan(5.5);

      jest.useRealTimers();
    });
  });

  describe('Playback', () => {
    beforeEach(() => {
      (Audio.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });
    });

    it('should play recording after stopping', async () => {
      const mockSound = {
        playAsync: jest.fn(),
        pauseAsync: jest.fn(),
        stopAsync: jest.fn(),
        setPositionAsync: jest.fn(),
        unloadAsync: jest.fn(),
      };

      (Audio.Sound.createAsync as jest.Mock).mockResolvedValue({
        sound: mockSound,
      });

      const { result } = renderHook(() => useAudioRecording());

      // Simulate having a recording
      await act(async () => {
        // @ts-ignore - setting internal state for test
        result.current.recordingUri = 'file://recording.m4a';
      });

      await act(async () => {
        await result.current.playRecording();
      });

      expect(Audio.Sound.createAsync).toHaveBeenCalled();
      expect(result.current.isPlaying).toBe(true);
    });

    it('should pause playback', async () => {
      const mockSound = {
        pauseAsync: jest.fn(),
        unloadAsync: jest.fn(),
      };

      const { result } = renderHook(() => useAudioRecording());

      // Simulate playing state
      await act(async () => {
        // @ts-ignore - setting internal state for test
        result.current.isPlaying = true;
        // @ts-ignore
        result.current.soundRef.current = mockSound;
      });

      await act(async () => {
        await result.current.pausePlayback();
      });

      expect(mockSound.pauseAsync).toHaveBeenCalled();
    });
  });

  describe('Audio quality', () => {
    it('should allow changing recording quality', () => {
      const { result } = renderHook(() => useAudioRecording());

      expect(result.current.recordingQuality).toBe('high');

      act(() => {
        result.current.setRecordingQuality('medium');
      });

      expect(result.current.recordingQuality).toBe('medium');

      act(() => {
        result.current.setRecordingQuality('low');
      });

      expect(result.current.recordingQuality).toBe('low');
    });
  });

  describe('Audio level metering', () => {
    it('should provide audio level for waveform', async () => {
      const mockRecording = {
        getStatusAsync: jest.fn().mockResolvedValue({
          isRecording: true,
          metering: -60, // dB value
        }),
        stopAndUnloadAsync: jest.fn(),
        getURI: jest.fn().mockReturnValue('file://recording.m4a'),
      };

      (Audio.Recording.createAsync as jest.Mock).mockResolvedValue({
        recording: mockRecording,
      });

      const { result } = renderHook(() => useAudioRecording());

      await act(async () => {
        await result.current.startRecording();
      });

      // Wait for metering update
      await waitFor(() => {
        expect(result.current.audioLevel).toBeGreaterThan(0);
      });

      expect(result.current.meteringData).toBeTruthy();
      expect(result.current.meteringData?.normalizedLevel).toBeGreaterThan(0);
      expect(result.current.meteringData?.normalizedLevel).toBeLessThanOrEqual(100);
    });
  });

  describe('Cleanup', () => {
    it('should cleanup on unmount', async () => {
      const mockRecording = {
        getStatusAsync: jest.fn().mockResolvedValue({
          isRecording: true,
          metering: -60,
        }),
        stopAndUnloadAsync: jest.fn(),
        getURI: jest.fn().mockReturnValue('file://recording.m4a'),
      };

      (Audio.Recording.createAsync as jest.Mock).mockResolvedValue({
        recording: mockRecording,
      });

      const { result, unmount } = renderHook(() => useAudioRecording());

      await act(async () => {
        await result.current.startRecording();
      });

      unmount();

      expect(mockRecording.stopAndUnloadAsync).toHaveBeenCalled();
    });

    it('should delete recording and reset state', async () => {
      const { result } = renderHook(() => useAudioRecording());

      // Simulate having a recording
      await act(async () => {
        // @ts-ignore
        result.current.recordingUri = 'file://recording.m4a';
        // @ts-ignore
        result.current.duration = 30;
      });

      await act(async () => {
        await result.current.deleteRecording();
      });

      expect(result.current.recordingUri).toBeNull();
      expect(result.current.duration).toBe(0);
      expect(result.current.audioLevel).toBe(0);
    });
  });

  describe('Error handling', () => {
    it('should handle recording errors', async () => {
      (Audio.Recording.createAsync as jest.Mock).mockRejectedValue(
        new Error('Recording failed')
      );

      const { result } = renderHook(() => useAudioRecording());

      await act(async () => {
        await result.current.startRecording();
      });

      expect(result.current.error).toBeTruthy();
      expect(result.current.error?.type).toBe('RECORDING_FAILED');
      expect(result.current.isRecording).toBe(false);
    });

    it('should clear error when requested', () => {
      const { result } = renderHook(() => useAudioRecording());

      act(() => {
        // @ts-ignore - setting error for test
        result.current.error = {
          type: 'RECORDING_FAILED',
          message: 'Test error',
        };
      });

      expect(result.current.error).toBeTruthy();

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });
});
