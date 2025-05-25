import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import RootNavigator from './src/navigators/RootNavigator'
import { ThemeProvider } from './src/theme/ThemeContext'
import { enableScreens } from 'react-native-screens'

enableScreens()

const App = () => {

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>

  );
};

export default App;
