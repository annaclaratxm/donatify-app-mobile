import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, Button, Card, ActivityIndicator, SegmentedButtons } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import { getEnrollments, approveEnrollment, cancelEnrollment } from '../services/adminService';

// Componente para um item da lista de inscrições
const EnrollmentItem = ({ item, onApprove, onCancel }) => {
    const enrollmentDate = new Date(item.enrollmentDate).toLocaleDateString('pt-BR');

    return (
        <Card style={styles.itemCard}>
            <Card.Title
                title={item.activityTitle}
                subtitle={`Usuário: ${item.userName} (${item.userEmail})`}
                subtitleNumberOfLines={2}
            />
            <Card.Content>
                <Text style={styles.cardText}>Data da Inscrição: {enrollmentDate}</Text>
                <Text style={styles.cardText}>Status:
                    <Text style={{ fontWeight: 'bold', color: item.enrollmentStatus === 'ENROLLED' ? '#FFA000' : '#3D8B6D' }}>
                        {` ${item.enrollmentStatus}`}
                    </Text>
                </Text>
            </Card.Content>
            {item.enrollmentStatus === 'ENROLLED' && (
                <Card.Actions style={styles.actions}>
                    <Button onPress={() => onCancel(item)} textColor="red">Reprovar</Button>
                    <Button onPress={() => onApprove(item)} mode="contained" style={{ backgroundColor: '#3D8B6D' }}>Aprovar</Button>
                </Card.Actions>
            )}
        </Card>
    );
};


const AdminEnrollmentsScreen = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    // Estado para o filtro de status
    const [statusFilter, setStatusFilter] = useState('ENROLLED');
    const isFocused = useIsFocused();

    const loadEnrollments = async () => {
        setIsLoading(true);
        try {
            const response = await getEnrollments(statusFilter);
            setEnrollments(response.data);
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível carregar as inscrições.');
        } finally {
            setIsLoading(false);
        }
    };

    // Recarrega os dados quando a tela entra em foco ou quando o filtro muda
    useEffect(() => {
        if (isFocused) {
            loadEnrollments();
        }
    }, [isFocused, statusFilter]);

    const handleApprove = (enrollment) => {
        Alert.alert('Confirmar Aprovação', `Deseja aprovar a participação de ${enrollment.userName} na atividade "${enrollment.activityTitle}"? Os pontos serão creditados.`,
            [
                { text: 'Cancelar' },
                {
                    text: 'Aprovar', onPress: async () => {
                        try {
                            await approveEnrollment(enrollment.enrollmentId);
                            Alert.alert('Sucesso', 'Inscrição aprovada e pontos creditados!');
                            loadEnrollments(); // Recarrega a lista
                        } catch (error) {
                            Alert.alert('Erro', 'Não foi possível aprovar a inscrição.');
                        }
                    }
                }
            ]
        );
    };

    const handleCancel = (enrollment) => {
        Alert.alert('Confirmar Cancelamento', `Deseja cancelar/reprovar a inscrição de ${enrollment.userName} na atividade "${enrollment.activityTitle}"?`,
            [
                { text: 'Manter Inscrição' },
                {
                    text: 'Cancelar Inscrição', style: 'destructive', onPress: async () => {
                        try {
                            await cancelEnrollment(enrollment.enrollmentId);
                            Alert.alert('Sucesso', 'Inscrição cancelada.');
                            loadEnrollments(); // Recarrega a lista
                        } catch (error) {
                            Alert.alert('Erro', 'Não foi possível cancelar a inscrição.');
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <SegmentedButtons
                value={statusFilter}
                onValueChange={setStatusFilter}
                style={styles.filter}
                buttons={[
                    { value: 'ENROLLED', label: 'Pendentes' },
                    { value: 'COMPLETED', label: 'Concluídas' },
                    { value: 'CANCELED_BY_USER', label: 'Canceladas' },
                ]}
            />
            {isLoading ? (
                <ActivityIndicator style={{ marginTop: 50 }} size="large" />
            ) : (
                <FlatList
                    data={enrollments}
                    keyExtractor={item => item.enrollmentId.toString()}
                    renderItem={({ item }) => (
                        <EnrollmentItem item={item} onApprove={handleApprove} onCancel={handleCancel} />
                    )}
                    onRefresh={loadEnrollments}
                    refreshing={isLoading}
                    ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma inscrição encontrada para este status.</Text>}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    filter: { padding: 16 },
    itemCard: { marginVertical: 6, marginHorizontal: 16 },
    cardText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 4,
    },
    actions: {
        justifyContent: 'flex-end',
    },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#666' },
});

export default AdminEnrollmentsScreen;