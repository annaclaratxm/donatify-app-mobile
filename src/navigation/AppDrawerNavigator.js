import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import MainTabNavigator from './MainTabNavigator';
import ProfileScreen from '../screens/ProfileScreen';

const Drawer = createDrawerNavigator();

const AppDrawerNavigator = () => {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: true }}> 
      <Drawer.Screen 
        name="Início" 
        component={MainTabNavigator} 
        options={{ title: 'Donatify' }} 
      />
      <Drawer.Screen 
        name="Perfil" 
        component={ProfileScreen} 
      />
    </Drawer.Navigator>
  );
};

export default AppDrawerNavigator;