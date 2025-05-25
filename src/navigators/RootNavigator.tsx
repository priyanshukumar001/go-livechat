import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from '../screens/HomePage';
import VideoConference from '@/screens/VideoConference';
import { SafeAreaView } from 'react-native-safe-area-context';

export type RootStackParamList = {
    Home: undefined;
    VideoConference: {
        username: string;
        conferenceId: string;
        uuid: string;
    };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="Home" component={HomePage} />
                <Stack.Screen name="VideoConference" component={VideoConference} />
            </Stack.Navigator>
        </SafeAreaView>
    );
};

export default RootNavigator;

