import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import { Text } from '@/components/Text';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useTheme } from '@/theme/ThemeContext';
import { getDeviceUUID } from '@/utils/device';
import { RootStackParamList } from '@/navigators/RootNavigator';

type SignInScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

export const SignInScreen = () => {
    const navigation = useNavigation<SignInScreenNavigationProp>();
    const { theme } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignIn = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            const deviceUUID = await getDeviceUUID();
            const userCredential = await auth().signInWithEmailAndPassword(email, password);

            // Update user profile with device UUID
            await userCredential.user.updateProfile({
                displayName: deviceUUID
            });

            // Navigate to home screen after successful sign in
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });
        } catch (error: any) {
            switch (error.code) {
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
                    Alert.alert('Authentication error', error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.content}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to continue</Text>

                <Input
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                />

                <Input
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                />

                <Button
                    title="Sign In"
                    onPress={handleSignIn}
                    loading={loading}
                    style={styles.button}
                />

                <TouchableOpacity
                    onPress={() => navigation.navigate('SignUp')}
                    style={styles.linkContainer}
                >
                    <Text style={styles.linkText}>
                        Don't have an account? <Text style={styles.link}>Sign Up</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 32,
        textAlign: 'center',
        opacity: 0.7,
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 8,
    },
    linkContainer: {
        marginTop: 24,
        alignItems: 'center',
    },
    linkText: {
        fontSize: 14,
    },
    link: {
        color: '#007AFF',
        fontWeight: '600',
    },
}); 