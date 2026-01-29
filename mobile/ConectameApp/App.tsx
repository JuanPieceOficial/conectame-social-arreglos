import * as React from 'react';
import { View, Text } from 'react-native';

function App(): React.JSX.Element {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Hello from ConectameApp!</Text>
    </View>
  );
}

export default App;
// Minimal change to trigger GitHub Actions
