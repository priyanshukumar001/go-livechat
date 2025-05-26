import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, Platform } from 'react-native';
import { Button, Card, Text } from './';
import { useTheme } from '../theme/ThemeContext';
import { checkNotificationPermission, requestNotificationPermission } from '../services/NotificationService';

interface NotificationPromptProps {
    visible: boolean;
    onClose: () => void;
}

const NotificationPrompt: React.FC<NotificationPromptProps> = ({ visible, onClose }) => {
    const { theme } = useTheme();
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);

    useEffect(() => {
        checkPermission();
    }, []);

    const checkPermission = async () => {
        const permission = await checkNotificationPermission();
        setHasPermission(permission);
    };

    const handleEnableNotifications = async () => {
        const granted = await requestNotificationPermission();
        if (granted) {
            setHasPermission(true);
            onClose();
        }
    };

    if (hasPermission) {
        return null;
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <Card variant="elevated" style={styles.card}>
                    <View style={styles.content}>
                        <Text variant="h2" style={styles.title}>
                            Enable Notifications
                        </Text>
                        <Text variant="body" style={styles.message}>
                            Stay connected with your conference calls by enabling notifications.
                            You'll receive alerts for:
                        </Text>
                        <View style={styles.bulletPoints}>
                            <Text variant="body" style={styles.bulletPoint}>• New conference invitations</Text>
                            <Text variant="body" style={styles.bulletPoint}>• Conference reminders</Text>
                            <Text variant="body" style={styles.bulletPoint}>• Important updates</Text>
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button
                                variant="outline"
                                size="large"
                                title="Not Now"
                                onPress={onClose}
                                style={styles.button}
                            />
                            <Button
                                variant="primary"
                                size="large"
                                title="Enable Notifications"
                                onPress={handleEnableNotifications}
                                style={styles.button}
                            />
                        </View>
                    </View>
                </Card>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 16,
    },
    content: {
        padding: 20,
    },
    title: {
        textAlign: 'center',
        marginBottom: 16,
        fontWeight: 'bold',
    },
    message: {
        marginBottom: 16,
        textAlign: 'center',
    },
    bulletPoints: {
        marginBottom: 24,
    },
    bulletPoint: {
        marginBottom: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    button: {
        flex: 1,
    },
});

export default NotificationPrompt; 