import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AdminActivitiesScreen from '../screens/AdminActivitiesScreen';
import AdminUsersScreen from '../screens/AdminUsersScreen';
import AdminOngsScreen from '../screens/AdminOngsScreen';
import AdminEnrollmentsScreen from '../screens/AdminEnrollmentsScreen';

const Tab = createMaterialTopTabNavigator();

const AdminTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarScrollEnabled: true, 
                tabBarActiveTintColor: '#3D8B6D',
                tabBarIndicatorStyle: { backgroundColor: '#3D8B6D' },
            }}
        >
            <Tab.Screen name="Atividades" component={AdminActivitiesScreen} />
            <Tab.Screen name="Usuários" component={AdminUsersScreen} />
            <Tab.Screen name="ONGs" component={AdminOngsScreen} />
            <Tab.Screen name="Inscrições" component={AdminEnrollmentsScreen} />
        </Tab.Navigator>
    );
};

export default AdminTabNavigator;