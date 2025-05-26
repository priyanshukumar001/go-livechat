// services/notificationService.ts

import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { api } from '../lib/api';
import auth from '@react-native-firebase/auth';
import notifee, { AndroidImportance } from '@notifee/react-native';

let isInitialized = false;

export async function initializeNotificationService() {
  if (isInitialized) return;

  // Request permission for iOS
  if (Platform.OS === 'ios') {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.log('User notification permissions rejected');
      return;
    }
  }

  // Create Android channel
  if (Platform.OS === 'android') {
    await notifee.createChannel({
      id: 'conference_calls',
      name: 'Conference Calls',
      importance: AndroidImportance.HIGH,
      vibration: true,
      sound: 'default',
    });
  }

  // Get FCM token
  const token = await messaging().getToken();
  console.log('FCM Token:', token);

  const currentUser = auth().currentUser;
  if (currentUser) {
    try {
      await api.updateFCMToken(currentUser.uid, token);
    } catch (error) {
      console.error('Error updating FCM token:', error);
    }
  }

  // Listen to token refresh
  messaging().onTokenRefresh(async (newToken) => {
    console.log('FCM Token refreshed:', newToken);
    const refreshedUser = auth().currentUser;
    if (refreshedUser) {
      try {
        await api.updateFCMToken(refreshedUser.uid, newToken);
      } catch (error) {
        console.error('Error updating FCM token:', error);
      }
    }
  });

  isInitialized = true;
}

export async function playNotificationSound() {
  // Optional: implement if needed
  // For example, using `react-native-sound`
}
