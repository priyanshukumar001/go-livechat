import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

const DEVICE_UUID_KEY = '@device_uuid';

export const getDeviceUUID = async (): Promise<string> => {
  try {
    // Try to get existing UUID from storage
    const storedUUID = await AsyncStorage.getItem(DEVICE_UUID_KEY);
    if (storedUUID) {
      return storedUUID;
    }

    // Generate new UUID if none exists
    const uuidString = uuid.v4() as string;

    // Store the UUID
    await AsyncStorage.setItem(DEVICE_UUID_KEY, uuidString);
    return uuidString;
  } catch (error) {
    // Fallback to a random UUID if storage fails
    const fallbackUUID = uuid.v4() as string;
    await AsyncStorage.setItem(DEVICE_UUID_KEY, fallbackUUID);
    return fallbackUUID;
  }
}; 