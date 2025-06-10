import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Avatar, Text } from 'react-native-paper';

import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import AppDrawerNavigator from './AppDrawerNavigator'; 
import ActivityDetailScreen from '../screens/ActivityDetailScreen';

const Stack = createNativeStackNavigator();
const logo = require('../assets/logo.png');

const AppNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Login">
            {/* Telas de Autenticação */}
            <Stack.Group screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
            </Stack.Group>

            {/* Telas Principais do App */}
            <Stack.Group screenOptions={({ navigation }) => ({ 
                headerTitle: () => (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={logo} style={{ width: 30, height: 30, marginRight: 10 }}/>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Donatify</Text>
                    </View>
                ),
                headerRight: () => (
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Avatar.Icon icon="menu" size={40} style={{ backgroundColor: 'transparent' }} />
                    </TouchableOpacity>
                ),
                headerShadowVisible: false,
                headerStyle: { backgroundColor: '#fff' },
            })}
            >
                <Stack.Screen
                    name="MainApp"
                    component={AppDrawerNavigator}
                />
                <Stack.Screen
                    name="ActivityDetail"
                    component={ActivityDetailScreen}
                />
            </Stack.Group>

        </Stack.Navigator>
    );
};

export default AppNavigator;