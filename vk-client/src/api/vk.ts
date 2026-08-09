import axios from 'axios';
import { useAuthStore } from '../store';

const VK_API_VERSION = '5.199';
const BASE_URL = 'https://api.vk.com/method/';

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  config.params = config.params || {};
  if (token) {
    config.params.access_token = token;
  }
  config.params.v = VK_API_VERSION;
  return config;
});

export const vkApi = {
  // Method to check token and get basic user info
  usersGet: async () => {
    const response = await api.get('users.get', {
      params: { fields: 'photo_100,status,about,city' },
    });
    if (response.data.error) {
      throw new Error(response.data.error.error_msg);
    }
    return response.data.response[0];
  },

  newsfeedGet: async (startFrom?: string) => {
    const response = await api.get('newsfeed.get', {
      params: { filters: 'post', start_from: startFrom, count: 20 },
    });
    if (response.data.error) {
      throw new Error(response.data.error.error_msg);
    }
    return response.data.response;
  },

  messagesGetConversations: async (offset: number = 0) => {
    const response = await api.get('messages.getConversations', {
      params: { offset, count: 20, extended: 1 },
    });
    if (response.data.error) {
      throw new Error(response.data.error.error_msg);
    }
    return response.data.response;
  },
};
