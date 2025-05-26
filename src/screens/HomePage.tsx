import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Share } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Card, Input, Text, ListItem } from '@/components';
import { useTheme } from '../theme/ThemeContext';
import { api } from '../lib/api';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JoinConferenceModal from '@/components/JoinConferenceModal';

type RootStackParamList = {
    Home: undefined;
    VideoConference: {
        username: string;
        conferenceId: string;
        uuid: string;
    };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface User {
    _id: string;
    displayName: string;
    email: string;
}

const HomePage = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute();

    const { theme } = useTheme();
    const [username, setUsername] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [contacts, setContacts] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [errorState, setErrorState] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [conferenceId, setConferenceId] = useState('');
    const [name, setName] = useState('');

    useEffect(() => {
        loadUsers();
        loadContacts();
    }, []);

    useEffect(() => {
        try {
            const { name, conferenceId, uuid } = route?.params as { name: string, conferenceId: string, uuid: string };
            if (conferenceId) {
                setShowModal(true);
                setConferenceId(conferenceId);
                setName(name);
            }
        } catch (error) {
            console.log('Error parsing route params:', error);
        }
    }, [route.params]);

    const loadUsers = async () => {
        try {
            const allUsers = await api.getAllUsers();
            setUsers(allUsers);
        } catch (error) {
            console.error('Error loading users:', error);
        }
    };

    const loadContacts = async () => {
        try {
            const currentUser = auth().currentUser;
            if (currentUser) {
                const userData = await AsyncStorage.getItem(`user_${currentUser.uid}`);
                if (userData) {
                    const { _id } = JSON.parse(userData);
                    const userContacts = await api.getUserContacts(_id);
                    setContacts(userContacts);
                }
            }
        } catch (error) {
            console.error('Error loading contacts:', error);
        }
    };

    // const handleAddContact = async (userId: string) => {
    //     try {
    //         const currentUser = auth().currentUser;
    //         if (currentUser) {
    //             const userData = await AsyncStorage.getItem(`user_${currentUser.uid}`);
    //             if (userData) {
    //                 const { _id } = JSON.parse(userData);
    //                 await api.addContact(_id, userId);
    //                 loadContacts();
    //             }
    //         }
    //     } catch (error) {
    //         console.error('Error adding contact:', error);
    //     }
    // };

    const handleStartConference = async () => {
        if (!username.trim()) {
            setErrorState('Please enter your username');
            return;
        }

        setLoading(true);
        try {
            const currentUser = auth().currentUser;
            if (currentUser) {
                const userData = await AsyncStorage.getItem(`user_${currentUser.uid}`);
                if (userData) {
                    const { _id } = JSON.parse(userData);
                    console.log('Creating conference with:', { hostId: _id, participantIds: selectedUsers });
                    const conference = await api.createConference(_id, selectedUsers);
                    console.log('Conference created successfully:', conference);


                    // Share the conference link
                    // const url = `https://golivechat.app/home?username=${encodeURIComponent(username)}&conferenceId=${encodeURIComponent(conference.conferenceId)}&uuid=${encodeURIComponent(currentUser.uid)}`;
                    await Share.share({
                        // message: `Join my conference: ${url}`,
                        message: `Join my conference, open app and enter this conference id: ${conference.conferenceId}`,
                    });

                    navigation.navigate('VideoConference', {
                        username: username.trim(),
                        conferenceId: conference.conferenceId,
                        uuid: currentUser.uid,
                    });
                } else {
                    console.error('No user data found in AsyncStorage');
                    setErrorState('User data not found. Please try logging in again.');
                }
            }
        } catch (error: any) {
            console.error('Error starting conference:', error);
            if (error.response) {
                console.error('Server response:', error.response.data);
            }
            setErrorState('Failed to start conference. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const toggleUserSelection = (userId: string) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const renderUserItem = ({ item }: { item: User }) => (
        <ListItem
            title={item.displayName}
            subtitle={item.email}
            rightElement={
                <Button
                    variant="secondary"
                    size="small"
                    title={selectedUsers.includes(item._id) ? "Selected" : "Select"}
                    onPress={() => toggleUserSelection(item._id)}
                />
            }
        />
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Card variant="elevated" style={styles.card}>
                <Text variant="h1" style={styles.title}>Welcome to GoLiveChat</Text>
                <Text variant="body" style={styles.subtitle}>
                    Start a video conference with your contacts (optional)
                </Text>

                <Input
                    label="Your Display Name"
                    placeholder="Enter your display name"
                    value={username}
                    onChangeText={(text) => {
                        setUsername(text);
                        setErrorState('');
                    }}
                    error={errorState && !username.trim() ? errorState : undefined}
                />

                <Text variant="h2" style={styles.sectionTitle}>Select Participants (Optional)</Text>
                <FlatList
                    data={users}
                    renderItem={renderUserItem}
                    keyExtractor={item => item._id}
                    style={styles.userList}
                />

                <Button
                    variant="primary"
                    size="large"
                    title={loading ? "Starting..." : "Start Conference"}
                    onPress={handleStartConference}
                    style={styles.button}
                    disabled={loading}
                />
            </Card>
            {
                showModal && (
                    <JoinConferenceModal
                        visible={showModal}
                        onClose={() => setShowModal(false)}
                        conferenceId={conferenceId}
                        name={name || ''}
                    />
                )
            }
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
    sectionTitle: {
        marginTop: 16,
        marginBottom: 8,
    },
    userList: {
        maxHeight: 300,
        marginBottom: 16,
    },
    button: {
        marginTop: 16,
    },
});

export default HomePage;