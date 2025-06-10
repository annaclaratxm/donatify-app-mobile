import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

const ActivityDetailScreen = ({ route }) => {
    const { activityId } = route.params;

    return (
        <View style={styles.container}>
            <Text>Tela de Detalhes da Atividade</Text>
            <Text>ID da Atividade: {activityId}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ActivityDetailScreen;