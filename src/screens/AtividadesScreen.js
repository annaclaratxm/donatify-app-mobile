import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text } from 'react-native-paper';
import ActivityCard from '../components/ActivityCard';

// Dados fictícios
const availableActivities = [
    {
        id: '1',
        category: 'doação',
        status: 'ativa',
        title: 'Doação de alimentos - Comunidade Vila Nova',
        description: 'Ajude a distribuir alimentos para famílias em situação de vulnerabilidade social.',
        points: '50',
        date: '15-01-2025',
        time: '08h - 12h',
        location: 'Rua das Flores, 123, Vila Nova',
    },
    {
        id: '2',
        category: 'voluntariado',
        status: 'ativa',
        title: 'Plantio de Árvores no Parque Central',
        description: 'Participe da ação de reflorestamento e ajude a tornar nossa cidade mais verde.',
        points: '75',
        date: '18-01-2025',
        time: '07h - 11h',
        location: 'Parque Central - Entrada Principal',
    },
];

const AtividadesScreen = ({ navigation }) => {
    const handleParticipar = (activity) => {
        navigation.navigate('ActivityDetail', { activityId: activity.id });
    };

    return (
        <View style={styles.container}>
            <Text variant="titleLarge" style={styles.title}>Atividades Disponíveis</Text>
            <FlatList
                data={availableActivities}
                renderItem={({ item }) => (
                    <ActivityCard
                        activity={item}
                        onParticipar={() => handleParticipar(item)}
                    />
                )}
                keyExtractor={item => item.id}
                numColumns={2}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontWeight: 'bold',
        margin: 16,
        marginBottom: 0,
    },
    list: {
        paddingHorizontal: 8,
    }
});

export default AtividadesScreen;