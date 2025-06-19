import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert, ScrollView, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import { Text, Button, Card, IconButton, Modal, Portal, TextInput, ActivityIndicator, SegmentedButtons } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getAllActivities, createActivity, updateActivity, deleteActivity } from '../services/adminService';

const ActivityItem = ({ item, onEdit, onDelete }) => (

	<Card style={styles.itemCard}>
		<Card.Title
			title={item.title}
			subtitle={`Pontos: ${item.pointsValue} | Status: ${item.status.toLowerCase()}`}
			titleStyle={styles.cardTitle}
		/>

		<Card.Actions>
			<IconButton icon="pencil-outline" onPress={() => onEdit(item)} />
			<IconButton icon="delete-outline" iconColor="#B71C1C" onPress={() => onDelete(item)} />
		</Card.Actions>
	</Card>

);

const ActivityForm = ({ initialData, onSave, onCancel, isLoading }) => {
	const [title, setTitle] = useState(initialData?.title || '');
	const [description, setDescription] = useState(initialData?.description || '');
	const [pointsValue, setPointsValue] = useState(initialData?.pointsValue?.toString() || '');
	const [location, setLocation] = useState(initialData?.location || '');
	const [type, setType] = useState(initialData?.type || 'EVENT');
	const [status, setStatus] = useState(initialData?.status || 'ACTIVE');
	const [startDate, setStartDate] = useState(initialData?.startDate ? new Date(initialData.startDate) : new Date());
	const [endDate, setEndDate] = useState(initialData?.endDate ? new Date(initialData.endDate) : new Date());
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [datePickerField, setDatePickerField] = useState('start');

	const onDateChange = (event, selectedDate) => {
		setShowDatePicker(false);
		if (selectedDate) {
			if (datePickerField === 'start') setStartDate(selectedDate);
			else setEndDate(selectedDate);
		}
	};

	const showDatePickerFor = (field) => {
		setDatePickerField(field);
		setShowDatePicker(true);
	};

	const handleSave = () => {
		if (!title.trim() || !description.trim() || !pointsValue.trim() || !location.trim()) {
			Alert.alert('Erro', 'Título, Descrição, Pontos e Localização são obrigatórios.');
			return;
		}

		const activityData = {
			...initialData, title, description,
			pointsValue: parseInt(pointsValue, 10),
			location, type, status,
			startDate: startDate.toISOString(),
			endDate: endDate.toISOString(),
		};
		onSave(activityData);
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={styles.modalKeyboardAvoidingView}
		>

			<Card style={styles.modalCard}>
				<Card.Title title={initialData ? 'Editar Atividade' : 'Criar Atividade'} titleStyle={styles.modalTitle} />
				<ScrollView keyboardShouldPersistTaps="handled">
					<Card.Content>
						<TextInput label="Título *" value={title} onChangeText={setTitle} mode="outlined" style={styles.input} />
						<TextInput label="Descrição *" value={description} onChangeText={setDescription} mode="outlined" style={styles.input} multiline numberOfLines={3} />
						<TextInput label="Pontos *" value={pointsValue} onChangeText={setPointsValue} mode="outlined" style={styles.input} keyboardType="numeric" />
						<TextInput label="Localização *" value={location} onChangeText={setLocation} mode="outlined" style={styles.input} />
						<Text style={styles.label}>Tipo da Atividade</Text>
						<SegmentedButtons value={type} onValueChange={setType} style={styles.input} buttons={[{ value: 'EVENT', label: 'Evento' }, { value: 'DONATION', label: 'Doação' }, { value: 'VOLUNTEERING', label: 'Voluntariado' }]} />
						<Text style={styles.label}>Status</Text>
						<SegmentedButtons value={status} onValueChange={setStatus} style={styles.input} buttons={[{ value: 'ACTIVE', label: 'Ativa' }, { value: 'COMPLETED', label: 'Concluída' }, { value: 'CANCELED', label: 'Cancelada' }]} />
						<TouchableOpacity onPress={() => showDatePickerFor('start')}>
							<TextInput label="Data de Início" value={startDate.toLocaleDateString('pt-BR')} mode="outlined" style={styles.input} editable={false} right={<TextInput.Icon icon="calendar" />} />
						</TouchableOpacity>
						<TouchableOpacity onPress={() => showDatePickerFor('end')}>
							<TextInput label="Data de Fim" value={endDate.toLocaleDateString('pt-BR')} mode="outlined" style={styles.input} editable={false} right={<TextInput.Icon icon="calendar" />} />
						</TouchableOpacity>
					</Card.Content>
				</ScrollView>
				<Card.Actions>
					<Button onPress={onCancel} disabled={isLoading} textColor="#B71C1C">Cancelar</Button>
					<Button onPress={handleSave} mode="contained" loading={isLoading} disabled={isLoading} style={{ backgroundColor: '#3D8B6D' }}>Salvar</Button>
				</Card.Actions>
			</Card>
			{showDatePicker && (
				<DateTimePicker value={datePickerField === 'start' ? startDate : endDate} mode="date" display="default" onChange={onDateChange} />
			)}
		</KeyboardAvoidingView>
	);
};

