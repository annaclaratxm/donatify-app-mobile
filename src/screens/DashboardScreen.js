import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native'; 
import SummaryCard from '../components/SummaryCard';
import RecentActivityItem from '../components/RecentActivityItem';
import { getDashboardData } from '../services/dashboardService'; 

const DashboardScreen = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const isFocused = useIsFocused();

    // Função para buscar os dados da API
    const fetchData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getDashboardData();
            setDashboardData(data);
        } catch (e) {
            setError('Não foi possível carregar os dados do dashboard.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isFocused) {
            fetchData();
        }
    }, [isFocused]);

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator animating={true} size="large" />
            </View>
        );
    }

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
            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="titleLarge" style={styles.sectionTitle}>Resumo</Text>
                    <View style={styles.summaryContainer}>
                        <SummaryCard title="Total de pontos" value={dashboardData?.totalPoints.toString()} />
                        <SummaryCard title="Atividades concluídas" value={dashboardData?.completedActivities.toString()} />
                    </View>
                    <View style={styles.summaryContainer}>
                        <SummaryCard title="Posição no Ranking" value={`${dashboardData?.rankingPosition}º`} />
                    </View>
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="titleLarge" style={styles.sectionTitle}>Atividades Recentes</Text>
                    <Text style={styles.sectionSubtitle}>Suas últimas participações</Text>
                </Card.Content>
                <FlatList
                    data={dashboardData?.recentActivities}
                    keyExtractor={(item, index) => `${item.title}-${index}`}
                    renderItem={({ item }) => (
                        <RecentActivityItem
                            icon="thumb-up-outline"
                            title={item.title}
                            date={new Date(item.date).toLocaleDateString('pt-BR')} 
                            points={item.points}
                            status={item.status}
                        />
                    )}
                    ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma atividade recente encontrada.</Text>}
                />
            </Card>
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
    card: {
        margin: 8,
        backgroundColor: '#fff',
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    sectionSubtitle: {
        color: '#666',
        marginBottom: 8,
    },
    summaryContainer: {
        flexDirection: 'row',
        marginHorizontal: -4,
    },
    emptyText: {
        textAlign: 'center',
        padding: 20,
        color: '#666',
    }
});

export default DashboardScreen;