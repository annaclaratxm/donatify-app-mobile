import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';

const SummaryCard = ({ title, value }) => (
    <Card style={styles.card}>
        <Card.Content>
            <Text style={styles.title}>{title}</Text>
            <Text variant="headlineMedium" style={styles.value}>{value}</Text>
        </Card.Content>
    </Card>
);

const styles = StyleSheet.create({
    card: {
        flex: 1,
        margin: 4,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 14,
        color: '#666',
    },
    value: {
        fontWeight: 'bold',
        color: '#3D8B6D', 
    },
});

export default SummaryCard;