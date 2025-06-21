import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import DashboardScreen from '../screens/DashboardScreen';
import AtividadesScreen from '../screens/AtividadesScreen';
import RankingScreen from '../screens/RankingScreen';
import UserEnrollmentsScreen from '../screens/UserEnrollmentsScreen';

const Tab = createMaterialTopTabNavigator();

const MainTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#3D8B6D',
                tabBarInactiveTintColor: '#666',
                tabBarIndicatorStyle: {
                    backgroundColor: '#3D8B6D',
                    height: 3,
                },
                tabBarLabelStyle: {
                    fontWeight: 'bold',
                },
                tabBarStyle: {
                    backgroundColor: '#fff',
                }
            }}
        >
            <Tab.Screen name="Dashboard" component={DashboardScreen} />
            <Tab.Screen name="Atividades" component={AtividadesScreen} />
            <Tab.Screen name="Inscrições" component={UserEnrollmentsScreen} />
            <Tab.Screen name="Ranking" component={RankingScreen} />
        </Tab.Navigator>
    );
};

export default MainTabNavigator;