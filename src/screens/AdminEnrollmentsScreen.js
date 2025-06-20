import React from 'react';
import { View, StyleSheet, Alert, FlatList } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';

const AdminEnrollmentsScreen = () => {
    
    const dummyEnrollments = [
        { enrollmentId: 1, userName: 'Maria Silva', activityTitle: 'Doação de Alimentos', enrollmentStatus: 'ENROLLED' },
        { enrollmentId: 2, userName: 'João Santos', activityTitle: 'Plantio de Árvores', enrollmentStatus: 'COMPLETED' },
    ];

    const handleApprove = (enrollment) => {
        alert(`Aprovar inscrição ${enrollment.enrollmentId} (API não implementada)`);
    };

    const handleReject = (enrollment) => {
        alert(`Reprovar inscrição ${enrollment.enrollmentId} (API não implementada)`);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Gerenciar Inscrições</Text>
            <FlatList
                data={dummyEnrollments}
                keyExtractor={item => item.enrollmentId.toString()}
                renderItem={({item}) => (
                    <Card style={styles.card}>
                        <Card.Title
                            title={item.activityTitle}
                            subtitle={`Usuário: ${item.userName}`}
                        />
                        <Card.Content>
                            <Text>Status: 
                                <Text style={{fontWeight: 'bold', color: item.enrollmentStatus === 'ENROLLED' ? '#FFA000' : '#3D8B6D' }}>
                                    {` ${item.enrollmentStatus}`}
                                </Text>
                            </Text>
                        </Card.Content>
                        {item.enrollmentStatus === 'ENROLLED' && (
                            <Card.Actions style={styles.actions}>
                                <Button onPress={() => handleReject(item)} textColor="red">Reprovar</Button>
                                <Button onPress={() => handleApprove(item)} mode="contained" style={styles.approveButton}>Aprovar</Button>
                            </Card.Actions>
                        )}
                    </Card>
                )}
                 ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma inscrição encontrada.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 8, backgroundColor: '#f5f5f5' },
    title: { fontSize: 20, fontWeight: 'bold', margin: 16 },
    card: { marginVertical: 4, marginHorizontal: 8, backgroundColor: '#fff' },
    actions: { justifyContent: 'flex-end' },
    approveButton: { backgroundColor: '#3D8B6D' },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#666' },
});

export default AdminEnrollmentsScreen;