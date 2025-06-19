import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Text, TextInput, Button, Modal, Portal, Card } from 'react-native-paper';
import { useUser } from '../context/UserContext';
import { updateUserProfile } from '../services/userService';

const FORBIDDEN_WORDS = [
    'merda', 'porra', 'caralho', 'puta', 'foder', 'viado', 'bicha', 'cuzao',
    'arrombado', 'idiota', 'imbecil', 'retardado', 'nazista', 'fascista',
    'racista', 'macaco', 'hitler', 'admin', 'administrador', 'adm',
    'root', 'suporte', 'moderador', 'mod'
];

const EditProfileScreen = ({ route, navigation }) => {
    const { reloadUser } = useUser();
    const { user } = route.params;

    // Estados do formulário principal
    const [name, setName] = useState(user.name);
    const [nickname, setNickname] = useState(user.nickname);
    const [phone, setPhone] = useState(user.phone || '');
    const [address, setAddress] = useState(user.address);
    const [isLoading, setIsLoading] = useState(false);

    // Estados para o Modal de alteração de senha
    const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSavingPassword, setIsSavingPassword] = useState(false);

    // Função para salvar dados do perfil (NOME, NICKNAME, ETC.)
    const handleSaveChanges = async () => {
        if (!name.trim() || !nickname.trim() || !address.trim()) {
            Alert.alert('Campos Obrigatórios', 'Nome, nickname e endereço não podem ficar vazios.');
            return;
        }
        const lowerCaseNickname = nickname.toLowerCase();
        if (FORBIDDEN_WORDS.some(word => lowerCaseNickname.includes(word))) {
            Alert.alert('Nickname Inválido', 'O apelido escolhido contém palavras não permitidas.');
            return;
        }

        setIsLoading(true);
        const updatedData = { name, nickname, phone, address };

        try {
            await updateUserProfile(updatedData);
            await reloadUser();
            Alert.alert('Sucesso', 'Seu perfil foi atualizado.', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível atualizar seu perfil. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    // Função para salvar a NOVA SENHA
    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('Erro', 'Todos os campos de senha são obrigatórios.');
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert('Erro', 'A nova senha e a confirmação não correspondem.');
            return;
        }
        if (newPassword.length < 6) { 
            Alert.alert('Erro', 'A nova senha deve ter no mínimo 6 caracteres.');
            return;
        }

        setIsSavingPassword(true);
        const passwordData = { currentPassword, newPassword };

        try {
            await updateUserProfile(passwordData); 
            Alert.alert('Sucesso', 'Sua senha foi alterada.');
            setIsPasswordModalVisible(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Não foi possível alterar a senha. Verifique sua senha atual.';
            Alert.alert('Erro', errorMessage);
        } finally {
            setIsSavingPassword(false);
        }
    };

    return (
        <Portal>
            <ScrollView style={styles.container}>
                <Text style={styles.title} variant="headlineSmall">Editar Perfil</Text>
                <TextInput label="Nome Completo *" value={name} onChangeText={setName} style={styles.input} mode="outlined" />
                <TextInput label="Nickname *" value={nickname} onChangeText={setNickname} style={styles.input} mode="outlined" />
                <TextInput label="Telefone" value={phone} onChangeText={setPhone} style={styles.input} mode="outlined" keyboardType="phone-pad" />
                <TextInput label="Endereço *" value={address} onChangeText={setAddress} style={styles.input} mode="outlined" />

                <Button
                    mode="text"
                    icon="lock-outline"
                    onPress={() => setIsPasswordModalVisible(true)}
                    style={{ alignSelf: 'flex-start', marginTop: 8 }}
                >
                    Alterar Senha
                </Button>

                <View style={styles.buttonContainer}>
                    <Button mode="outlined" onPress={() => navigation.goBack()} style={styles.cancelButton}>Cancelar</Button>
                    <Button mode="contained" onPress={handleSaveChanges} style={styles.saveButton} disabled={isLoading}>
                        {isLoading ? <ActivityIndicator animating={true} color="#fff" /> : 'Salvar'}
                    </Button>
                </View>
            </ScrollView>

            <Modal visible={isPasswordModalVisible} onDismiss={() => setIsPasswordModalVisible(false)} contentContainerStyle={styles.modalContainer}>
                <Card>
                    <Card.Title title="Alterar Senha" titleStyle={styles.modalTitle} />
                    <Card.Content>
                        <TextInput label="Senha Atual" secureTextEntry style={styles.input} mode="outlined" value={currentPassword} onChangeText={setCurrentPassword} />
                        <TextInput label="Nova Senha" secureTextEntry style={styles.input} mode="outlined" value={newPassword} onChangeText={setNewPassword} />
                        <TextInput label="Confirmar Nova Senha" secureTextEntry style={styles.input} mode="outlined" value={confirmPassword} onChangeText={setConfirmPassword} />
                    </Card.Content>
                    <Card.Actions style={styles.modalActions}>
                        <Button onPress={() => setIsPasswordModalVisible(false)} disabled={isSavingPassword}>Cancelar</Button>
                        <Button onPress={handleChangePassword} mode="contained" disabled={isSavingPassword} style={{ backgroundColor: '#3D8B6D' }}>
                            {isSavingPassword ? <ActivityIndicator animating={true} color="#fff" /> : 'Salvar Senha'}
                        </Button>
                    </Card.Actions>
                </Card>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { marginBottom: 24, fontWeight: 'bold', textAlign: 'center' },
    input: { marginBottom: 16 },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 32 },
    cancelButton: { flex: 1, marginRight: 8 },
    saveButton: { flex: 1, marginLeft: 8, backgroundColor: '#3D8B6D' },
    modalContainer: { padding: 20 },
    modalTitle: { fontWeight: 'bold' },
    modalActions: { paddingTop: 16, justifyContent: 'flex-end' }
});

export default EditProfileScreen;