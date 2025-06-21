import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, FlatList, RefreshControl } from 'react-native';
import { Text, Card, Button, ActivityIndicator, Chip, Menu } from 'react-native-paper';
import { getAllEnrollments, completeEnrollment, cancelEnrollment } from '../services/enrollmentService';

const AdminEnrollmentsScreen = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [statusFilter, setStatusFilter] = useState(null);
    const [menuVisible, setMenuVisible] = useState(false);

    const fetchEnrollments = async (status = null) => {
        try {
            setLoading(true);
            const data = await getAllEnrollments(status);
            setEnrollments(data);
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível carregar as inscrições.');
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchEnrollments(statusFilter);
    }, [statusFilter]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchEnrollments(statusFilter);
    };

    const handleComplete = (enrollment) => {
        Alert.alert(
            'Confirmar Aprovação',
            `Deseja aprovar a inscrição de ${enrollment.userName} na atividade "${enrollment.activityTitle}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { 
                    text: 'Aprovar', 
                    onPress: async () => {
                        try {
                            await completeEnrollment(enrollment.enrollmentId);
                            Alert.alert('Sucesso', 'Inscrição aprovada com sucesso!');
                            fetchEnrollments(statusFilter);
                        } catch (error) {
                            Alert.alert('Erro', 'Não foi possível aprovar a inscrição.');
                            console.error(error);
                        }
                    }
                }
            ]
        );
    };

    const handleCancel = (enrollment) => {
        Alert.alert(
            'Confirmar Reprovação',
            `Deseja reprovar a inscrição de ${enrollment.userName} na atividade "${enrollment.activityTitle}"?`,
            [
                { text: 'Não', style: 'cancel' },
                { 
                    text: 'Sim, reprovar', 
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await cancelEnrollment(enrollment.enrollmentId);
                            Alert.alert('Sucesso', 'Inscrição reprovada com sucesso!');
                            fetchEnrollments(statusFilter);
                        } catch (error) {
                            Alert.alert('Erro', 'Não foi possível reprovar a inscrição.');
                            console.error(error);
                        }
                    }
                }
            ]
        );
    };

    // Função para renderizar o status com cor apropriada
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
        
        return <Chip style={{ backgroundColor: color + '20' }}><Text style={{ color, fontWeight: 'bold' }}>{label}</Text></Chip>;
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Gerenciar Inscrições</Text>
                <Menu
                    visible={menuVisible}
                    onDismiss={() => setMenuVisible(false)}
                    anchor={
                        <Button 
                            onPress={() => setMenuVisible(true)} 
                            mode="outlined"
                            icon="filter-variant"
                        >
                            {statusFilter ? `Filtro: ${statusFilter}` : 'Filtrar'}
                        </Button>
                    }
                >
                    <Menu.Item onPress={() => {setStatusFilter(null); setMenuVisible(false);}} title="Todos" />
                    <Menu.Item onPress={() => {setStatusFilter('ENROLLED'); setMenuVisible(false);}} title="Inscritos" />
                    <Menu.Item onPress={() => {setStatusFilter('COMPLETED'); setMenuVisible(false);}} title="Concluídos" />
                    <Menu.Item onPress={() => {setStatusFilter('CANCELED'); setMenuVisible(false);}} title="Cancelados" />
                </Menu>
            </View>
            
            {loading && !refreshing ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#3D8B6D" />
                    <Text style={styles.loadingText}>Carregando inscrições...</Text>
                </View>
            ) : (
                <FlatList
                    data={enrollments}
                    keyExtractor={item => item.enrollmentId.toString()}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#3D8B6D']}
                        />
                    }
                    renderItem={({item}) => (
                        <Card style={styles.card}>
                            <Card.Title
                                title={item.activityTitle}
                                subtitle={`Usuário: ${item.userName}`}
                            />
                            <Card.Content>
                                <View style={styles.details}>
                                    <Text>Data de inscrição: {new Date(item.enrollmentDate).toLocaleDateString()}</Text>
                                    <View style={styles.statusContainer}>
                                        <Text>Status: </Text>
                                        {renderStatus(item.enrollmentStatus)}
                                    </View>
                                </View>
                            </Card.Content>
                            {item.enrollmentStatus === 'ENROLLED' && (
                                <Card.Actions style={styles.actions}>
                                    <Button onPress={() => handleCancel(item)} textColor="#D32F2F">Reprovar</Button>
                                    <Button onPress={() => handleComplete(item)} mode="contained" style={styles.approveButton}>Aprovar</Button>
                                </Card.Actions>
                            )}
                        </Card>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>
                                {statusFilter 
                                    ? `Nenhuma inscrição com status "${statusFilter}" encontrada.`
                                    : 'Nenhuma inscrição encontrada.'}
                            </Text>
                            <Button 
                                mode="outlined" 
                                onPress={onRefresh}
                                style={styles.refreshButton}
                            >
                                Atualizar
                            </Button>
                        </View>
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 8, 
        backgroundColor: '#f5f5f5' 
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 8,
    },
    title: { 
        fontSize: 20, 
        fontWeight: 'bold', 
    },
    card: { 
        marginVertical: 4, 
        marginHorizontal: 8, 
        backgroundColor: '#fff' 
    },
    details: {
        marginTop: 8,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    actions: { 
        justifyContent: 'flex-end' 
    },
    approveButton: { 
        backgroundColor: '#3D8B6D' 
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        color: '#666',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: { 
        textAlign: 'center', 
        marginBottom: 16, 
        color: '#666' 
    },
    refreshButton: {
        marginTop: 8,
    },
});

export default AdminEnrollmentsScreen;