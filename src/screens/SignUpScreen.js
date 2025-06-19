import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { register } from '../services/authService';
import { MaskedTextInput } from 'react-native-mask-text';

const logo = require('../assets/logo.png');

const FORBIDDEN_WORDS = [
    'merda', 'porra', 'caralho', 'puta', 'foder', 'viado', 'bicha', 'cuzao',
    'arrombado', 'idiota', 'imbecil', 'retardado', 'nazista', 'fascista',
    'racista', 'macaco', 'hitler', 'admin', 'administrador', 'adm',
    'root', 'suporte', 'moderador', 'mod'
];


const SignUpScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [nickname, setNickname] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        if (!name.trim() || !email.trim() || !password.trim() || !address.trim() || !nickname.trim()) {
            Alert.alert('Campos Obrigatórios', 'Por favor, preencha nome, nickname, e-mail, senha e endereço.');
            return;
        }

        const lowerCaseNickname = nickname.toLowerCase();
        for (const forbiddenWord of FORBIDDEN_WORDS) {
            if (lowerCaseNickname.includes(forbiddenWord)) {
                Alert.alert('Nickname Inválido', 'O apelido escolhido contém palavras não permitidas. Por favor, escolha outro.');
                return;
            }
        }

        setIsLoading(true);

        const userData = {
            name, nickname, email, password, phone, address,
        };

        try {
            await register(userData);
            Alert.alert(
                'Sucesso!',
                'Seu cadastro foi realizado com sucesso. Por favor, faça o login para continuar.',
                [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
            );
        } catch (error) {
            if (error.response && error.response.data === 'Email já cadastrado') {
                Alert.alert('Erro', 'Este e-mail já está em uso. Por favor, utilize outro.');
            } else {
                Alert.alert('Erro', 'Não foi possível realizar o cadastro. Tente novamente.');
                console.error(error);
            }
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <Image source={logo} style={styles.logo} />
                <Text variant="headlineLarge" style={styles.title}>Donatify</Text>
                <Text variant="bodyLarge" style={styles.subtitle}>Junte-se à nossa comunidade</Text>

                <TextInput label="Nome completo *" value={name} onChangeText={setName} style={styles.input} mode="outlined" disabled={isLoading} />
                <TextInput label="Nickname *" placeholder="Como os outros verão você" value={nickname} onChangeText={setNickname} style={styles.input} mode="outlined" disabled={isLoading} />
                <TextInput
                    label="Telefone"
                    keyboardType="numeric"
                    style={styles.input}
                    mode="outlined"
                    disabled={isLoading}
                    value={phone}
                    render={(props) =>
                        <MaskedTextInput
                            {...props}
                            mask="(99) 99999-9999"
                            onChangeText={(formatted, extracted) => {
                                setPhone(extracted);
                            }}
                        />
                    }
                />
                <TextInput label="Endereço *" value={address} onChangeText={setAddress} style={styles.input} mode="outlined" disabled={isLoading} />
                <TextInput label="E-mail *" value={email} onChangeText={setEmail} style={styles.input} mode="outlined" keyboardType="email-address" autoCapitalize="none" disabled={isLoading} />
                <TextInput
                    label="Senha *"
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input}
                    mode="outlined"
                    secureTextEntry={!isPasswordVisible}
                    right={<TextInput.Icon icon={isPasswordVisible ? 'eye-off' : 'eye'} onPress={() => setIsPasswordVisible(!isPasswordVisible)} />}
                    disabled={isLoading}
                />

                <Button
                    mode="contained"
                    onPress={handleRegister}
                    style={styles.button}
                    labelStyle={styles.buttonLabel}
                    disabled={isLoading}
                >
                    {isLoading ? <ActivityIndicator animating={true} color="#fff" /> : 'Cadastrar'}
                </Button>

                <View style={styles.loginContainer}>
                    <Text>Já tem uma conta? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={isLoading}>
                        <Text style={styles.loginLink}>Entre aqui!</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 20, 
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        marginBottom: 32,
        color: '#666',
    },
    input: {
        width: '100%',
        marginBottom: 12,
    },
    button: {
        width: '100%',
        paddingVertical: 8,
        backgroundColor: '#3D8B6D',
        borderRadius: 50,
        marginTop: 10,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    loginLink: {
        fontWeight: 'bold',
        color: '#3D8B6D',
    },
});

export default SignUpScreen;