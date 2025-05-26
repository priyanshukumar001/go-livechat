import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
// import { getDeviceUUID } from '@/utils/device';
import { RootStackParamList } from '@/navigators/RootNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Card, Input, Text } from '../../components';
import { useTheme } from '../../theme/ThemeContext';
import { api } from '../../lib/api';



type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

const SignUpScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const { theme } = useTheme();
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        if (!displayName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
            setError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const userCredential = await auth().createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            if (!user) {
                throw new Error('Sign up succeeded, but user data is missing.');
            }

            await user.updateProfile({ displayName: displayName.trim() });

            const userData = await api.registerUser(
                user.uid,
                user.email || '',
                displayName.trim()
            );

            if (!userData) {
                throw new Error('Backend registration failed');
            }

            await AsyncStorage.setItem(`user_${user.uid}`, JSON.stringify(userData));

            navigation.replace('Home');
        } catch (err: any) {
            console.error('Sign up error:', err);
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
            setError(err.message || 'Failed to sign up');
        } finally {
            setLoading(false);
        }
    };


    return (
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <Card variant="elevated" style={styles.card}>
                    <Text variant="h1" style={styles.title}>Create Account</Text>
                    <Text variant="body" style={styles.subtitle}>
                        Sign up to get started
                    </Text>

                    <Input
                        label="Full Name"
                        placeholder="Enter your full name"
                        value={displayName}
                        onChangeText={(text) => {
                            setDisplayName(text);
                            setError('');
                        }}
                        error={error && !displayName.trim() ? error : undefined}
                    />

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

                    <Input
                        label="Confirm Password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChangeText={(text) => {
                            setConfirmPassword(text);
                            setError('');
                        }}
                        secureTextEntry
                        error={error && !confirmPassword.trim() ? error : undefined}
                    />

                    {error && <Text variant="body" style={{ color: theme.colors.error }}>{error}</Text>}
                    <Button
                        variant="primary"
                        size="large"
                        title={loading ? "Creating account..." : "Sign Up"}
                        onPress={handleSignUp}
                        style={styles.button}
                        disabled={loading}
                    />

                    <View style={styles.footer}>
                        <Text variant="body">Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                            <Text variant="body" style={{ color: theme.colors.primary }}>
                                Sign In
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Card>
            </View>
        </KeyboardAvoidingView>
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
    input: {
        marginBottom: 16,
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

export default SignUpScreen; 