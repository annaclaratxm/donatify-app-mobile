import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert, ActivityIndicator } from 'react-native';
import { Text, Button, Card, IconButton } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import { getAllActivities, deleteActivity } from '../services/adminService';

const ActivityItem = ({ item, onEdit, onDelete }) => (
    <Card style={styles.itemCard}>
        <Card.Title
            title={item.title}
            subtitle={`Pontos: ${item.pointsValue} | Status: ${item.status?.toLowerCase()}`}
            titleStyle={styles.cardTitle}
        />
        <Card.Actions>
            <IconButton icon="pencil-outline" onPress={() => onEdit(item)} />
            <IconButton icon="delete-outline" iconColor="#B71C1C" onPress={() => onDelete(item)} />
        </Card.Actions>
    </Card>
);

const AdminActivitiesScreen = ({ navigation }) => {
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const isFocused = useIsFocused();

    const loadActivities = async () => {
        setIsLoading(true);
        try {
            const response = await getAllActivities();
            setActivities(response.data);
        } catch (error) { 
            Alert.alert('Erro', 'Não foi possível carregar as atividades.');
        } finally { 
            setIsLoading(false); 
        }
    };

    useEffect(() => { 
        if (isFocused) { 
            loadActivities(); 
        } 
    }, [isFocused]);

    const handleEdit = (activity) => {
        navigation.navigate('ActivityEdit', { activity: activity });
    };

    const handleCreate = () => {
        navigation.navigate('ActivityEdit');
    };

    const handleDelete = (activity) => {
        Alert.alert('Confirmar Deleção', `Tem certeza que deseja deletar a atividade "${activity.title}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Deletar', style: 'destructive', onPress: async () => {
                        try {
                            await deleteActivity(activity.id);
                            await loadActivities(); 
                        } catch (error) { 
							console.error("ERRO AO DELETAR ATIVIDADE:", error.response?.data || error);
                            Alert.alert('Erro', 'Não foi possível deletar a atividade.'); 
                        }
                    }
                }
            ]
        );
    };

    if (isLoading && activities.length === 0) {
        return <ActivityIndicator style={{ flex: 1, justifyContent: 'center' }} size="large" />;
    }

    return (
        <View style={styles.container}>
            <Button icon="plus" mode="contained" onPress={handleCreate} style={styles.addButton}>
                Criar Nova Atividade
            </Button>
            <FlatList
                data={activities}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (<ActivityItem item={item} onEdit={handleEdit} onDelete={handleDelete} />)}
                onRefresh={loadActivities} 
                refreshing={isLoading}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma atividade encontrada.</Text>}
                contentContainerStyle={{ paddingBottom: 16 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 8, backgroundColor: '#f5f5f5' },
    addButton: { margin: 8, backgroundColor: '#3D8B6D' },
    itemCard: { marginVertical: 4, marginHorizontal: 8, backgroundColor: '#fff' },
    cardTitle: { fontWeight: 'bold' },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#666' },
});

export default AdminActivitiesScreen;