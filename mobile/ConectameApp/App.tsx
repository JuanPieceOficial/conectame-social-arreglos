import 'react-native-gesture-handler'; // Must be at the top

import * as React from 'react';
import { StatusBar, useColorScheme, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { styled } from 'nativewind'; // Import styled
import Toast from 'react-native-toast-message'; // Add this import

// Import the SidebarProvider
import { SidebarProvider } from './src/components/ui/sidebar-context';
import { Sidebar } from './src/components/ui/sidebar'; // Our custom Sidebar component

// Import the actual HomeScreen
import { HomeScreen } from './src/screens/HomeScreen';

const StyledView = styled(View); // Styled components for placeholders
const StyledText = styled(Text);

// Placeholder for other dashboard screens
import { ExploreScreen } from './src/screens/ExploreScreen';

import { MessagesScreen } from './src/screens/MessagesScreen';

import { CreatePostScreen } from './src/screens/CreatePostScreen';

import { ProfileScreen } from './src/screens/ProfileScreen';

import { SettingsScreen } from './src/screens/SettingsScreen';

const Drawer = createDrawerNavigator();

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SidebarProvider>
        <NavigationContainer>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <Drawer.Navigator
            screenOptions={{
              headerShown: false, // We'll manage our own header
            }}
            drawerContent={(props) => <Sidebar {...props} />} // Our custom sidebar component
          >
            <Drawer.Screen name="Home" component={HomeScreen} />
            <Drawer.Screen name="Explore" component={ExploreScreen} />
            <Drawer.Screen name="Messages" component={MessagesScreen} />
            <Drawer.Screen name="CreatePost" component={CreatePostScreen} />
            <Drawer.Screen name="Profile" component={ProfileScreen} />
            <Drawer.Screen name="Settings" component={SettingsScreen} />
          </Drawer.Navigator>
        </NavigationContainer>
      </SidebarProvider>
      <Toast />
    </GestureHandlerRootView>
  );
}

export default App;
