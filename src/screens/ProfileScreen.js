import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Text, Card, Avatar, Button, Chip } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import InfoField from '../components/InfoField';
import { removeTokenAndEmail } from '../services/storageService';
import { getUserProfile } from '../services/userService';

const ProfileScreen = ({ navigation }) => {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const isFocused = useIsFocused();

    const fetchProfile = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getUserProfile();
            setUserData(data);
        } catch (e) {
            setError('Não foi possível carregar os dados do perfil.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isFocused) {
            fetchProfile();
        }
    }, [isFocused]);

    const handleLogout = async () => {
        await removeTokenAndEmail();
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    const confirmLogout = () => {
        Alert.alert(
            "Confirmar Saída",
            "Você tem certeza que deseja sair?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Sair", onPress: handleLogout, style: "destructive" }
            ]
        );
    };

    if (isLoading) {
        return <View style={styles.centerContainer}><ActivityIndicator size="large" /></View>;
    }

    if (error) {
        return <View style={styles.centerContainer}><Text>{error}</Text><Button onPress={fetchProfile}>Tentar Novamente</Button></View>;
    }

    const userInitial = userData?.nickname?.charAt(0).toUpperCase() || '';

    return (
        <ScrollView style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <View style={styles.summaryTopRow}>
                        <Avatar.Text size={80} label={userInitial} style={styles.avatar} labelStyle={styles.avatarLabel} />

                        <View style={styles.summaryTextContainer}>
                            <Text variant="headlineSmall" style={styles.name}>{userData?.name}</Text>
                            <Text style={styles.memberSince}>Membro desde {new Date(userData?.createdAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</Text>
                        </View>
                    </View>

                    <View style={styles.chipsContainer}>
                        <Chip icon="star" style={styles.chip}>{userData?.totalPoints} pontos</Chip>
                        <Chip icon="check-all" style={styles.chip}>-- atividades</Chip>
                    </View>

                    <Button
                        mode="outlined"
                        onPress={() => { }}
                        style={styles.editButton}
                        labelStyle={styles.editButtonLabel}
                        icon="pencil-outline"
                    >
                        Editar Perfil
                    </Button>
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="titleLarge" style={styles.sectionTitle}>Informações Pessoais</Text>
                    <View style={styles.infoGridContainer}>
                        <View style={styles.infoFieldWrapper}>
                            <InfoField label="Nome Completo" value={userData?.name} />
                        </View>
                        <View style={styles.infoFieldWrapper}>
                            <InfoField label="E-mail" value={userData?.email} />
                        </View>
                        <View style={styles.infoFieldWrapper}>
                            <InfoField label="Telefone" value={userData?.phone || 'Não informado'} />
                        </View>
                        <View style={styles.infoFieldWrapper}>
                            <InfoField label="Endereço" value={userData?.address || 'Não informado'} />
                        </View>
                    </View>
                </Card.Content>
            </Card>

            <View style={styles.logoutContainer}>
                <Button icon="logout" mode="contained" onPress={confirmLogout} style={styles.logoutButton}>
                    Sair
                </Button>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    card: {
        margin: 16,
        marginBottom: 0,
        backgroundColor: '#fff',
    },
    summaryTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatar: {
        backgroundColor: '#3D8B6D', 
    },
    avatarLabel: {
        fontSize: 40,
        color: '#fff',
    },
    summaryTextContainer: {
        flex: 1,
        marginLeft: 16,
    },
    name: {
        fontWeight: 'bold',
    },
    memberSince: {
        color: '#666',
        textTransform: 'capitalize',
    },
    chipsContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    chip: {
        marginRight: 8,
        backgroundColor: '#E6F3EE'
    },
    editButton: {
        borderColor: '#3D8B6D',
    },
    editButtonLabel: {
        fontSize: 14,
        color: '#3D8B6D',
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 8,
    },
    infoGridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -8, 
    },
    infoFieldWrapper: {
        width: '50%', 
        padding: 8, 
    },
    logoutContainer: {
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    logoutButton: {
        backgroundColor: '#B71C1C',
    }
});

export default ProfileScreen;