import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity, StyleSheet } from 'react-native';
import HomePage from '@/screens/HomePage';
import VideoConference from '@/screens/VideoConference';
import SignInScreen from '@/screens/auth/SignInScreen';
import SignUpScreen from '@/screens/auth/SignUpScreen';
import { useTheme } from '@/theme/ThemeContext';

export type RootStackParamList = {
    SignIn: undefined;
    SignUp: undefined;
    Home: undefined;
    VideoConference: {
        username: string;
        conferenceId: string;
        uuid: string;
    };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Create a reusable LogoutButton component
export const LogoutButton = () => {
    const { theme } = useTheme();

    const handleLogout = async () => {
        try {
            await auth().signOut();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: theme.colors.card }]}
            onPress={handleLogout}
        >
            <Icon
                name="logout"
                size={24}
                color={theme.colors.text}
            />
        </TouchableOpacity>
    );
};

const RootNavigator = () => {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState<any>(null);
    const { theme } = useTheme();
    // Handle user state changes
    function onAuthStateChanged(user: any) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    if (initializing) {
        return null; // Or a loading screen
    }

    // const renderLogoutButton = () => (
    //     <TouchableOpacity onPress={async () => await auth().signOut()}>
    //         <Icon name="logout" size={24} color={theme.colors.text} />
    //     </TouchableOpacity>
    // );

    return (
        <Stack.Navigator
            initialRouteName={user ? "Home" : "SignIn"}
            screenOptions={({ navigation }) => ({
                headerShown: user !== null,
                headerRight: user ? LogoutButton : undefined,
                headerStyle: {
                    backgroundColor: theme.colors.background,
                },
                headerTintColor: theme.colors.text,
            })}
        >
            {!user ? (
                // Auth screens
                <>
                    <Stack.Screen name="SignIn" component={SignInScreen} />
                    <Stack.Screen name="SignUp" component={SignUpScreen} />
                </>
            ) : (
                // App screens
                <>
                    <Stack.Screen name="Home" component={HomePage} />
                    <Stack.Screen options={{ headerShown: false }} name="VideoConference" component={VideoConference} />
                </>
            )}
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    logoutButton: {
        // position: 'absolute',
        // top: 16,
        // right: 16,
        marginRight: 20,
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        padding: 8,
        borderRadius: 20,
        // zIndex: 1000,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});

export default RootNavigator;

