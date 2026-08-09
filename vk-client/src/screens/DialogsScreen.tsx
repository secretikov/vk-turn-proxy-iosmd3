import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { List, Avatar, Text, Badge, useTheme } from 'react-native-paper';
import { vkApi } from '../api/vk';

export const DialogsScreen = () => {
  const [dialogs, setDialogs] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<{ [key: number]: any }>({});
  const [groups, setGroups] = useState<{ [key: number]: any }>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();

  const loadDialogs = async () => {
    try {
      setRefreshing(true);
      const data = await vkApi.messagesGetConversations();

      const newProfiles = data.profiles?.reduce((acc: any, p: any) => ({ ...acc, [p.id]: p }), {}) || {};
      const newGroups = data.groups?.reduce((acc: any, g: any) => ({ ...acc, [-g.id]: g }), {}) || {};

      setProfiles(newProfiles);
      setGroups(newGroups);
      setDialogs(data.items);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDialogs();
  }, []);

  const renderItem = ({ item }: { item: any }) => {
    const conversation = item.conversation;
    const lastMessage = item.last_message;
    const peerId = conversation.peer.id;

    let title = 'Chat';
    let avatarUrl = null;

    if (conversation.peer.type === 'user') {
      const user = profiles[peerId];
      if (user) {
        title = `${user.first_name} ${user.last_name}`;
        avatarUrl = user.photo_100 || user.photo_50;
      }
    } else if (conversation.peer.type === 'group') {
      const group = groups[-peerId];
      if (group) {
        title = group.name;
        avatarUrl = group.photo_100 || group.photo_50;
      }
    } else if (conversation.chat_settings) {
       title = conversation.chat_settings.title;
       avatarUrl = conversation.chat_settings.photo?.photo_100;
    }

    const unreadCount = conversation.unread_count || 0;

    return (
      <List.Item
        title={title}
        description={lastMessage?.text || 'Attachment'}
        descriptionNumberOfLines={1}
        left={(props) => (
          <View style={props.style}>
             {avatarUrl ? (
               <Avatar.Image size={48} source={{ uri: avatarUrl }} />
             ) : (
               <Avatar.Icon size={48} icon="account-group" />
             )}
          </View>
        )}
        right={(props) => (
          <View style={[props.style, styles.rightContainer]}>
            <Text variant="labelSmall" style={styles.time}>
              {new Date(lastMessage?.date * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            {unreadCount > 0 && (
              <Badge size={24} style={styles.badge}>{unreadCount}</Badge>
            )}
          </View>
        )}
        onPress={() => {}}
        style={styles.listItem}
      />
    );
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={dialogs}
        keyExtractor={(item) => item.conversation.peer.id.toString()}
        renderItem={renderItem}
        onRefresh={loadDialogs}
        refreshing={refreshing}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItem: {
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  rightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  time: {
    opacity: 0.5,
    marginBottom: 4,
  },
  badge: {
    alignSelf: 'flex-end',
  }
});
