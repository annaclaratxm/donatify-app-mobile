import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

const InfoField = ({ label, value }) => (
    <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.valueContainer}>
            <Text style={styles.value}>{value}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 8,
    },
    label: {
        color: '#666',
        marginBottom: 4,
        fontSize: 14,
    },
    valueContainer: {
        backgroundColor: '#F7F7F7',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#EAEAEA',
    },
    value: {
        fontSize: 16,
        color: '#333',
    },
});

export default InfoField;