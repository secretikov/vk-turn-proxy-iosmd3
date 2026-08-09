import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Appbar, Text, Avatar, useTheme, IconButton } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function CallScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const theme = useTheme();

  const { title } = route.params || { title: 'Unknown Contact' };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header elevated style={{ backgroundColor: 'transparent' }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
      </Appbar.Header>

      <View style={styles.content}>
        <Avatar.Text size={100} label={title.substring(0, 2).toUpperCase()} style={styles.avatar} />
        <Text variant="headlineMedium" style={styles.name}>{title}</Text>
        <Text variant="bodyLarge" style={styles.status}>Calling...</Text>
      </View>

      <View style={styles.controls}>
        <IconButton icon="microphone-off" mode="contained-tonal" size={32} onPress={() => {}} />
        <IconButton icon="video-off" mode="contained-tonal" size={32} onPress={() => {}} />
        <IconButton icon="phone-hangup" containerColor={theme.colors.error} iconColor={theme.colors.onError} mode="contained" size={32} onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    marginBottom: 24,
  },
  name: {
    marginBottom: 8,
  },
  status: {
    opacity: 0.7,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 32,
    paddingBottom: 48,
  },
});
