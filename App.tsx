import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import RootNavigator from './src/navigators/RootNavigator'
import { ThemeProvider } from './src/theme/ThemeContext'
import { enableScreens } from 'react-native-screens'
import { initializeNotificationService, checkNotificationPermission } from './src/services/NotificationService';
import { AndroidImportance } from '@notifee/react-native'
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import { Alert, Linking } from 'react-native';
import NotificationPrompt from './src/components/NotificationPrompt';

enableScreens();

const linking = {
  prefixes: ['https://golivechat.app', 'golivechat://'],
  config: {
    screens: {
      SignIn: 'signin',
      SignUp: 'signup',
      Home: {
        path: 'home',
        parse: {
          name: (name: string) => name,
          conferenceId: (id: string) => id,
          uuid: (uuid: string) => uuid,
        },
      },
      VideoConference: {
        path: 'conference/:conferenceId/:name/:uuid',
        parse: {
          name: (name: string) => name,
          conferenceId: (id: string) => id,
          uuid: (uuid: string) => uuid,
        },
      },
    },
  },
};

const App = () => {
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      // Initialize notification service
      initializeNotificationService();
      checkInitialNotificationPermission();
    }

    initializeApp();

    // Handle foreground messages
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('Received foreground message:', remoteMessage);
      // Alert.alert('Notification', remoteMessage.notification?.body || '');

      const title = remoteMessage.notification?.title || 'New Message';
      const body = remoteMessage.notification?.body || '';
      // Show notification using Notifee
      if (remoteMessage.notification) {
        await notifee.displayNotification({
          title,
          body,
          android: {
            channelId: 'conference_calls',
            importance: AndroidImportance.HIGH,
            pressAction: {
              id: 'default',
            },
            sound: 'default',
          },
          ios: {
            foregroundPresentationOptions: {
              badge: true,
              sound: true,
              banner: true,
              list: true,
            },
          },
        });
      }
    });

    // Handle notification when app is in background and user taps on it
    messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage.data?.conferenceId) {
        // Navigate to the conference
        Linking.openURL(`golivechat://conference/${remoteMessage.data.conferenceId}/${remoteMessage.data.name}/${remoteMessage.data.uuid}`);
      }
    });

    // Handle notification when app is closed and user taps on it
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage?.data?.conferenceId) {
          // Navigate to the conference
          Linking.openURL(`golivechat://conference/${remoteMessage.data.conferenceId}/${remoteMessage.data.name}/${remoteMessage.data.uuid}`);
        }
      });

    return unsubscribe;
  }, []);

  const checkInitialNotificationPermission = async () => {
    const hasPermission = await checkNotificationPermission();
    if (!hasPermission) {
      setShowNotificationPrompt(true);
    }
  };

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NavigationContainer linking={linking}>
          <RootNavigator />
          <NotificationPrompt
            visible={showNotificationPrompt}
            onClose={() => setShowNotificationPrompt(false)}
          />
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}

export default App;
