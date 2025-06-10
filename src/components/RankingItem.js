import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Avatar } from 'react-native-paper';

const RankingItem = ({ rank, name, points }) => {
    return (
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                <Avatar.Text
                    size={32}
                    label={`#${rank}`}
                    style={styles.avatar}
                    labelStyle={styles.avatarLabel}
                />
                <Text style={styles.name}>{name}</Text>
            </View>
            <Text style={styles.points}>{points}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#F7F7F7',
        borderRadius: 12,
        marginBottom: 8,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        backgroundColor: '#EAEAEA',
    },
    avatarLabel: {
        color: '#333',
        fontWeight: 'bold',
        fontSize: 14,
    },
    name: {
        marginLeft: 12,
        fontSize: 16,
        fontWeight: '500',
    },
    points: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#3D8B6D', 
    },
});

export default RankingItem;