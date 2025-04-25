import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useAuthStore } from '../store/authStore';
import { Image } from 'expo-image';
import styles from '../assets/styles/profile.styles.js';
import { formatMemberSince } from '../lib/utils.js';

const ProfileHeader = () => {
    const { user } = useAuthStore();

    if (!user) return null;

    return (
        <View style={styles.profileHeader}>
            <Image source={{ uri: user.profileImage }} style={styles.profileImage} />

            <View style={styles.profileInfo}>
                <Text style={styles.username} >{user.username}</Text>
                <Text style={styles.email} >{user.email}</Text>
            </View>
        </View>
    )
}

export default ProfileHeader
