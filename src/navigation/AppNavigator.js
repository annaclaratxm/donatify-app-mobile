import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Avatar, Text } from 'react-native-paper';

import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import MainTabNavigator from './MainTabNavigator'; 
import ActivityDetailScreen from '../screens/ActivityDetailScreen';
import ProfileScreen from '../screens/ProfileScreen'; 

const Stack = createNativeStackNavigator();
const logo = require('../assets/logo.png');

const AppNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Group screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
            </Stack.Group>

            <Stack.Group 
                screenOptions={({ navigation }) => ({ 
                    headerTitle: () => (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={logo} style={{ width: 30, height: 30, marginRight: 10 }}/>
                        </View>
                    ),
                    headerRight: () => (
                        <TouchableOpacity onPress={() => navigation.navigate('Perfil')}>
                            <Avatar.Image size={32} source={{ uri: 'https://via.placeholder.com/150' }} />
                        </TouchableOpacity>
                    ),
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: '#fff' },
                })}
            >
                <Stack.Screen
                    name="MainApp"
                    component={MainTabNavigator} 
                />
                <Stack.Screen
                    name="ActivityDetail"
                    component={ActivityDetailScreen}
                />
                <Stack.Screen 
                    name="Perfil"
                    component={ProfileScreen}
                />
            </Stack.Group>
        </Stack.Navigator>
    );
};

export default AppNavigator;