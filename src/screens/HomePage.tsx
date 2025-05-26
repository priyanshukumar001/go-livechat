import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Share, TouchableOpacity, useWindowDimensions, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Card, Input, Text, ListItem } from '@/components';
import { useTheme } from '../theme/ThemeContext';
import { api } from '../lib/api';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JoinConferenceModal from '@/components/JoinConferenceModal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
    const { width, height } = useWindowDimensions();
    const { theme } = useTheme();
    const [username, setUsername] = useState('');
    const [conferenceId, setConferenceId] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [contacts, setContacts] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [errorState, setErrorState] = useState('');
    const [showModal, setShowModal] = useState(false);
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

    const handleJoinConference = async () => {
        if (!username.trim()) {
            setErrorState('Please enter your display name');
            return;
        }
        if (!conferenceId.trim()) {
            setErrorState('Please enter a conference ID');
            return;
        }

        setLoading(true);
        try {
            const currentUser = auth().currentUser;
            if (currentUser) {
                navigation.navigate('VideoConference', {
                    username: username.trim(),
                    conferenceId: conferenceId.trim(),
                    uuid: currentUser.uid,
                });
            } else {
                setErrorState('Please sign in to join a conference');
            }
        } catch (error) {
            console.error('Error joining conference:', error);
            setErrorState('Failed to join conference. Please try again.');
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
                <View style={styles.userItemContainer}>
                    <View style={styles.avatarContainer}>
                        <Icon name="account-circle" size={40} color={theme.colors.primary} />
                    </View>
                    <TouchableOpacity
                        onPress={() => toggleUserSelection(item._id)}
                        style={[
                            styles.selectButton,
                            selectedUsers.includes(item._id) && styles.selectedButton
                        ]}
                    >
                        <Icon
                            name={selectedUsers.includes(item._id) ? "check-circle" : "plus-circle-outline"}
                            size={24}
                            color={selectedUsers.includes(item._id) ? theme.colors.primary : theme.colors.text}
                        />
                    </TouchableOpacity>
                </View>
            }
        />
    );

    const renderHeader = () => (
        <>
            <View style={styles.headerContainer}>
                <Icon name="video-plus" size={40} color={theme.colors.primary} style={styles.headerIcon} />
                <Text variant="h1" style={styles.title}>Welcome to GoLiveChat</Text>
                <Text variant="body" style={styles.subtitle}>
                    Start or join a video conference
                </Text>
            </View>

            <View style={styles.inputContainer}>
                <Icon name="account" size={24} color={theme.colors.text} style={styles.inputIcon} />
                <Input
                    label="Your Display Name"
                    placeholder="Enter your display name"
                    value={username}
                    onChangeText={(text) => {
                        setUsername(text);
                        setErrorState('');
                    }}
                    error={errorState && !username.trim() ? errorState : undefined}
                    style={[styles.input, { width: width * 0.7 }]}
                />
            </View>

            <View style={styles.joinSection}>
                <View style={styles.sectionHeader}>
                    <Icon name="video" size={24} color={theme.colors.primary} />
                    <Text variant="h2" style={styles.sectionTitle}>Join Existing Conference</Text>
                </View>
                <View style={styles.inputContainer}>
                    <Icon name="key" size={24} color={theme.colors.text} style={styles.inputIcon} />
                    <Input
                        label="Conference ID"
                        placeholder="Enter conference ID"
                        value={conferenceId}
                        onChangeText={(text) => {
                            setConferenceId(text);
                            setErrorState('');
                        }}
                        error={errorState && !conferenceId.trim() ? errorState : undefined}
                        style={[styles.input, { width: width * 0.7 }]}
                    />
                </View>
                <Button
                    variant="primary"
                    size="large"
                    title={loading ? "Joining..." : "Join Conference"}
                    onPress={handleJoinConference}
                    style={styles.button}
                    disabled={loading}
                />
            </View>

            <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
            </View>

            <View style={styles.createSection}>
                <View style={styles.sectionHeader}>
                    <Icon name="account-group" size={24} color={theme.colors.primary} />
                    <Text variant="h2" style={styles.sectionTitle}>Create New Conference</Text>
                </View>
            </View>
        </>
    );

    const renderFooter = () => (
        <Button
            variant="primary"
            size="large"
            title={loading ? "Starting..." : "Start Conference"}
            onPress={handleStartConference}
            style={styles.button}
            disabled={loading}
        />
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <Card variant="elevated" style={styles.card}>
                    <FlatList
                        data={users}
                        renderItem={renderUserItem}
                        keyExtractor={item => item._id}
                        ListHeaderComponent={renderHeader}
                        ListFooterComponent={renderFooter}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={styles.listContent}
                    />
                </Card>
                {showModal && (
                    <JoinConferenceModal
                        visible={showModal}
                        onClose={() => setShowModal(false)}
                        conferenceId={conferenceId}
                        name={name || ''}
                    />
                )}
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    card: {
        marginTop: 32,
        marginBottom: 32,
        borderRadius: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    listContent: {
        paddingBottom: 16,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    headerIcon: {
        marginBottom: 16,
    },
    title: {
        textAlign: 'center',
        marginBottom: 8,
        fontWeight: 'bold',
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 24,
        opacity: 0.7,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        flexGrow: 1,
        borderColor: '#ababab',
        borderWidth: 2,
        minHeight: 40,
        borderRadius: 10,
    },
    joinSection: {
        marginBottom: 24,
    },
    createSection: {
        marginTop: 24,
        marginBottom: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    sectionTitle: {
        marginLeft: 8,
        fontWeight: '600',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    dividerText: {
        marginHorizontal: 16,
        color: '#666',
        fontSize: 14,
    },
    button: {
        marginTop: 16,
        borderRadius: 12,
        paddingVertical: 12,
    },
    userItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        marginRight: 12,
    },
    selectButton: {
        padding: 8,
        borderRadius: 20,
    },
    selectedButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
});

export default HomePage;