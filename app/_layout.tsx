import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen name="index" options={{ title: "Home", headerShown: false }} /> 
        <Drawer.Screen name="accounts" options={{ title: "Accounts", headerShown: true }} />
        <Drawer.Screen name="wallets" options={{ title: "Wallets", headerShown: true }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}
