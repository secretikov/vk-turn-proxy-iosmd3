import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Avatar, Text, Button, useTheme, Card } from 'react-native-paper';
import { useAuthStore } from '../store';
import { vkApi } from '../api/vk';

export const ProfileScreen = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuthStore();
  const theme = useTheme();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const user = await vkApi.usersGet();
        setProfile(user);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <Text>Error loading profile</Text>
        <Button mode="contained" onPress={logout} style={{ marginTop: 16 }}>Logout</Button>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card} mode="elevated">
        <View style={styles.header}>
          {profile.photo_100 ? (
            <Avatar.Image size={80} source={{ uri: profile.photo_100 }} />
          ) : (
            <Avatar.Icon size={80} icon="account" />
          )}
          <View style={styles.info}>
            <Text variant="titleLarge" style={styles.name}>
              {profile.first_name} {profile.last_name}
            </Text>
            {profile.status ? (
              <Text variant="bodyMedium" style={styles.status}>
                {profile.status}
              </Text>
            ) : null}
            {profile.city?.title ? (
               <Text variant="bodySmall" style={styles.city}>
                 {profile.city.title}
               </Text>
            ) : null}
          </View>
        </View>
      </Card>

      <Button
        mode="outlined"
        onPress={logout}
        style={styles.logoutButton}
        textColor={theme.colors.error}
      >
        Log Out
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: 16,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    marginLeft: 16,
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
  },
  status: {
    opacity: 0.7,
    marginTop: 4,
  },
  city: {
    opacity: 0.5,
    marginTop: 4,
  },
  logoutButton: {
    marginTop: 'auto',
    marginBottom: 16,
  }
});
