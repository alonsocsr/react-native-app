import { View, Text, Image, SafeAreaView } from 'react-native';
import { Tabs, Redirect } from 'expo-router';

import { icons } from "../../constans";
import { StatusBar } from 'expo-status-bar';

const TabIcon = ({ icon, color, name, focused}) => {
  return (
    <View 
      style={{ width: 76, height: 76, alignItems: 'center', justifyContent: 'center' }}
    >
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        style={{ width: 24, height: 24 }}
      />
      <Text className={`${focused ? 'font-fsemibold' : 'font-fregular'} text-xs`}      
          style={{
          color: color,
          fontSize: 12, // Adjust font size for clarity
          marginTop: 2, // Add spacing between icon and text
          textAlign: 'center', // Center the text below the icon
          fontWeight: focused ? '600' : '400', // Bold text when focused
        }}
      >
        {name}
      </Text>
    </View>
  )
}

const TabsLayout = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#161622' }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#ec4899",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarShowLabel: false,
          tabBarStyle: {
            height: 66, // Height of the tab bar
            backgroundColor: '#161622',
            borderTopWidth: 1,
            borderTopColor: '#232533',
            paddingVertical: 0, // Removes vertical padding
            paddingBottom: 0,
            paddingTop: 12, // Add padding to move icons up
          },
          safeAreaInsets: { bottom: 0 }
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'home',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="Inicio"
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen
          name="ventas"
          options={{
            title: 'ventas',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.sales}
                color={color}
                name="Ventas"
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen
          name="categorias"
          options={{
            title: 'categorias',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.category}
                color={color}
                name="Categorias"
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen
          name="productos"
          options={{
            title: 'productos',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.product}
                color={color}
                name="Productos"
                focused={focused}
              />
            )
          }}
        />
      </Tabs>
         
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  )
}

export default TabsLayout