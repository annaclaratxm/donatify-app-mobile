import React from 'react';
import { View, Image } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native-paper';
import MainTabNavigator from './MainTabNavigator'; 
import ActivityDetailScreen from '../screens/ActivityDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen'; 
import ProfileAvatar from '../components/ProfileAvatar'; 

const Stack = createNativeStackNavigator();
const logo = require('../assets/logo.png');

const UserNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Group 
                screenOptions={{ 
                    headerTitle: () => (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={logo} style={{ width: 30, height: 30, marginRight: 10 }}/>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Donatify</Text>
                        </View>
                    ),
                    headerRight: () => <ProfileAvatar />,
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: '#fff' },
                }}
            >
                <Stack.Screen name="MainApp" component={MainTabNavigator} />
                <Stack.Screen name="ActivityDetail" component={ActivityDetailScreen} />
                <Stack.Screen name="Perfil" component={ProfileScreen} />
                <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Editar Perfil' }}/>
            </Stack.Group>
        </Stack.Navigator>
    );
};

export default UserNavigator;