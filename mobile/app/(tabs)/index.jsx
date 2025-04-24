import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { Image } from "expo-image";
import styles from "../../assets/styles/home.styles.js";
import { MAINLINK } from "@env";
import Ionicons from "@expo/vector-icons/Ionicons.js";
import COLORS from "../../constants/colors.js";
import { formatPublishDate } from "../../lib/utils.js";
import Loader from "../../components/Loader.jsx";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const Home = () => {
  const { token, logout } = useAuthStore();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchBooks = async (pageNumber = 1, refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else if (pageNumber === 1) setLoading(true);

      const response = await fetch(
        `${MAINLINK}/api/books?page=${pageNumber}&limit=2`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (!response.ok)
        throw new Error("Error", data.message || "Failed to fetch books");

      // setBooks((prevBooks) => [...prevBooks, ...data.books]);

      const uniqueBooks =
        refresh || pageNumber === 1
          ? data.books
          : Array.from(
            new Set(
              [...books, ...data.books]
                .map((book) => book._id)
                .map((id) =>
                  [...books, ...data.books].find((book) => book._id === id)
                )
            )
          );

      setBooks(uniqueBooks);

      setHasMore(pageNumber < data.totalPages);
      setPage(pageNumber);
    } catch (error) {
      console.log("Error in fetching books", error);
    } finally {
      if (refresh) {
        await sleep(1000)
        setRefreshing(false);
      }
      else setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleLoadMore = async () => {

    if (hasMore && !loading && !refreshing) {
      await sleep(1000)
      await fetchBooks(page + 1);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.bookCard}>
      <View style={styles.bookHeader}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: item.user.profileImage }}
            style={styles.avatar}
          />
          <Text style={styles.username}>{item.user.username}</Text>
        </View>
      </View>
      <View style={styles.bookImageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.bookImage}
          contentFit="cover"
        />
      </View>
      <View style={styles.bookDetails}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.ratingContainer}>{renderStars(item.rating)}</Text>
        <Text style={styles.caption}>{item.caption}</Text>
        <Text style={styles.date}>
          Shared on {formatPublishDate(item.createdAt)}
        </Text>
      </View>
    </View>
  );



  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={16}
          color={i <= rating ? "#f4b400" : COLORS.textSecondary}
          style={{ marginRight: 2 }}
        />
      );
    }
    return stars;
  };

  if (loading) return <Loader size="small" />

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsHorizontalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>BookWorm 🌴</Text>
            <Text style={styles.headerSubtitle}>
              Discover great reads from the community👇
            </Text>
          </View>
        }

        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              fetchBooks(1, true)
            }}
            color={COLORS.primary}
            tintColor={COLORS.primary}
          />
        }

        ListFooterComponent={
          hasMore && books.length > 0 ? (
            <ActivityIndicator
              style={styles.footerLoader}
              size="small"
              color={COLORS.primary}
            />
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="book-outline"
              size={60}
              color={COLORS.textSecondary}
            />
            <Text style={styles.emptyText}>No Recommendations yet</Text>
            <Text style={styles.emptySubtext}>
              Be the first to share a book!
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default Home;
