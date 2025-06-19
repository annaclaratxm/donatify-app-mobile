import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, Button, Card, IconButton, Modal, Portal, TextInput, ActivityIndicator, Chip } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import { getAllUsers, updateUserByAdmin, deleteUserByAdmin } from '../services/adminService';

// Componente para um item da lista de usuários
const UserItem = ({ item, onEdit, onDelete }) => (
	<Card style={styles.itemCard}>
		<Card.Title
			title={item.name}
			subtitle={item.email}
			right={() => <Chip>{item.role}</Chip>}
		/>
		<Card.Actions>
			<IconButton icon="account-edit" onPress={() => onEdit(item)} />
			<IconButton icon="delete" iconColor="red" onPress={() => onDelete(item)} />
		</Card.Actions>
	</Card>
);

// Formulário de edição do usuário
const UserForm = ({ initialData, onSave, onCancel, isLoading }) => {
	const [name, setName] = useState(initialData?.name || '');
	const [nickname, setNickname] = useState(initialData?.nickname || '');
	const [email, setEmail] = useState(initialData?.email || '');

	const handleSave = () => {
		const userData = { name, nickname, email };
		onSave(userData);
	};

	return (
		<Card style={styles.modalCard}>
			<Card.Title title="Editar Usuário" />
			<Card.Content>
				<TextInput label="Nome Completo" value={name} onChangeText={setName} mode="outlined" style={styles.input} />
				<TextInput label="Nickname" value={nickname} onChangeText={setNickname} mode="outlined" style={styles.input} />
				<TextInput label="Email" value={email} onChangeText={setEmail} mode="outlined" style={styles.input} keyboardType="email-address" />
			</Card.Content>
			<Card.Actions>
				<Button onPress={onCancel} disabled={isLoading}>Cancelar</Button>
				<Button onPress={handleSave} mode="contained" loading={isLoading} disabled={isLoading}>Salvar</Button>
			</Card.Actions>
		</Card>
	);
};

const AdminUsersScreen = () => {
	const [users, setUsers] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);

	const isFocused = useIsFocused();

	const loadUsers = async () => {
		setIsLoading(true);
		try {
			const response = await getAllUsers();
			setUsers(response.data);
		} catch (error) {
			console.error("ERRO DETALHADO AO CARREGAR USUÁRIOS:", error.response || error);
			Alert.alert('Erro', 'Não foi possível carregar os usuários.');
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (isFocused) { loadUsers(); }
	}, [isFocused]);

	const handleOpenModal = (user) => {
		setSelectedUser(user);
		setIsModalVisible(true);
	};

	const handleCloseModal = () => {
		setIsModalVisible(false);
		setSelectedUser(null);
	};

	const handleSaveUser = async (userData) => {
		setIsLoading(true);
		try {
			await updateUserByAdmin(selectedUser.id, userData);
			await loadUsers();
			handleCloseModal();
		} catch (error) {
			Alert.alert('Erro', 'Não foi possível atualizar o usuário.');
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeleteUser = (user) => {
		Alert.alert('Confirmar Deleção', `Tem certeza que deseja deletar o usuário "${user.name}"?`,
			[
				{ text: 'Cancelar' },
				{
					text: 'Deletar', style: 'destructive', onPress: async () => {
						try {
							await deleteUserByAdmin(user.id);
							await loadUsers();
						} catch (error) {
							Alert.alert('Erro', 'Não foi possível deletar o usuário.');
						}
					}
				}
			]
		);
	};

	return (
		<View style={styles.container}>
			<FlatList
				data={users}
				keyExtractor={item => item.id.toString()}
				renderItem={({ item }) => (
					<UserItem item={item} onEdit={handleOpenModal} onDelete={handleDeleteUser} />
				)}
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
	container: { flex: 1, padding: 8 },
	itemCard: { marginVertical: 4, marginHorizontal: 8 },
	emptyText: { textAlign: 'center', marginTop: 50 },
	modalContainer: { padding: 20 },
	modalCard: { padding: 8 },
	input: { marginBottom: 12 },
});

export default AdminUsersScreen;