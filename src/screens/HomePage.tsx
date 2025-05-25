import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import uuid from 'react-native-uuid';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Card, Input, Text } from '../components';
import { useTheme } from '../theme/ThemeContext';

type RootStackParamList = {
    Home: undefined;
    VideoConference: {
        username: string;
        conferenceId: string;
        uuid: string;
    };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomePage = () => {
    const navigation = useNavigation<NavigationProp>();
    const { theme } = useTheme();
    const [username, setUsername] = useState('');
    const [conferenceId, setConferenceId] = useState('');
    const [error, setError] = useState('');

    const handleStartConference = () => {
        if (!username.trim()) {
            setError('Please enter your username');
            return;
        }
        if (!conferenceId.trim()) {
            setError('Please enter a conference ID');
            return;
        }

        const generatedUuid = uuid.v4();
        navigation.navigate('VideoConference', {
            username: username.trim(),
            conferenceId: conferenceId.trim(),
            uuid: generatedUuid.toString(),
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Card variant="elevated" style={styles.card}>
                <Text variant="h1" style={styles.title}>Welcome to GoLiveChat</Text>
                <Text variant="body" style={styles.subtitle}>
                    Start or join a video conference
                </Text>

                <Input
                    label="Username"
                    placeholder="Enter your username"
                    value={username}
                    onChangeText={(text) => {
                        setUsername(text);
                        setError('');
                    }}
                    error={error && !username.trim() ? error : undefined}
                />

                <Input
                    label="Conference ID"
                    placeholder="Enter conference ID"
                    value={conferenceId}
                    onChangeText={(text) => {
                        setConferenceId(text);
                        setError('');
                    }}
                    error={error && !conferenceId.trim() ? error : undefined}
                />

                <Button
                    variant="primary"
                    size="large"
                    title="Start Conference"
                    onPress={handleStartConference}
                    style={styles.button}
                />
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
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
});

export default HomePage;