import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useAuthStore } from '../store/authStore';
import styles from '../assets/styles/profile.styles';
import COLORS from '../constants/colors';
import Ionicons from "@expo/vector-icons/Ionicons.js";
import { Alert } from 'react-native';


const LogoutButton = () => {

  const { logout } = useAuthStore();


  const confirmLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout? ", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => logout(), style: "destructive" }
    ])

  }

  return (
    <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
      <Ionicons name="log-out-outline" size={20} color={COLORS.white} />
    </TouchableOpacity>
  )
}

export default LogoutButton
