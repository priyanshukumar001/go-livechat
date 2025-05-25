declare module '@zegocloud/zego-uikit-prebuilt-video-conference-rn' {
    import { Component } from 'react';

    interface ZegoUIKitPrebuiltVideoConferenceProps {
        appID: number;
        appSign: string;
        userID: string;
        userName: string;
        conferenceID: string;
        config?: {
            onLeave?: () => void;
            [key: string]: any;
        };
    }

    export default class ZegoUIKitPrebuiltVideoConference extends Component<ZegoUIKitPrebuiltVideoConferenceProps> {}
} 