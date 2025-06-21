import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons, ActivityIndicator, Menu, Divider, List } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createActivity, updateActivity, getAllOngs } from '../services/adminService';

const ActivityEditScreen = ({ route, navigation }) => {
    const existingActivity = route.params?.activity;
    const isEditing = !!existingActivity;

    // Log para debug
    useEffect(() => {
        if (existingActivity) {
            console.log('Dados da atividade recebidos:', existingActivity);
            console.log('Tipo da atividade:', existingActivity.type);
            console.log('Status da atividade:', existingActivity.status);
            console.log('ONG ID da atividade:', existingActivity.ongId);
        }
    }, [existingActivity]);

    const [title, setTitle] = useState(existingActivity?.title || '');
    const [description, setDescription] = useState(existingActivity?.description || '');
    const [pointsValue, setPointsValue] = useState(existingActivity?.pointsValue?.toString() || '');
    const [location, setLocation] = useState(existingActivity?.location || '');
    
    // Estados para as ONGs
    const [ongs, setOngs] = useState([]);
    const [selectedOng, setSelectedOng] = useState(null);
    const [ongMenuVisible, setOngMenuVisible] = useState(false);
    const [loadingOngs, setLoadingOngs] = useState(false);
    
    // Estados para tipo e status
    const [type, setType] = useState(existingActivity?.type?.toUpperCase() || 'EVENT');
    const [status, setStatus] = useState(existingActivity?.status?.toUpperCase() || 'ACTIVE');
    
    useEffect(() => {
        if (existingActivity) {
            if (existingActivity.type) {
                setType(existingActivity.type.toUpperCase());
            }
            if (existingActivity.status) {
                setStatus(existingActivity.status.toUpperCase());
            }
        }
    }, [existingActivity]);

    // Carregar a lista de ONGs
    useEffect(() => {
        const fetchOngs = async () => {
            setLoadingOngs(true);
            try {
                const response = await getAllOngs();
                setOngs(response.data);
                console.log('ONGs carregadas:', response.data);
                
                // Se estamos editando e temos um ongId, vamos pré-selecionar
                if (existingActivity?.ongId) {
                    setSelectedOng(existingActivity.ongId);
                    console.log('ONG pré-selecionada:', existingActivity.ongId);
                } else if (response.data.length > 0) {
                    // Se não temos uma ONG selecionada, vamos pré-selecionar a primeira da lista
                    setSelectedOng(response.data[0].id);
                    console.log('Primeira ONG selecionada por padrão:', response.data[0].id);
                }
            } catch (error) {
                console.error('Erro ao carregar ONGs:', error);
                Alert.alert('Erro', 'Não foi possível carregar a lista de ONGs.');
            } finally {
                setLoadingOngs(false);
            }
        };

        fetchOngs();
    }, [existingActivity]);

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

        if (!selectedOng) {
            Alert.alert('Erro', 'É necessário selecionar uma ONG para esta atividade.');
            return;
        }
        
        const formatISODate = (date) => date.toISOString().slice(0, 19);
        
        const activityData = {
            title, 
            description, 
            location, 
            type: type.toUpperCase(),
            status: status.toUpperCase(),
            pointsValue: parseInt(pointsValue, 10),
            startDate: formatISODate(startDate),
            endDate: formatISODate(endDate),
            ongId: selectedOng,
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
                
                {/* Seletor de ONG */}
                <Text style={styles.label}>ONG *</Text>
                <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => setOngMenuVisible(true)}
                >
                    <TextInput
                        label="Selecione uma ONG"
                        value={loadingOngs 
                            ? "Carregando ONGs..." 
                            : selectedOng 
                              ? ongs.find(ong => ong.id === selectedOng)?.name || ""
                              : ""}
                        editable={false}
                        mode="outlined"
                        right={<TextInput.Icon icon="menu-down" onPress={() => setOngMenuVisible(true)} />}
                        style={styles.input}
                    />
                </TouchableOpacity>
                
                <Menu
                    visible={ongMenuVisible}
                    onDismiss={() => setOngMenuVisible(false)}
                    anchor={{ x: 0, y: 0 }}
                    style={styles.menu}
                >
                    <ScrollView style={styles.menuScrollView}>
                        {ongs.length > 0 ? (
                            ongs.map((ong) => (
                                <Menu.Item
                                    key={ong.id}
                                    title={ong.name}
                                    onPress={() => {
                                        setSelectedOng(ong.id);
                                        setOngMenuVisible(false);
                                    }}
                                />
                            ))
                        ) : (
                            <Menu.Item title="Nenhuma ONG encontrada" disabled />
                        )}
                    </ScrollView>
                </Menu>
                
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
    dropdownButton: {
        width: '100%',
    },
    menu: {
        width: '90%',
        marginLeft: '5%',
        marginTop: 60
    },
    menuScrollView: {
        maxHeight: 200
    }
});

export default ActivityEditScreen;