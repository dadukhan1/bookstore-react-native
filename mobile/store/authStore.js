import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from "expo-constants";
import { PCIPAddress } from '@env';


export const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isLoading: false,

    register: async (username, email, password) => {
        try {

            const URL = `http://${PCIPAddress}:3000/api/auth/register`;

            const response = await fetch(`${URL}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || 'Something went wrong');

            await AsyncStorage.setItem("user", JSON.stringify(data.user));
            await AsyncStorage.setItem("token", data.token);

            set({ token: data.token, user: data.user, isLoading: false });

            return {
                success: true,
            }

        } catch (error) {
            set({ isLoading: false });
            return { success: false, error: error.message };

        }
    }
}))