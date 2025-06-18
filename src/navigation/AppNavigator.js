// src/navigation/AppNavigator.js

import React from 'react';
import { View, Image } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native-paper';

// Navegadores e Telas
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import MainTabNavigator from './MainTabNavigator'; 
import ActivityDetailScreen from '../screens/ActivityDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

// O novo componente de Avatar que busca os dados do contexto
import ProfileAvatar from '../components/ProfileAvatar'; 

const Stack = createNativeStackNavigator();
const logo = require('../assets/logo.png');

const AppNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Login">
            {/* Telas de Autenticação (sem cabeçalho) */}
            <Stack.Group screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
            </Stack.Group>

            {/* Telas Principais do App (com cabeçalho compartilhado) */}
            <Stack.Group 
                screenOptions={({ navigation }) => ({ 
                    // Título com logo e nome do App
                    headerTitle: () => (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={logo} style={{ width: 30, height: 30, marginRight: 10 }}/>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Donatify</Text>
                        </View>
                    ),
                    // O headerRight agora é o nosso componente inteligente
                    headerRight: () => <ProfileAvatar />,
                    
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
                <Stack.Screen 
                    name="EditProfile" 
                    component={EditProfileScreen} 
                />
            </Stack.Group>
        </Stack.Navigator>
    );
};

export default AppNavigator;
