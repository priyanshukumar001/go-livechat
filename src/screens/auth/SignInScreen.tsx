import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
// import { getDeviceUUID } from '@/utils/device';
import { RootStackParamList } from '@/navigators/RootNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Card, Input, Text } from '../../components';
import { useTheme } from '../../theme/ThemeContext';
import { api } from '../../lib/api';
import { SafeAreaView } from 'react-native-safe-area-context';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

const SignInScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const { theme } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignIn = async () => {
        if (!email.trim() || !password.trim()) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const userCredential = await auth().signInWithEmailAndPassword(email, password);
            const user = userCredential.user;

            if (!user) {
                throw new Error('Authentication succeeded, but user data is missing.');
            }

            const userData = await api.registerUser(
                user.uid,
                user.email || '',
                user.displayName || user.email?.split('@')[0] || 'User'
            );

            if (!userData) {
                throw new Error('Backend registration failed');
            }

            await AsyncStorage.setItem(`user_${user.uid}`, JSON.stringify(userData));

            navigation.replace('Home');
        } catch (err: any) {
            switch (err.code) {
                case 'auth/invalid-credential':
                    Alert.alert('Invalid email or password');
                    break;
                case 'auth/email-already-in-use':
                    Alert.alert('Email already in use');
                    break;
                case 'auth/invalid-email':
                    Alert.alert('Invalid email address');
                    break;
                case 'auth/weak-password':
                    Alert.alert('Password is too weak');
                    break;
                case 'auth/user-not-found':
                    Alert.alert('No account found');
                    break;
                case 'auth/wrong-password':
                    Alert.alert('Incorrect password');
                    break;
                case 'auth/too-many-requests':
                    Alert.alert('Too many failed attempts. Try again later.');
                    break;
                default:
                    Alert.alert('Authentication error', err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <Card variant="elevated" style={styles.card}>
                    <Text variant="h1" style={styles.title}>Welcome Back</Text>
                    <Text variant="body" style={styles.subtitle}>
                        Sign in to continue
                    </Text>

                    <Input
                        label="Email"
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            setError('');
                        }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        error={error && !email.trim() ? error : undefined}
                    />

                    <Input
                        label="Password"
                        placeholder="Enter your password"
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            setError('');
                        }}
                        secureTextEntry
                        error={error && !password.trim() ? error : undefined}
                    />

                    <Button
                        variant="primary"
                        size="large"
                        title={loading ? "Signing in..." : "Sign In"}
                        onPress={handleSignIn}
                        style={styles.button}
                        disabled={loading}
                    />

                    <View style={styles.footer}>
                        <Text variant="body">Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                            <Text variant="body" style={{ color: theme.colors.primary }}>
                                Sign Up
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Card>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    card: {
        marginTop: 32,
    },
    title: {
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 24,
        opacity: 0.7,
    },
    button: {
        marginTop: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
});

export default SignInScreen;