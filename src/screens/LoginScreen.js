import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { login } from '../services/authService';

const logo = require('../assets/logo.png');

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Erro', 'Por favor, preencha o e-mail e a senha.');
            return;
        }

        setIsLoading(true);
        try {
            await login(email, password); 
            navigation.replace('MainApp');
        } catch (error) {
            console.error(error);
            Alert.alert('Erro no Login', 'E-mail ou senha inválidos. Por favor, tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.container}>
                <Image source={logo} style={styles.logo} />

                <Text variant="headlineLarge" style={styles.title}>
                    Donatify
                </Text>

                <Text variant="bodyLarge" style={styles.subtitle}>
                    Faça a diferença e ganhe pontos
                </Text>

                <TextInput
                    label="E-mail"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    mode="outlined"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    disabled={isLoading}
                />

                <TextInput
                    label="Senha"
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input}
                    mode="outlined"
                    secureTextEntry={!isPasswordVisible}
                    disabled={isLoading}
                    right={
                        <TextInput.Icon
                            icon={isPasswordVisible ? 'eye-off' : 'eye'}
                            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                        />
                    }
                />

                <TouchableOpacity onPress={() => console.log('Clicou em Esqueceu a senha')} disabled={isLoading}>
                    <Text style={styles.forgotPassword}>Esqueceu sua senha?</Text>
                </TouchableOpacity>

                <Button
                    mode="contained"
                    onPress={handleLogin}
                    style={styles.button}
                    labelStyle={styles.buttonLabel}
                    disabled={isLoading}
                >
                    {isLoading ? <ActivityIndicator animating={true} color="#fff" /> : 'Entrar'}
                </Button>

                <View style={styles.signupContainer}>
                    <Text>Não tem uma conta? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SignUp')} disabled={isLoading}>
                        <Text style={styles.signupLink}>Cadastre-se aqui!</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        marginBottom: 32,
        color: '#555',
    },
    input: {
        width: '100%',
        marginBottom: 12,
    },
    forgotPassword: {
        width: '100%',
        textAlign: 'right',
        marginBottom: 20,
        color: '#555',
        fontWeight: 'bold'
    },
    button: {
        width: '100%',
        paddingVertical: 8,
        backgroundColor: '#3D8B6D',
        borderRadius: 50,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    signupContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    signupLink: {
        fontWeight: 'bold',
        color: '#3D8B6D',
    },
});


export default LoginScreen;