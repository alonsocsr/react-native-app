import { View, Text, Image } from 'react-native';
import { Tabs, Redirect } from 'expo-router';

import { icons } from "../../constans";
import { StatusBar } from 'expo-status-bar';

const TabIcon = ({ icon, color, name, focused}) => {
  return (
    <View className="items-center justify-center gap-2">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
      />
      <Text className={`${focused ? 'font-fsemibold' : 'font-fregular' } text-xs`} style={{color: color}}>
        {name}
      </Text>
    </View>
  )
}

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#ec4899",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: '#161622',
            borderTopWidth: 1,
            borderTopColor: '#232533',
            height: 76,
          }
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
    </>
  )
}

export default TabsLayout