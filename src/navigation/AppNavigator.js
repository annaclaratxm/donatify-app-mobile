import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useUser } from '../context/UserContext';

import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import UserNavigator from './UserNavigator';
import AdminNavigator from './AdminNavigator'; 

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    const { isAuthenticated, user, isLoading } = useUser();

    if (isLoading && !user) { 
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isAuthenticated && user ? (
                user.role === 'ADMIN' ? (
                    <Stack.Screen name="AdminPanel" component={AdminNavigator} />
                ) : (
                    <Stack.Screen name="UserPanel" component={UserNavigator} />
                )
            ) : (
                <Stack.Group>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="SignUp" component={SignUpScreen} />
                </Stack.Group>
            )}
        </Stack.Navigator>
    );
};

export default AppNavigator;