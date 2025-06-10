import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Avatar, Button, Chip } from 'react-native-paper';
import InfoField from '../components/InfoField';

const ProfileScreen = () => {
    return (
        <ScrollView style={styles.container}>
            <Card style={styles.card}>
                <Card.Content style={styles.summaryContainer}>
                    <Avatar.Image size={80} source={{ uri: 'https://via.placeholder.com/150' }} />
                    <View style={styles.summaryTextContainer}>
                        <Text variant="headlineSmall" style={styles.name}>João Silva</Text>
                        <Text style={styles.memberSince}>Membro desde Dezembro de 2023</Text>
                        <View style={styles.chipsContainer}>
                            <Chip icon="star" style={styles.chip}>1,100 pontos</Chip>
                            <Chip icon="check-all" style={styles.chip}>25 atividades</Chip>
                        </View>
                    </View>
                    <Button mode="outlined" onPress={() => { }} style={styles.editButton} labelStyle={styles.editButtonLabel}>Editar</Button>
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="titleLarge" style={styles.sectionTitle}>Informações Pessoais</Text>
                    <View style={styles.infoGrid}>
                        <InfoField label="Nome Completo" value="João Silva" />
                        <InfoField label="E-mail" value="joão@email.com" />
                    </View>
                    <View style={styles.infoGrid}>
                        <InfoField label="Telefone" value="(99) 99999-9999" />
                        <InfoField label="Endereço" value="Rua X, 123, UF" />
                    </View>
                </Card.Content>
            </Card>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    card: {
        margin: 16,
        backgroundColor: '#fff',
    },
    summaryContainer: {
        alignItems: 'center',
        flexDirection: 'row',
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
        marginBottom: 8,
    },
    chipsContainer: {
        flexDirection: 'row',
    },
    chip: {
        marginRight: 8,
        backgroundColor: '#E6F3EE'
    },
    editButton: {
        position: 'absolute',
        top: 16,
        right: 16,
    },
    editButtonLabel: {
        fontSize: 12,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 8,
    },
    infoGrid: {
        flexDirection: 'row',
    }
});

export default ProfileScreen;