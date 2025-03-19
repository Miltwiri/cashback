import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          height: 70,
          justifyContent: 'center',
        alignItems: 'center',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Find Offers",
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Feather name="map-pin" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="referralHistory"
        options={{
          title: "My Earnings",
          tabBarIcon: ({ color, size }) => <Ionicons name="card-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="referFriend"
        options={{
          title: "Earn More",
          tabBarIcon: ({ color, size }) => <AntDesign name="swap" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}