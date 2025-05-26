import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Modal,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { api } from '../lib/api';
import auth from '@react-native-firebase/auth';

type RootStackParamList = {
    ConferenceRoom: {
        conferenceId: string;
        displayName: string;
    };
};

type NavigationProps = NavigationProp<RootStackParamList>;

interface JoinConferenceModalProps {
    visible: boolean;
    onClose: () => void;
    conferenceId: string;
    name: string;
}

const JoinConferenceModal: React.FC<JoinConferenceModalProps> = ({
    visible,
    onClose,
    conferenceId,
    name,
}) => {
    const [displayName, setDisplayName] = useState(name);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigation = useNavigation<NavigationProps>();

    const handleJoin = async () => {
        if (!displayName.trim()) {
            setError('Please enter your name');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const currentUser = auth().currentUser;
            if (!currentUser) {
                throw new Error('User not authenticated');
            }

            // Update participant status to 'joined'
            await api.updateParticipantStatus(conferenceId, currentUser.uid, 'joined');

            // Navigate to conference room
            navigation.navigate('ConferenceRoom', {
                conferenceId,
                displayName: displayName.trim(),
            });

            onClose();
        } catch (err) {
            console.error('Error joining conference:', err);
            setError('Failed to join conference. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Join Conference</Text>
                    <Text style={styles.subtitle}>
                        Please enter your name to join the conference
                    </Text>

                    <TextInput
                        style={[styles.input, error && styles.inputError]}
                        placeholder="Your Name"
                        value={displayName}
                        onChangeText={(text) => {
                            setDisplayName(text);
                            setError(null);
                        }}
                        autoCapitalize="words"
                        maxLength={50}
                        editable={!isLoading}
                    />

                    {error && <Text style={styles.errorText}>{error}</Text>}

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                            disabled={isLoading}
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.button,
                                styles.joinButton,
                                (!displayName.trim() || isLoading) && styles.disabledButton,
                            ]}
                            onPress={handleJoin}
                            disabled={!displayName.trim() || isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.buttonText}>Join</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        width: '90%',
        maxWidth: 400,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 10,
    },
    inputError: {
        borderColor: '#f44336',
    },
    errorText: {
        color: '#f44336',
        fontSize: 14,
        marginBottom: 10,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    button: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 50,
    },
    cancelButton: {
        backgroundColor: '#f44336',
    },
    joinButton: {
        backgroundColor: '#4CAF50',
    },
    disabledButton: {
        backgroundColor: '#cccccc',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default JoinConferenceModal; 