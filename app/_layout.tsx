import { Stack } from "expo-router";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import HomeScreen from "./index"; 
import AccountsScreen from "./accounts";
import WalletsScreen from "./wallets";
import ReferFriendScreen from "./referFriend";
import ReferralHistory from "./referralHistory";
import { TouchableOpacity, Text} from "react-native";

const Drawer = createDrawerNavigator();

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      
      <Drawer.Navigator
          initialRouteName="index"
        >
          <Drawer.Screen name="index" component={HomeScreen} options={{ title: "Home" }} />
          <Drawer.Screen name="accounts" component={AccountsScreen} options={{ title: "Accounts" }} />
          <Drawer.Screen name="wallets" component={WalletsScreen} options={{ title: "Wallets" }} />
          <Drawer.Screen name="referFriend" component={ReferFriendScreen} options={{ title: "ReferFriend" }} />
          <Drawer.Screen name="referralHistory" component={ReferralHistory} options={{ title: "Referral History" }} />
        </Drawer.Navigator>
      
    </GestureHandlerRootView>
  );
}
