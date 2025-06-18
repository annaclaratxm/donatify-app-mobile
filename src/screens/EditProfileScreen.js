import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
// import { updateUserProfile } from '../services/userService'; 

const FORBIDDEN_WORDS = [
    'merda', 'porra', 'caralho', 'puta', 'foder', 'viado', 'bicha', 'cuzao',
    'arrombado', 'idiota', 'imbecil', 'retardado', 'nazista', 'fascista',
    'racista', 'macaco', 'hitler', 'admin', 'administrador', 'adm',
    'root', 'suporte', 'moderador', 'mod'
];

const EditProfileScreen = ({ route, navigation }) => {
    const { user } = route.params;

    const [name, setName] = useState(user.name);
    const [nickname, setNickname] = useState(user.nickname);
    const [phone, setPhone] = useState(user.phone);
    const [address, setAddress] = useState(user.address);
    const [isLoading, setIsLoading] = useState(false);

    const handleSaveChanges = async () => {
        if (!name.trim() || !nickname.trim() || !address.trim()) {
            Alert.alert('Campos Obrigatórios', 'Nome, nickname e endereço não podem ficar vazios.');
            return;
        }

        const lowerCaseNickname = nickname.toLowerCase();
        for (const forbiddenWord of FORBIDDEN_WORDS) {
            if (lowerCaseNickname.includes(forbiddenWord)) {
                Alert.alert('Nickname Inválido', 'O apelido escolhido contém palavras não permitidas.');
                return;
            }
        }

        Alert.alert('Funcionalidade Pendente', 'A API para salvar o perfil ainda não foi implementada no back-end.');
        // A lógica abaixo será usada quando o back-end estiver pronto
        /*
        setIsLoading(true);
        const updatedData = { name, nickname, phone, address };
        try {
          await updateUserProfile(updatedData);
          Alert.alert('Sucesso', 'Seu perfil foi atualizado.', [
            { text: 'OK', onPress: () => navigation.goBack() }
          ]);
        } catch (error) {
          Alert.alert('Erro', 'Não foi possível atualizar seu perfil. Tente novamente.');
        } finally {
          setIsLoading(false);
        }
        */
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title} variant="headlineSmall">Editar Perfil</Text>

            <TextInput label="Nome Completo *" value={name} onChangeText={setName} style={styles.input} mode="outlined" />
            <TextInput label="Nickname *" value={nickname} onChangeText={setNickname} style={styles.input} mode="outlined" />
            <TextInput label="Telefone" value={phone} onChangeText={setPhone} style={styles.input} mode="outlined" keyboardType="phone-pad" />
            <TextInput label="Endereço *" value={address} onChangeText={setAddress} style={styles.input} mode="outlined" />

            <Button
                mode="contained"
                onPress={handleSaveChanges}
                style={styles.button}
                disabled={isLoading}
            >
                {isLoading ? <ActivityIndicator animating={true} color="#fff" /> : 'Salvar Alterações'}
            </Button>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    title: {
        marginBottom: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 8,
        padding: 8,
        backgroundColor: '#3D8B6D',
    }
});

export default EditProfileScreen;