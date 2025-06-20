import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons, ActivityIndicator } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createActivity, updateActivity } from '../services/adminService';

const ActivityEditScreen = ({ route, navigation }) => {
    const existingActivity = route.params?.activity;
    const isEditing = !!existingActivity;

    const [title, setTitle] = useState(existingActivity?.title || '');
    const [description, setDescription] = useState(existingActivity?.description || '');
    const [pointsValue, setPointsValue] = useState(existingActivity?.pointsValue?.toString() || '');
    const [location, setLocation] = useState(existingActivity?.location || '');
    const [type, setType] = useState(existingActivity?.type || 'EVENT');
    const [status, setStatus] = useState(existingActivity?.status || 'ACTIVE');
    const [startDate, setStartDate] = useState(existingActivity?.startDate ? new Date(existingActivity.startDate) : new Date());
    const [endDate, setEndDate] = useState(existingActivity?.endDate ? new Date(existingActivity.endDate) : new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [datePickerField, setDatePickerField] = useState('start');
    const [isLoading, setIsLoading] = useState(false);

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            if (datePickerField === 'start') {
                setStartDate(selectedDate);
            } else {
                setEndDate(selectedDate);
            }
        }
    };

    const showDatePickerFor = (field) => {
        setDatePickerField(field);
        setShowDatePicker(true);
    };

    const handleSave = async () => {
        if (!title.trim() || !description.trim() || !pointsValue.trim() || !location.trim()) {
            Alert.alert('Erro', 'Título, Descrição, Pontos e Localização são obrigatórios.');
            return;
        }
        
        const formatISODate = (date) => date.toISOString().slice(0, 19);
        
        const activityData = {
            title, description, location, type, status,
            pointsValue: parseInt(pointsValue, 10),
            startDate: formatISODate(startDate),
            endDate: formatISODate(endDate),
        };
        if(isEditing) {
            activityData.id = existingActivity.id;
        }

        setIsLoading(true);
        try {
            if (isEditing) {
                await updateActivity(existingActivity.id, activityData);
            } else {
                await createActivity(activityData);
            }
            Alert.alert('Sucesso', `Atividade ${isEditing ? 'atualizada' : 'criada'} com sucesso!`);
            navigation.goBack(); 
        } catch (error) {
            console.error("Erro ao salvar atividade:", error.response?.data || error);
            Alert.alert('Erro', `Não foi possível salvar a atividade.`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1, backgroundColor: '#fff' }}
        >
            <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
                <Text style={styles.title} variant="headlineSmall">{isEditing ? 'Editar Atividade' : 'Criar Nova Atividade'}</Text>
                
                <TextInput label="Título *" value={title} onChangeText={setTitle} mode="outlined" style={styles.input} />
                <TextInput label="Descrição *" value={description} onChangeText={setDescription} mode="outlined" style={styles.input} multiline numberOfLines={3} />
                <TextInput label="Pontos *" value={pointsValue} onChangeText={setPointsValue} mode="outlined" style={styles.input} keyboardType="numeric" />
                <TextInput label="Localização *" value={location} onChangeText={setLocation} mode="outlined" style={styles.input} />
                
                <Text style={styles.label}>Tipo da Atividade</Text>
                <SegmentedButtons value={type} onValueChange={setType} style={styles.input} buttons={[{ value: 'EVENT', label: 'Evento' }, { value: 'DONATION', label: 'Doação' }, { value: 'VOLUNTEERING', label: 'Voluntariado' }]}/>

                <Text style={styles.label}>Status</Text>
                <SegmentedButtons value={status} onValueChange={setStatus} style={styles.input} buttons={[{ value: 'ACTIVE', label: 'Ativa' }, { value: 'COMPLETED', label: 'Concluída' }, { value: 'CANCELED', label: 'Cancelada' }]}/>

                <TouchableOpacity onPress={() => showDatePickerFor('start')}>
                    <TextInput label="Data de Início" value={startDate.toLocaleDateString('pt-BR')} mode="outlined" style={styles.input} editable={false} right={<TextInput.Icon icon="calendar" />} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => showDatePickerFor('end')}>
                    <TextInput label="Data de Fim" value={endDate.toLocaleDateString('pt-BR')} mode="outlined" style={styles.input} editable={false} right={<TextInput.Icon icon="calendar" />} />
                </TouchableOpacity>
                
                <View style={styles.buttonContainer}>
                    <Button mode="outlined" onPress={() => navigation.goBack()} style={styles.cancelButton}>Cancelar</Button>
                    <Button mode="contained" onPress={handleSave} style={styles.saveButton} disabled={isLoading}>
                        {isLoading ? <ActivityIndicator animating={true} color="#fff" /> : 'Salvar'}
                    </Button>
                </View>
            </ScrollView>
            {showDatePicker && (
                <DateTimePicker value={datePickerField === 'start' ? startDate : endDate} mode="date" display="default" onChange={onDateChange}/>
            )}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { marginBottom: 24, fontWeight: 'bold', textAlign: 'center' },
    input: { marginBottom: 16 },
    label: { fontSize: 16, color: '#333', marginBottom: 8, marginLeft: 4 },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, marginBottom: 48 },
    cancelButton: { flex: 1, marginRight: 8, borderColor: '#757575' },
    saveButton: { flex: 1, marginLeft: 8, backgroundColor: '#3D8B6D' },
});

export default ActivityEditScreen;