import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';

const logo = require('../assets/logo.png');

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
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
            />

            <TextInput
                label="Senha"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                mode="outlined"
                secureTextEntry={!isPasswordVisible} 
                right={
                    <TextInput.Icon
                        icon={isPasswordVisible ? 'eye-off' : 'eye'}
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    />
                }
            />

            <TouchableOpacity onPress={() => console.log('Clicou em Esqueceu a senha')}>
                <Text style={styles.forgotPassword}>Esqueveu sua senha?</Text>
            </TouchableOpacity>

            <Button
                mode="contained"
                onPress={() => navigation.replace('MainApp')}
                style={styles.button}
                labelStyle={styles.buttonLabel}
            >
                Entrar
            </Button>

            <View style={styles.signupContainer}>
                <Text>Não tem uma conta? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                    <Text style={styles.signupLink}>Cadastre-se aqui!</Text>
                </TouchableOpacity>
            </View>
        </View>
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