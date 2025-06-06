import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';

const logo = require('../assets/logo.png');

const SignUpScreen = ({ navigation }) => {
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [endereco, setEndereco] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image source={logo} style={styles.logo} />

            <Text variant="headlineLarge" style={styles.title}>
                Donatify
            </Text>

            <Text variant="bodyLarge" style={styles.subtitle}>
                Junte-se à nossa comunidade
            </Text>

            <TextInput
                label="Nome completo"
                placeholder="Digite aqui seu nome completo"
                value={nome}
                onChangeText={setNome}
                style={styles.input}
                mode="outlined"
            />

            <TextInput
                label="Telefone"
                placeholder="(  ) ____-____"
                value={telefone}
                onChangeText={setTelefone}
                style={styles.input}
                mode="outlined"
                keyboardType="phone-pad"
            />

            <TextInput
                label="Endereço"
                placeholder="Seu endereço completo"
                value={endereco}
                onChangeText={setEndereco}
                style={styles.input}
                mode="outlined"
            />

            <TextInput
                label="E-mail"
                placeholder="seuememail@email.com"
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

            <Button
                mode="contained"
                onPress={() => console.log('Cadastro pressionado')}
                style={styles.button}
                labelStyle={styles.buttonLabel}
            >
                Cadastrar
            </Button>

            <View style={styles.loginContainer}>
                <Text>Já tem uma conta? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginLink}>Entre aqui!</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingVertical: 40,
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
        color: '#555',
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