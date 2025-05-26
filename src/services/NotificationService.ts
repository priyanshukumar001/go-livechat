// services/notificationService.ts

import messaging from '@react-native-firebase/messaging';
import { Platform, PermissionsAndroid } from 'react-native';
import { api } from '../lib/api';
import auth from '@react-native-firebase/auth';
import notifee, { AndroidImportance } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

let isInitialized = false;

const NOTIFICATION_PERMISSION_KEY = '@notification_permission';

export const checkNotificationPermission = async (): Promise<boolean> => {
    try {
        if (Platform.OS === 'ios') {
            const authStatus = await messaging().requestPermission();
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            await AsyncStorage.setItem(NOTIFICATION_PERMISSION_KEY, enabled.toString());
            return enabled;
        } else if (Platform.OS === 'android' && Platform.Version >= 33) {
            const hasPermission = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
            );
            await AsyncStorage.setItem(NOTIFICATION_PERMISSION_KEY, hasPermission.toString());
            return hasPermission;
        }
        // Default case for older Android versions or other platforms
        return true;
    } catch (error) {
        console.error('Error checking notification permission:', error);
        return false;
    }
};

export const requestNotificationPermission = async (): Promise<boolean> => {
    try {
        if (Platform.OS === 'ios') {
            const authStatus = await messaging().requestPermission();
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            await AsyncStorage.setItem(NOTIFICATION_PERMISSION_KEY, enabled.toString());
            return enabled;
        } else if (Platform.OS === 'android' && Platform.Version >= 33) {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
            );

            const enabled = granted === PermissionsAndroid.RESULTS.GRANTED;
            await AsyncStorage.setItem(NOTIFICATION_PERMISSION_KEY, enabled.toString());
            return enabled;
        }
        // Default case for older Android versions or other platforms
        return true;
    } catch (error) {
        console.error('Error requesting notification permission:', error);
        return false;
    }
};

export const getFCMToken = async (): Promise<string | null> => {
    try {
        const token = await messaging().getToken();
        return token;
    } catch (error) {
        console.error('Error getting FCM token:', error);
        return null;
    }
};

export const onMessageReceived = (callback: (message: any) => void) => {
    return messaging().onMessage(async remoteMessage => {
        callback(remoteMessage);
    });
};

export const onNotificationOpenedApp = (callback: (message: any) => void) => {
    return messaging().onNotificationOpenedApp(remoteMessage => {
        callback(remoteMessage);
    });
};

export const getInitialNotification = async () => {
    try {
        const remoteMessage = await messaging().getInitialNotification();
        return remoteMessage;
    } catch (error) {
        console.error('Error getting initial notification:', error);
        return null;
    }
};

export async function initializeNotificationService() {
  if (isInitialized) return;

  // Check and request permissions
  const hasPermission = await checkNotificationPermission();
  if (!hasPermission) {
    const granted = await requestNotificationPermission();
    if (!granted) {
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
      lights: true,
      lightColor: '#FF231F7C',
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

  // Handle notification when app is in foreground
  messaging().onMessage(async remoteMessage => {
    if (Platform.OS === 'android') {
      await notifee.displayNotification({
        title: remoteMessage.notification?.title || 'New Message',
        body: remoteMessage.notification?.body || '',
        android: {
          channelId: 'conference_calls',
          pressAction: {
            id: 'default',
          },
        },
      });
    }
  });

  isInitialized = true;
}

export async function playNotificationSound() {
  // Optional: implement if needed
  // For example, using `react-native-sound`
}
