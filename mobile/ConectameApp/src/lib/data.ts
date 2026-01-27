import type { User, Post } from './types';
import { PlaceHolderImages } from './placeholder-images';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

export const users: Record<string, User> = {
  'user-1': {
    id: 'user-1',
    name: 'Elena Rodriguez',
    username: 'elena_dev',
    avatarUrl: findImage('user1-avatar'),
  },
  'user-2': {
    id: 'user-2',
    name: 'Marco Chen',
    username: 'marcode',
    avatarUrl: findImage('user2-avatar'),
  },
  'user-3': {
    id: 'user-3',
    name: 'Aisha Khan',
    username: 'aisha_creates',
    avatarUrl: findImage('user3-avatar'),
  },
  'user-current': {
    id: 'user-current',
    name: 'You',
    username: 'your_profile',
    avatarUrl: findImage('currentUser-avatar'),
  }
};

export const posts: Post[] = [
  {
    id: 'post-1',
    author: users['user-1'],
    content: 'Just finished a hike up to the peak! The views were absolutely breathtaking. Nature is the best artist. 🎨 #hiking #nature #adventure',
    imageUrls: [findImage('post1-image')],
    likes: 124,
    comments: 12,
    timestamp: '2h ago',
  },
  {
    id: 'post-2',
    author: users['user-2'],
    content: 'Exploring the city\'s architecture today. I love the mix of old and new. Every corner has a story to tell. 🏙️',
    imageUrls: [findImage('post2-gallery1'), findImage('post2-gallery2'), findImage('post2-gallery3')],
    likes: 256,
    comments: 34,
    timestamp: '5h ago',
  },
  {
    id: 'post-3',
    author: users['user-3'],
    content: 'Deeply engaged in a fascinating discussion about the future of AI in creative fields. It\'s incredible to think about the possibilities. What are your thoughts on this?',
    likes: 89,
    comments: 45,
    timestamp: '1d ago',
  },
];