const AdminActivitiesScreen = ({ navigation }) => {
	const [activities, setActivities] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedActivity, setSelectedActivity] = useState(null);
	const isFocused = useIsFocused();

	const loadActivities = async () => {
		setIsLoading(true);
		try {
			const response = await getAllActivities();
			setActivities(response.data);
		} catch (error) { Alert.alert('Erro', 'Não foi possível carregar as atividades.'); }
		finally { setIsLoading(false); }
	};

	useEffect(() => { if (isFocused) { loadActivities(); } }, [isFocused]);

	const handleOpenModal = (activity = null) => {
		setSelectedActivity(activity);
		setIsModalVisible(true);
	};

	const handleCloseModal = () => {
		setIsModalVisible(false);
		setSelectedActivity(null);
	};

	const handleSaveActivity = async (activityData) => {
		const isCreating = !selectedActivity;
		setIsLoading(true);
		try {
			if (isCreating) {
				await createActivity(activityData);
			} else {
				await updateActivity(selectedActivity.id, activityData);
			}
			await loadActivities();
			handleCloseModal();
		} catch (error) { Alert.alert('Erro', 'Não foi possível salvar a atividade.'); }
		finally { setIsLoading(false); }
	};

	const handleDeleteActivity = (activity) => {
		Alert.alert('Confirmar Deleção', `Tem certeza que deseja deletar a atividade "${activity.title}"?`,
			[

				{ text: 'Cancelar', style: 'cancel' },
				{
					text: 'Deletar', style: 'destructive', onPress: async () => {
						try {
							await deleteActivity(activity.id);
							await loadActivities();
						} catch (error) { Alert.alert('Erro', 'Não foi possível deletar a atividade.'); }
					}
				}
			]
		);
	};

	return (
		<View style={styles.container}>
			<Button icon="plus" mode="contained" onPress={() => handleOpenModal()} style={styles.addButton}>
				Criar Nova Atividade
			</Button>

			<FlatList
				data={activities}
				keyExtractor={item => item.id.toString()}
				renderItem={({ item }) => (<ActivityItem item={item} onEdit={handleOpenModal} onDelete={handleDeleteActivity} />)}
				onRefresh={loadActivities}
				refreshing={isLoading}
				ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma atividade encontrada.</Text>}
			/>

			<Portal>
				<Modal visible={isModalVisible} onDismiss={handleCloseModal} contentContainerStyle={styles.modalContainer}>
					<ActivityForm initialData={selectedActivity} onSave={handleSaveActivity} onCancel={handleCloseModal} isLoading={isLoading} />
				</Modal>
			</Portal>
		</View>
	);
};

const styles = StyleSheet.create({

	container: { flex: 1, padding: 8, backgroundColor: '#f5f5f5' },
	addButton: { margin: 8, backgroundColor: '#3D8B6D' },
	itemCard: { marginVertical: 4, marginHorizontal: 8 },
	cardTitle: { fontWeight: 'bold' },
	emptyText: { textAlign: 'center', marginTop: 50, color: '#666' },

	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		padding: 20,
	},
	modalKeyboardAvoidingView: {

	},

	modalCard: {
		maxHeight: '95%',
		padding: 8,
	},

	input: { marginBottom: 16, backgroundColor: '#fff' },

	label: {
		fontSize: 16,
		color: '#333',
		marginBottom: 8,
		marginLeft: 4
	},

	modalTitle: {
		fontWeight: 'bold',
		fontSize: 22,
		alignSelf: 'center',
		marginBottom: 10
	},

});

export default AdminActivitiesScreen;