import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { useAuthStore } from '../store';
import { vkApi } from '../api/vk';

export const AuthScreen = () => {
  const [tokenInput, setTokenInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuth } = useAuthStore();
  const theme = useTheme();

  const handleLogin = async () => {
    if (!tokenInput.trim()) {
      setError('Token cannot be empty');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Temporarily set token in state to check validity
      await setAuth(tokenInput);
      const user = await vkApi.usersGet();
      if (user && user.id) {
         await setAuth(tokenInput, user.id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate');
      useAuthStore.getState().logout();
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Text variant="headlineMedium" style={styles.title}>
          VK Login
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Enter your access token to continue
        </Text>

        <TextInput
          mode="outlined"
          label="Access Token"
          value={tokenInput}
          onChangeText={(text) => {
            setTokenInput(text);
            if (error) setError(null);
          }}
          secureTextEntry
          autoCapitalize="none"
          style={styles.input}
          error={!!error}
        />

        {error && (
          <Text style={[styles.error, { color: theme.colors.error }]}>
            {error}
          </Text>
        )}

        <Button
          mode="contained"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          Login
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    padding: 24,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    paddingVertical: 4,
  },
  error: {
    marginBottom: 16,
    textAlign: 'center',
  },
});
