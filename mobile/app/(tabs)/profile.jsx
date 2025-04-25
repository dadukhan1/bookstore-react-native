import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { MAINLINK } from "@env";
import { useAuthStore } from "../../store/authStore.js";
import styles from "../../assets/styles/profile.styles.js";
import ProfileHeader from "../../components/ProfileHeader.jsx";
import LogoutButton from "../../components/LogoutButton.jsx";
import Ionicons from "@expo/vector-icons/Ionicons.js";
import COLORS from "../../constants/colors.js";
import { Image } from "expo-image";
import { sleep } from "./index.jsx";
import Loader from "../../components/Loader.jsx";

const Profile = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(null);
  const [deleteBookId, setDeleteBookId] = useState(null);

  const { token } = useAuthStore();

  const router = useRouter();

  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${MAINLINK}/api/books/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong!");
      }

      setBooks(data.books);
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Error", error.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const renderRatingPicker = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => setRating(i)}
          style={styles.starButton}
        >
          <Ionicons
            name={i <= rating ? "star" : "star-outline"}
            size={12}
            color={i <= rating ? "#f4b400" : COLORS.textSecondary}
          />
        </TouchableOpacity>
      );
    }
    return <View style={styles.ratingContainer}>{stars}</View>;
  };

  const handleDeleteBook = async (bookId) => {
    try {
      setDeleteBookId(bookId);
      const response = await fetch(`${MAINLINK}/api/books/${bookId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.json();

      if (!response.ok)
        throw new Error(data.message || "Failed to delete book.");

      setBooks(books.filter((book) => book._id !== bookId));
    } catch (error) {
      Alert.alert(data.message || "Failed to delete book.");
    } finally {
      setDeleteBookId(null);
    }
  };

  const confirmDelete = (bookId) => {
    Alert.alert(
      "Delete Recommendation",
      "Are you sure you want to this book Recommendation?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDeleteBook(bookId),
        },
      ]
    );
  };

  const renderBookItem = ({ item }) => {
    if (!item) return null;

    return (
      <View style={styles.bookItem}>
        <Image source={{ uri: item.image }} style={styles.bookImage} />
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle}>{item.title}</Text>
          <View style={styles.ratingContainer}>
            {renderRatingPicker(item.rating)}
          </View>
          <Text style={styles.bookCaption} numberOfLines={2}>
            {item.caption}
          </Text>
          <Text style={styles.bookDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => confirmDelete(item._id)}
        >
          {deleteBookId === item._id ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await sleep(500);
    await fetchData();
    setRefreshing(false);
  }

  // if (loading && !refreshing) return <Loader />

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <ProfileHeader />
      <LogoutButton />

      {/* Your Recommendations */}
      <View style={styles.booksHeader}>
        <Text style={styles.bookTitle}>Your Recommendations</Text>
        <Text style={styles.booksCount}>{books.length}</Text>
      </View>

      <FlatList
        data={books}
        renderItem={renderBookItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.booksList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="book-outline"
              size={60}
              color={COLORS.textSecondary}
            />
            <Text style={styles.emptyText}>No Recommendations yet</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/create")}
            >
              <Text style={styles.addButtonText}>
                Add Your First Recommendation
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

export default Profile;
