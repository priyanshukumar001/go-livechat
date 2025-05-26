import React, { useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Share } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ZegoUIKitPrebuiltVideoConference from '@zegocloud/zego-uikit-prebuilt-video-conference-rn';
import KeyCenter from '../utils/KeyCenter';
import { useTheme } from '../theme/ThemeContext';
import { api } from '../lib/api';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type RootStackParamList = {
    Home: undefined;
    VideoConference: {
        username: string;
        conferenceId: string;
        uuid: string;
    };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'VideoConference'>;
type VideoConferenceRouteProp = RouteProp<RootStackParamList, 'VideoConference'>;

const VideoConferencePage = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<VideoConferenceRouteProp>();
    const { theme } = useTheme();
    const { username, conferenceId, uuid } = route.params;

    // Generate a unique user ID by combining the Firebase UID with a timestamp
    const uniqueUserId = `${uuid}_${Date.now()}`;

    useEffect(() => {
        const updateParticipantStatus = async () => {
            try {
                const currentUser = auth().currentUser;
                if (currentUser) {
                    const userData = await AsyncStorage.getItem(`user_${currentUser.uid}`);
                    if (userData) {
                        const { _id } = JSON.parse(userData);
                        await api.updateParticipantStatus(conferenceId, _id, 'joined');
                    }
                }
            } catch (error) {
                console.error('Error updating participant status:', error);
            }
        };

        updateParticipantStatus();

        return () => {
            // Update status when leaving
            const updateStatus = async () => {
                try {
                    const currentUser = auth().currentUser;
                    if (currentUser) {
                        const userData = await AsyncStorage.getItem(`user_${currentUser.uid}`);
                        if (userData) {
                            const { _id } = JSON.parse(userData);
                            await api.updateParticipantStatus(conferenceId, _id, 'declined');
                        }
                    }
                } catch (error) {
                    console.error('Error updating participant status:', error);
                }
            };
            updateStatus();
        };
    }, [conferenceId]);

    const handleLeave = async () => {
        try {
            const currentUser = auth().currentUser;
            if (currentUser) {
                const userData = await AsyncStorage.getItem(`user_${currentUser.uid}`);
                if (userData) {
                    const { _id } = JSON.parse(userData);
                    await api.updateParticipantStatus(conferenceId, _id, 'declined');
                }
            }
        } catch (error) {
            console.error('Error updating participant status:', error);
        }
        navigation.replace('Home');
    };

    const handleShare = async () => {
        try {
            const shareMessage = `Join my conference on GoLiveChat! Conference ID: ${conferenceId}`;
            await Share.share({
                message: shareMessage,
            });
        } catch (error) {
            console.error('Error sharing conference:', error);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <TouchableOpacity
                    style={[styles.shareButton, { backgroundColor: theme.colors.primary }]}
                    onPress={handleShare}
                >
                    <Icon name="share-variant" size={24} color="white" />
                </TouchableOpacity>
                <ZegoUIKitPrebuiltVideoConference
                    appID={Number(KeyCenter.appId)}
                    appSign={KeyCenter.appSign}
                    userID={uniqueUserId}
                    userName={username}
                    conferenceID={conferenceId}
                    config={{
                        onLeave: handleLeave,
                        showPreJoinView: true,
                        showUserList: true,
                        showChat: true,
                        showScreenSharing: true,
                        showCamera: true,
                        showMicrophone: true,
                        showLeavingView: true,
                        showTopMenuBar: true,
                        showBottomMenuBar: true,
                        showTimer: true,
                        showUserCount: true,
                        showUserName: true,
                        showUserAvatar: true,
                        showUserStatus: true,
                        showUserRole: true,
                        showUserDeviceStatus: true,
                        showUserNetworkStatus: true,
                        showUserAudioLevel: true,
                        showUserVideoLevel: true,
                        showUserScreenSharing: true,
                        showUserChat: true,
                        showUserLeave: true,
                        showUserKick: true,
                        showUserMute: true,
                        showUserUnmute: true,
                        showUserCameraOn: true,
                        showUserCameraOff: true,
                        showUserScreenSharingOn: true,
                        showUserScreenSharingOff: true,
                        showUserChatOn: true,
                        showUserChatOff: true,
                        showUserLeaveOn: true,
                        showUserLeaveOff: true,
                        showUserKickOn: true,
                        showUserKickOff: true,
                        showUserMuteOn: true,
                        showUserMuteOff: true,
                        showUserUnmuteOn: true,
                        showUserUnmuteOff: true,
                    }}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    shareButton: {
        position: 'absolute',
        top: '50%',
        right: 16,
        zIndex: 1000,
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});

export default VideoConferencePage;
