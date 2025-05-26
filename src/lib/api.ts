import axios from 'axios';

const API_URL = 'https://golivechat-backend.vercel.app/api';

// Create axios instance with base URL
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

interface User {
    _id: string;
    firebaseUid: string;
    email: string;
    displayName: string;
    fcmToken?: string;
}

interface Conference {
    _id: string;
    conferenceId: string;
    host: User;
    participants: Array<{
        user: User;
        status: 'invited' | 'joined' | 'declined';
    }>;
    status: 'active' | 'ended';
    shareableLink: string;
}

export const api = {
    // User APIs
    async registerUser(firebaseUid: string, email: string, displayName: string, fcmToken?: string) {
        const response = await axiosInstance.post('/users', {
            firebaseUid,
            email,
            displayName,
            fcmToken,
        });
        return response.data;
    },

    async updateFCMToken(firebaseUid: string, fcmToken: string) {
        const response = await axiosInstance.put('/users/fcm-token', {
            firebaseUid,
            fcmToken,
        });
        return response.data;
    },

    async getAllUsers() {
        const response = await axiosInstance.get('/users');
        return response.data;
    },

    async addContact(userId: string, contactId: string) {
        const response = await axiosInstance.post('/users/contacts', {
            userId,
            contactId,
        });
        return response.data;
    },

    async getUserContacts(userId: string) {
        const response = await axiosInstance.get(`/users/${userId}/contacts`);
        return response.data;
    },

    // Conference APIs
    async createConference(hostId: string, participantIds: string[]) {
        const response = await axiosInstance.post('/conferences', {
            hostId,
            participantIds,
        });
        return response.data;
    },

    async getConference(conferenceId: string) {
        const response = await axiosInstance.get(`/conferences/${conferenceId}`);
        return response.data;
    },

    async updateParticipantStatus(conferenceId: string, userId: string, status: 'joined' | 'declined') {
        const response = await axiosInstance.put(`/conferences/${conferenceId}/participants/${userId}`, {
            status,
        });
        return response.data;
    },

    async endConference(conferenceId: string) {
        const response = await axiosInstance.put(`/conferences/${conferenceId}/end`);
        return response.data;
    },

    async getUserConferences(userId: string) {
        const response = await axiosInstance.get(`/conferences/user/${userId}`);
        return response.data;
    },
};