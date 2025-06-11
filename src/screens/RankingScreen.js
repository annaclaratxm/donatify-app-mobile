
import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text } from 'react-native-paper';
import RankingItem from '../components/RankingItem';

// Dados fictícios para o ranking
const rankingData = [
    { rank: 1, name: 'Maria Silva', points: '1,250' },
    { rank: 2, name: 'João Santos', points: '1,100' },
    { rank: 3, name: 'Ana Costa', points: '950' },
    { rank: 4, name: 'Pedro Lima', points: '800' },
    { rank: 5, name: 'Carla Oliveira', points: '750' },
    { rank: 6, name: 'Gabriel da Silva', points: '725' },
    { rank: 7, name: 'XXXX', points: 'XXX' },
    { rank: 8, name: 'XXXX', points: 'XXX' },
    { rank: 9, name: 'XXXX', points: 'XXX' },
    { rank: 10, name: 'XXXX', points: 'XXX' },
];

const RankingScreen = () => {
    return (
        <View style={styles.container}>
            <FlatList
                data={rankingData}
                keyExtractor={(item) => item.rank.toString()}
                ListHeaderComponent={ 
                    <>
                        <Text variant="titleLarge" style={styles.mainTitle}>Ranking de Voluntários</Text>
                        <Text style={styles.subtitle}>Os voluntários com mais pontos da comunidade</Text>
                    </>
                }
                renderItem={({ item }) => (
                    <RankingItem
                        rank={item.rank}
                        name={item.name}
                        points={item.points}
                    />
                )}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    mainTitle: {
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 4,
    },
    subtitle: {
        color: '#666',
        marginBottom: 24, 
    },
});

export default RankingScreen;