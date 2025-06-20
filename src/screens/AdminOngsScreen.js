import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, Button, Card, IconButton, Modal, Portal, TextInput, ActivityIndicator } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import { getAllOngs, createOng, updateOng, deleteOng } from '../services/adminService';

const OngItem = ({ item, onEdit, onDelete }) => (
    <Card style={styles.itemCard}>
        <Card.Title title={item.name} />
        <Card.Actions>
            <IconButton icon="pencil-outline" iconColor="#3D8B6D" onPress={() => onEdit(item)} />
            <IconButton icon="delete-outline" iconColor="#B71C1C" onPress={() => onDelete(item)} />
        </Card.Actions>
    </Card>
);

const OngForm = ({ initialData, onSave, onCancel, isLoading }) => {
    const [name, setName] = useState(initialData?.name || '');
    
    const handleSave = () => {
        if (!name.trim()) {
            Alert.alert('Erro', 'O nome da ONG é obrigatório.');
            return;
        }
        onSave({ name });
    };

    return (
        <Card style={styles.modalCard}>
            <Card.Title title={initialData ? 'Editar ONG' : 'Criar Nova ONG'} />
            <Card.Content>
                <TextInput label="Nome da ONG" value={name} onChangeText={setName} mode="outlined" style={styles.input} />
            </Card.Content>
            <Card.Actions>
                <Button onPress={onCancel} disabled={isLoading}>Cancelar</Button>
                <Button onPress={handleSave} mode="contained" loading={isLoading} disabled={isLoading} style={styles.saveButton}>Salvar</Button>
            </Card.Actions>
        </Card>
    );
};

const AdminOngsScreen = () => {
    const [ongs, setOngs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedOng, setSelectedOng] = useState(null);
    const isFocused = useIsFocused();

    const loadOngs = async () => { setIsLoading(true); try { const response = await getAllOngs(); setOngs(response.data); } catch (error) { Alert.alert('Erro', 'Não foi possível carregar as ONGs.'); } finally { setIsLoading(false); } };
    useEffect(() => { if (isFocused) { loadOngs(); } }, [isFocused]);

    const handleOpenModal = (ong = null) => { setSelectedOng(ong); setIsModalVisible(true); };
    const handleCloseModal = () => { setIsModalVisible(false); setSelectedOng(null); };

    const handleSaveOng = async (ongData) => { setIsLoading(true); try { if (selectedOng) { await updateOng(selectedOng.id, ongData); } else { await createOng(ongData); } await loadOngs(); handleCloseModal(); } catch (error) { Alert.alert('Erro', 'Não foi possível salvar a ONG.'); } finally { setIsLoading(false); } };
    const handleDeleteOng = (ong) => { Alert.alert('Confirmar Deleção', `Tem certeza que deseja deletar a ONG "${ong.name}"?`, [ { text: 'Cancelar' }, { text: 'Deletar', style: 'destructive', onPress: async () => { try { await deleteOng(ong.id); await loadOngs(); } catch (error) { Alert.alert('Erro', 'Não foi possível deletar a ONG.'); } } } ]); };

    return (
        <View style={styles.container}>
            <Button icon="plus" mode="contained" onPress={() => handleOpenModal()} style={styles.addButton}>
                Criar Nova ONG
            </Button>
            <FlatList
                data={ongs}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => ( <OngItem item={item} onEdit={handleOpenModal} onDelete={handleDeleteOng} /> )}
                onRefresh={loadOngs}
                refreshing={isLoading}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma ONG encontrada.</Text>}
            />
            <Portal>
                <Modal visible={isModalVisible} onDismiss={handleCloseModal} contentContainerStyle={styles.modalContainer}>
                    <OngForm initialData={selectedOng} onSave={handleSaveOng} onCancel={handleCloseModal} isLoading={isLoading} />
                </Modal>
            </Portal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 8, backgroundColor: '#f5f5f5' },
    addButton: { margin: 8, backgroundColor: '#3D8B6D' },
    itemCard: { marginVertical: 4, marginHorizontal: 8, backgroundColor: '#fff' },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#666' },
    modalContainer: { padding: 20 },
    modalCard: { padding: 8 },
    input: { marginBottom: 12 },
    saveButton: { backgroundColor: '#3D8B6D' },
});

export default AdminOngsScreen;