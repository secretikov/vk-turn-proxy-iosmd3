import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { Card, Text, Avatar, IconButton, useTheme } from 'react-native-paper';
import { vkApi } from '../api/vk';

export const FeedScreen = () => {
  const [feed, setFeed] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<{ [key: number]: any }>({});
  const [groups, setGroups] = useState<{ [key: number]: any }>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [nextFrom, setNextFrom] = useState<string | undefined>();
  const theme = useTheme();

  const loadFeed = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      const data = await vkApi.newsfeedGet(isRefresh ? undefined : nextFrom);

      const newProfiles = data.profiles.reduce((acc: any, p: any) => ({ ...acc, [p.id]: p }), {});
      const newGroups = data.groups.reduce((acc: any, g: any) => ({ ...acc, [-g.id]: g }), {}); // Group IDs are negative in source_id

      setProfiles(prev => ({ ...prev, ...newProfiles }));
      setGroups(prev => ({ ...prev, ...newGroups }));

      if (isRefresh) {
        setFeed(data.items);
      } else {
        setFeed(prev => [...prev, ...data.items]);
      }
      setNextFrom(data.next_from);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  const renderItem = ({ item }: { item: any }) => {
    const sourceId = item.source_id;
    let author = null;
    if (sourceId > 0) {
      author = profiles[sourceId];
    } else {
      author = groups[sourceId];
    }

    const title = author?.name || `${author?.first_name} ${author?.last_name}`;
    const avatar = author?.photo_100 || author?.photo_50;

    return (
      <Card style={styles.card} mode="elevated">
        <Card.Title
          title={title}
          subtitle={new Date(item.date * 1000).toLocaleString()}
          left={(props) => (
            avatar ? <Avatar.Image {...props} source={{ uri: avatar }} /> : <Avatar.Icon {...props} icon="account" />
          )}
        />
        {item.text ? (
          <Card.Content>
            <Text variant="bodyMedium" numberOfLines={5}>
              {item.text}
            </Text>
          </Card.Content>
        ) : null}

        {item.attachments && item.attachments.find((a: any) => a.type === 'photo') && (
           <Card.Cover
              source={{ uri: item.attachments.find((a: any) => a.type === 'photo').photo.sizes[item.attachments.find((a: any) => a.type === 'photo').photo.sizes.length - 1].url }}
              style={styles.cover}
           />
        )}

        <Card.Actions style={styles.actions}>
          <View style={styles.actionItem}>
             <IconButton icon="heart-outline" size={20} />
             <Text>{item.likes?.count || 0}</Text>
          </View>
          <View style={styles.actionItem}>
             <IconButton icon="comment-outline" size={20} />
             <Text>{item.comments?.count || 0}</Text>
          </View>
          <View style={styles.actionItem}>
             <IconButton icon="share-outline" size={20} />
             <Text>{item.reposts?.count || 0}</Text>
          </View>
          <View style={{ flex: 1 }} />
          <View style={styles.actionItem}>
             <IconButton icon="eye-outline" size={20} />
             <Text>{item.views?.count || 0}</Text>
          </View>
        </Card.Actions>
      </Card>
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
        data={feed}
        keyExtractor={(item) => `${item.source_id}_${item.post_id}`}
        renderItem={renderItem}
        onRefresh={() => loadFeed(true)}
        refreshing={refreshing}
        onEndReached={() => {
          if (nextFrom && !loading) {
            loadFeed();
          }
        }}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContent}
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
  listContent: {
    padding: 8,
  },
  card: {
    marginBottom: 16,
  },
  cover: {
    marginTop: 8,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  actions: {
    justifyContent: 'flex-start',
    paddingHorizontal: 8,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  }
});
