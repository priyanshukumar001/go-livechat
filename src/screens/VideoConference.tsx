import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ZegoUIKitPrebuiltVideoConference from '@zegocloud/zego-uikit-prebuilt-video-conference-rn';
import KeyCenter from '../utils/KeyCenter';
import { useTheme } from '../theme/ThemeContext';
import { api } from '../lib/api';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

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

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
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
                        showUserCameraOnOn: true,
                        showUserCameraOnOff: true,
                        showUserCameraOffOn: true,
                        showUserCameraOffOff: true,
                        showUserScreenSharingOnOn: true,
                        showUserScreenSharingOnOff: true,
                        showUserScreenSharingOffOn: true,
                        showUserScreenSharingOffOff: true,
                        showUserChatOnOn: true,
                        showUserChatOnOff: true,
                        showUserChatOffOn: true,
                        showUserChatOffOff: true,
                        showUserLeaveOnOn: true,
                        showUserLeaveOnOff: true,
                        showUserLeaveOffOn: true,
                        showUserLeaveOffOff: true,
                        showUserKickOnOn: true,
                        showUserKickOnOff: true,
                        showUserKickOffOn: true,
                        showUserKickOffOff: true,
                        showUserMuteOnOn: true,
                        showUserMuteOnOff: true,
                        showUserMuteOffOn: true,
                        showUserMuteOffOff: true,
                        showUserUnmuteOnOn: true,
                        showUserUnmuteOnOff: true,
                        showUserUnmuteOffOn: true,
                        showUserUnmuteOffOff: true,
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
});

export default VideoConferencePage;
