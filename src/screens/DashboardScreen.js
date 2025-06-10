import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card } from 'react-native-paper';
import SummaryCard from '../components/SummaryCard';
import RecentActivityItem from '../components/RecentActivityItem';

// Dados fictícios
const summaryData = {
    totalPoints: '1,100',
    activitiesDone: '25',
    rankingPosition: '2º',
};

const recentActivities = [
    { id: '1', title: 'Doação de alimentos - Comunidade Vila Nova', date: '15-01-2025', points: '50', status: 'ativa' },
    { id: '2', title: 'Plantio de árvores - Parque Central', date: '18-01-2025', points: '75', status: 'ativa' },
    { id: '3', title: 'Evento Beneficente - Casa de Apoio', date: '10-01-2025', points: '100', status: 'encerrada' },
];

const DashboardScreen = () => {
    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="titleLarge" style={styles.sectionTitle}>Resumo</Text>
                    <View style={styles.summaryContainer}>
                        <SummaryCard title="Total de pontos" value={summaryData.totalPoints} />
                        <SummaryCard title="Atividades concluídas" value={summaryData.activitiesDone} />
                    </View>
                    <View style={styles.summaryContainer}>
                        <SummaryCard title="Posição no Ranking" value={summaryData.rankingPosition} />
                    </View>
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="titleLarge" style={styles.sectionTitle}>Atividades Recentes</Text>
                    <Text style={styles.sectionSubtitle}>Suas últimas participações</Text>
                </Card.Content>
                <FlatList
                    data={recentActivities}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <RecentActivityItem
                            icon="thumb-up-outline"
                            title={item.title}
                            date={item.date}
                            points={item.points}
                            status={item.status}
                        />
                    )}
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
});

export default DashboardScreen;