import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import { Text, Card, ActivityIndicator, Chip, Button, IconButton } from 'react-native-paper';
import { getUserEnrollments } from '../services/enrollmentService';

const UserEnrollmentsScreen = ({ navigation }) => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchUserEnrollments = async () => {
        try {
            if (!refreshing) {
                setLoading(true);
            }
            console.log('[UserEnrollmentsScreen] Buscando inscrições do usuário...');
            const data = await getUserEnrollments();
            console.log('[UserEnrollmentsScreen] Dados recebidos:', JSON.stringify(data));
            setEnrollments(data);
        } catch (error) {
            console.error('[UserEnrollmentsScreen] Erro ao buscar inscrições:', error.response || error);
            Alert.alert('Erro', 'Não foi possível carregar suas inscrições.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchUserEnrollments();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchUserEnrollments();
    };

    const renderStatus = (status) => {
        let color;
        let label;
        
        switch (status) {
            case 'ENROLLED':
                color = '#FFA000';
                label = 'INSCRITO';
                break;
            case 'COMPLETED':
                color = '#3D8B6D';
                label = 'CONCLUÍDO';
                break;
            case 'CANCELED':
                color = '#D32F2F';
                label = 'CANCELADO';
                break;
            default:
                color = '#757575';
                label = status;
        }
        
        return <Chip style={{ backgroundColor: color + '20' }} textStyle={{ color, fontWeight: 'bold' }}>{label}</Chip>;
    };

    const renderEnrollmentItem = ({ item }) => {
        const title = item.activityTitle || item.activity?.title || item.title || 'Atividade';
        const activityId = item.activityId || item.activity?.id || item.id;
        const enrollmentDate = item.enrollmentDate || item.createdAt || new Date();
        const enrollmentStatus = item.enrollmentStatus || item.status || 'ENROLLED';
        const points = item.points || item.pointsValue || 0;
        const completedDate = item.completedDate || item.updatedAt;
        
        return (
            <Card style={styles.card}>
                <Card.Title
                    title={title}
                    titleNumberOfLines={2}
                    subtitle={`Inscrito em: ${new Date(enrollmentDate).toLocaleDateString()}`}
                    right={(props) => (
                        <IconButton
                            {...props}
                            icon="eye"
                            onPress={() => navigation.navigate('ActivityDetail', { activityId })}
                        />
                    )}
                />
                <Card.Content>
                    <View style={styles.statusContainer}>
                        <Text style={styles.statusLabel}>Status:</Text>
                        {renderStatus(enrollmentStatus)}
                        {enrollmentStatus === 'COMPLETED' && 
                            <Chip style={styles.pointsChip} icon="star">
                                {points} pontos
                            </Chip>
                        }
                    </View>
                    {enrollmentStatus === 'COMPLETED' && completedDate && (
                        <Text style={styles.completedText}>
                            Concluído em: {new Date(completedDate).toLocaleDateString()}
                        </Text>
                    )}
                </Card.Content>
            </Card>
        );
    };

    return (
        <View style={styles.container}>
            {loading && !refreshing ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#3D8B6D" />
                    <Text style={styles.loadingText}>Carregando suas inscrições...</Text>
                </View>
            ) : (
                <FlatList
                    data={enrollments}
                    keyExtractor={(item) => (item.enrollmentId || item.id || `${item.activityId || ''}-${Date.now()}`).toString()}
                    renderItem={renderEnrollmentItem}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#3D8B6D']}
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Você ainda não se inscreveu em nenhuma atividade.</Text>
                            <Button 
                                mode="contained" 
                                onPress={() => navigation.navigate('Atividades')}
                                style={styles.activitiesButton}
                            >
                                Ver Atividades
                            </Button>
                        </View>
                    }
                    contentContainerStyle={enrollments.length === 0 ? styles.emptyFlatList : {}}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        color: '#666',
        fontSize: 16,
    },
    card: {
        marginVertical: 6,
        marginHorizontal: 12,
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 2,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
    },
    statusLabel: {
        fontWeight: '500',
        color: '#333'
    },
    pointsChip: {
        backgroundColor: '#E6F3EE',
    },
    completedText: {
        marginTop: 10,
        fontStyle: 'italic',
        color: '#666',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    emptyFlatList: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#666',
    },
    activitiesButton: {
        backgroundColor: '#3D8B6D',
    },
});

export default UserEnrollmentsScreen;