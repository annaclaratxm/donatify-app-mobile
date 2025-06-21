import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert, ScrollView } from 'react-native';
import { Text, Button, Card, IconButton, Modal, Portal, TextInput, ActivityIndicator, Chip, SegmentedButtons } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import { getAllUsers, updateUserByAdmin, deleteUserByAdmin } from '../services/adminService';

const roles = [
    { label: 'Administrador', value: 'ADMIN' },
    { label: 'Usuário', value: 'USER' },
];

const getRoleLabel = (value) => {
    const found = roles.find(r => r.value === value);
    return found ? found.label : value;
};

const UserItem = ({ item, onEdit, onDelete }) => (
    <Card style={styles.itemCard}>
        <Card.Title
            title={item.nickname}
            subtitle={item.email}
            right={() => <Chip style={styles.chip}>{getRoleLabel(item.role)}</Chip>}
        />
        <Card.Actions>
            <IconButton icon="account-edit" iconColor="#3D8B6D" onPress={() => onEdit(item)} />
            <IconButton icon="delete" iconColor="#B71C1C" onPress={() => onDelete(item)} />
        </Card.Actions>
    </Card>
);

const UserForm = ({ initialData, onSave, onCancel, isLoading }) => {
    const [name, setName] = useState(initialData?.name || '');
    const [nickname, setNickname] = useState(initialData?.nickname || '');
    const [email, setEmail] = useState(initialData?.email || '');
    const [role, setRole] = useState(initialData?.role || 'USER');
    const [ongId, setOngId] = useState(initialData?.ongId?.toString() || '');
    
    const handleSave = () => {
        const finalOngId = ongId.trim() === '' ? null : parseInt(ongId, 10);
        const userData = { name, nickname, email, role, ongId: finalOngId };
        onSave(userData);
    };

    return (
        <Card style={styles.modalCard}>
            <Card.Title title="Editar Usuário" />
            <ScrollView>
                <Card.Content>
                    <TextInput label="Nome Completo" value={name} onChangeText={setName} mode="outlined" style={styles.input} />
                    <TextInput label="Nickname" value={nickname} onChangeText={setNickname} mode="outlined" style={styles.input} />
                    <TextInput label="Email" value={email} onChangeText={setEmail} mode="outlined" style={styles.input} keyboardType="email-address" />
                    <Text style={styles.label}>Perfil (Role)</Text>
                    <SegmentedButtons value={role} onValueChange={setRole} style={styles.input} buttons={[{ value: 'USER', label: 'Usuário' }, { value: 'ADMIN', label: 'Admin' }]} />
                </Card.Content>
            </ScrollView>
            <Card.Actions>
                <Button onPress={onCancel} disabled={isLoading}>Cancelar</Button>
                <Button onPress={handleSave} mode="contained" loading={isLoading} disabled={isLoading} style={styles.saveButton}>Salvar</Button>
            </Card.Actions>
        </Card>
    );
};

const AdminUsersScreen = ({ navigation }) => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const isFocused = useIsFocused();

    const loadUsers = async () => { setIsLoading(true); try { const response = await getAllUsers(); setUsers(response.data); } catch (error) { console.error("ERRO DETALHADO AO CARREGAR USUÁRIOS:", error.response?.data || error); Alert.alert('Erro', 'Não foi possível carregar os usuários.'); } finally { setIsLoading(false); } };
    useEffect(() => { if (isFocused) { loadUsers(); } }, [isFocused]);

    const handleOpenModal = (user) => { setSelectedUser(user); setIsModalVisible(true); };
    const handleCloseModal = () => { setIsModalVisible(false); setSelectedUser(null); };
    
    const handleSaveUser = async (userData) => {
        setIsLoading(true);
        try {
            await updateUserByAdmin(selectedUser.id, userData);
            await loadUsers();
            handleCloseModal();
        } catch (error) {
            console.error("ERRO AO ATUALIZAR USUÁRIO:", error.response?.data || error);
            const errorMessage = error.response?.data?.message || 'Não foi possível atualizar o usuário.';
            Alert.alert('Erro', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteUser = (user) => { Alert.alert('Confirmar Deleção', `Tem certeza que deseja deletar o usuário "${user.name}"?`, [ { text: 'Cancelar' }, { text: 'Deletar', style: 'destructive', onPress: async () => { try { await deleteUserByAdmin(user.id); await loadUsers(); } catch (error) { Alert.alert('Erro', 'Não foi possível deletar o usuário.'); } } } ]); };

    return (
        <View style={styles.container}>
            <FlatList
                data={users}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => ( <UserItem item={item} onEdit={handleOpenModal} onDelete={handleDeleteUser} /> )}
                onRefresh={loadUsers}
                refreshing={isLoading}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhum usuário encontrado.</Text>}
            />
            <Portal>
                <Modal visible={isModalVisible} onDismiss={handleCloseModal} contentContainerStyle={styles.modalContainer}>
                    {selectedUser && <UserForm initialData={selectedUser} onSave={handleSaveUser} onCancel={handleCloseModal} isLoading={isLoading} />}
                </Modal>
            </Portal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 8, backgroundColor: '#f5f5f5' },
    itemCard: { marginVertical: 4, marginHorizontal: 8, backgroundColor: '#fff' },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#666' },
    modalContainer: { padding: 20 },
    modalCard: { padding: 8, maxHeight: '90%' },
    input: { marginBottom: 12 },
    label: { marginBottom: 8, marginLeft: 4, color: '#333' },
    chip: { backgroundColor: '#E0E0E0' },
    saveButton: { backgroundColor: '#3D8B6D' }
});

export default AdminUsersScreen;