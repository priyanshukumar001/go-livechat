import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ZegoUIKitPrebuiltVideoConference from '@zegocloud/zego-uikit-prebuilt-video-conference-rn';
import KeyCenter from '../utils/KeyCenter';
import { useTheme } from '../theme/ThemeContext';

type RootStackParamList = {
    Home: undefined;
    VideoConference: {
        username: string;
        conferenceId: string;
        uuid: string;
    };
};

type VideoConferenceRouteProp = RouteProp<RootStackParamList, 'VideoConference'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const VideoConferencePage = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<VideoConferenceRouteProp>();
    const { theme } = useTheme();
    const { username, conferenceId, uuid } = route.params;

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ZegoUIKitPrebuiltVideoConference
                appID={Number(KeyCenter.appId)}
                appSign={KeyCenter.appSign}
                userID={uuid}
                userName={username}
                conferenceID={conferenceId}
                config={{
                    onLeave: () => {
                        navigation.navigate('Home');
                    },
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
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default VideoConferencePage;
