import React, { useState } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Appbar, TextInput, IconButton, Text, Card, Avatar, useTheme } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

export default function ChatScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const theme = useTheme();

  const { title } = route.params || { title: 'Chat' };

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([
    { id: '1', text: 'Hello!', isOwn: false },
    { id: '2', text: 'Hi, how are you?', isOwn: true },
  ]);

  const handleSend = () => {
    if (message.trim()) {
      setMessages((prev) => [...prev, { id: Date.now().toString(), text: message, isOwn: true }]);
      setMessage('');
    }
  };

  const handlePickMedia = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), imageUri: result.assets[0].uri, isOwn: true }
      ]);
    }
  };

  const handleCall = () => {
    navigation.navigate('Call', { title });
  };

  const renderMessage = ({ item }: { item: any }) => {
    return (
      <View style={[styles.messageBubble, item.isOwn ? styles.ownBubble : styles.otherBubble, { backgroundColor: item.isOwn ? theme.colors.primaryContainer : theme.colors.surfaceVariant }]}>
        {item.imageUri ? (
          <Card.Cover source={{ uri: item.imageUri }} style={{ width: 200, height: 200, borderRadius: 10 }} />
        ) : (
          <Text style={{ color: item.isOwn ? theme.colors.onPrimaryContainer : theme.colors.onSurfaceVariant }}>
            {item.text}
          </Text>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={title} />
        <Appbar.Action icon="phone" onPress={handleCall} />
        <Appbar.Action icon="video" onPress={handleCall} />
      </Appbar.Header>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.listContainer}
      />

      <View style={styles.inputContainer}>
        <IconButton icon="attachment" onPress={handlePickMedia} />
        <TextInput
          mode="outlined"
          value={message}
          onChangeText={setMessage}
          placeholder="Message"
          style={styles.input}
          right={<TextInput.Icon icon="send" onPress={handleSend} />}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
    maxWidth: '80%',
  },
  ownBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
  },
  input: {
    flex: 1,
  },
});
