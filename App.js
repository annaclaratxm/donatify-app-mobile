import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { UserProvider } from './src/context/UserContext'; // Importe o Provedor

export default function App() {
	return (
		// Envolvemos tudo com o UserProvider
		<UserProvider>
			<PaperProvider>
				<NavigationContainer>
					<AppNavigator />
				</NavigationContainer>
			</PaperProvider>
		</UserProvider>
	);
}