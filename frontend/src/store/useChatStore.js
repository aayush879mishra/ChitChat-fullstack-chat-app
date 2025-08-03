import {create } from 'zustand';
import { axiosInstance } from '../libs/axios';
import toast from 'react-hot-toast';
import { use } from 'react';
import { useAuthStore } from './useAuthStore';

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,


    getUsers: async () => {
        set({isUsersLoading: true});
        try {
            const response = await axiosInstance.get('/messages/users');
            set({users: response.data.users });
            console.log("response.data from API:", response.data);

        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
        } finally {
            set({isUsersLoading: false});
        }
    },

    getMessages: async (userId) => {
        set({isMessagesLoading: true});
        try {
            const response = await axiosInstance.get(`/messages/${userId}`);
            set({messages: response.data});
        } catch (error) {
            console.error('Error fetching messages:', error.messages);
            toast.error('Failed to load messages');
        } finally {
            set({isMessagesLoading: false});
        }
    },

    sendMessages: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            const response = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            console.log("Fetched messages response:", response.data);
            set({messages: [...messages, response.data]});
            
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error(error.response?.data?.message);
        }
    },

    subscribeToMessages: () => {
        const {selectedUser} = get()
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on( 'newMessage', (newMessage) => {
            if (newMessage.senderId !== selectedUser._id && newMessage.receiverId !== selectedUser._id) return;
             set ({
                messages: [...get().messages, newMessage]
            })
        })
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off('newMessage');
    },

    // Set the selected user
    setSelectedUser: (selectedUser) => {
        set({selectedUser});
    },
}))