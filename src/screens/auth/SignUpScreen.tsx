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

type SignUpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

export const SignUpScreen = () => {
    const navigation = useNavigation<SignUpScreenNavigationProp>();
    const { theme } = useTheme();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        try {
            setLoading(true);
            const deviceUUID = await getDeviceUUID();
            const userCredential = await auth().createUserWithEmailAndPassword(email, password);
            // console.log(deviceUUID);
            // Update user profile with name
            await userCredential.user.updateProfile({
                photoURL: deviceUUID,
                displayName: name,
            });

            // Navigate to home screen after successful sign up
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.content}>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Sign up to get started</Text>

                <Input
                    placeholder="Full Name"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    style={styles.input}
                />

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

                <Input
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    style={styles.input}
                />

                <Button
                    title="Sign Up"
                    onPress={handleSignUp}
                    loading={loading}
                    style={styles.button}
                />

                <TouchableOpacity
                    onPress={() => navigation.navigate('SignIn')}
                    style={styles.linkContainer}
                >
                    <Text style={styles.linkText}>
                        Already have an account? <Text style={styles.link}>Sign In</Text>
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