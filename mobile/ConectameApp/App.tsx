import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { HomeScreen } from './src/screens/HomeScreen';
import { ExploreScreen } from './src/screens/ExploreScreen';
import { MessagesScreen } from './src/screens/MessagesScreen';
import { CreatePostScreen } from './src/screens/CreatePostScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

import { AppSidebar } from './src/components/layout/AppSidebar';
import { ToastProvider } from './src/hooks/use-toast'; // Assuming a ToastProvider exists

const Drawer = createDrawerNavigator();

function App(): React.JSX.Element {
  return (
    <ToastProvider>
      <NavigationContainer>
        <Drawer.Navigator
          drawerContent={(props) => <AppSidebar {...props} />}
          screenOptions={{ headerShown: false }}
        >
          <Drawer.Screen name="Home" component={HomeScreen} />
          <Drawer.Screen name="Explore" component={ExploreScreen} />
          <Drawer.Screen name="Messages" component={MessagesScreen} />
          <Drawer.Screen name="CreatePost" component={CreatePostScreen} />
          <Drawer.Screen name="Profile" component={ProfileScreen} />
          <Drawer.Screen name="Settings" component={SettingsScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    </ToastProvider>
  );
}

export default App;