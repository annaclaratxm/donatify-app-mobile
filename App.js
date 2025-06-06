import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
	return (
		<PaperProvider>
			<NavigationContainer>
				<AppNavigator />
			</NavigationContainer>
		</PaperProvider>
	);
}