import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import RankingItem from '../components/RankingItem';
import { getRankingList } from '../services/rankingService'; 

const RankingScreen = () => {
    const [rankingData, setRankingData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const isFocused = useIsFocused();

    // Função para buscar os dados da API
    const fetchData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getRankingList();
            console.log('Dados do ranking:', data); // Log dos dados recebidos
            setRankingData(data);
        } catch (e) {
            setError('Não foi possível carregar o ranking.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isFocused) {
            fetchData();
        }
    }, [isFocused]);


    // Renderiza a tela de carregamento
    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator animating={true} size="large" />
            </View>
        );
    }

    // Renderiza a tela de erro
    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text>{error}</Text>
                <Button onPress={fetchData} style={{ marginTop: 10 }}>Tentar Novamente</Button>
            </View>
        );
    }

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
                        name={item.nickname}
                        points={item.totalPoints.toString()} 
                    />
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>O ranking ainda está vazio.</Text>}
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
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
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
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: '#666',
    }
});

export default RankingScreen;