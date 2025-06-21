
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, Chip, Button, Icon } from 'react-native-paper';

const ActivityCard = ({ activity, onParticipar, enrollmentInfo, onPress }) => {
    const categoryColor = activity.type === 'donation' ? '#A020F0' : '#2979FF'; 
    const categoryLabel = activity.type === 'donation' ? 'doação' : activity.type; 

    // Formata as datas que vêm da API
    const formattedStartDate = new Date(activity.startDate).toLocaleDateString('pt-BR');
    const formattedStartTime = new Date(activity.startDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const formattedEndTime = new Date(activity.endDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    // Verifica se o usuário está inscrito e o status da inscrição
    const isEnrolled = !!enrollmentInfo;
    const enrollmentStatus = enrollmentInfo?.status;


    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
            <Card style={styles.card}>
                <View style={styles.topRow}>
                    <Chip style={[styles.chip, { backgroundColor: categoryColor }]} textStyle={styles.chipText}>{categoryLabel}</Chip>
                    <View style={styles.statusRow}>
                        <Icon source="check-circle" color="#34C759" size={16} />
                        <Chip style={[styles.chip, styles.activeChip]} textStyle={[styles.chipText, styles.activeChipText]}>
                            {activity.status}
                        </Chip>
                    </View>
                </View>

            <Card.Content style={styles.content}>
                <Text variant="titleLarge" style={styles.title}>{activity.title}</Text>
                <Text variant="bodyMedium" style={styles.description}>{activity.description}</Text>

                <View style={styles.pointsContainer}>
                    <Icon source="flag-outline" size={24} color="#3D8B6D" />
                    <Text style={styles.pointsText}>{activity.pointsValue} pontos</Text>
                </View>

                <View style={styles.detailRow}>
                    <Icon source="calendar-blank-outline" size={20} color="#666" />
                    <Text style={styles.detailText}>{formattedStartDate}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Icon source="clock-outline" size={20} color="#666" />
                    <Text style={styles.detailText}>{`${formattedStartTime}h - ${formattedEndTime}h`}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Icon source="map-marker-outline" size={20} color="#666" />
                    <Text style={styles.detailText}>{activity.location}</Text>
                </View>
            </Card.Content>

            <Card.Actions>
                {!isEnrolled ? (
                    <Button
                        mode="contained"
                        onPress={onParticipar}
                        style={styles.button}
                        labelStyle={styles.buttonLabel}
                    >
                        Participar
                    </Button>
                ) : enrollmentStatus === 'COMPLETED' ? (
                    <Button
                        mode="contained"
                        disabled
                        style={[styles.button, styles.completedButton]}
                        labelStyle={styles.buttonLabel}
                        icon="check-circle"
                    >
                        Concluída
                    </Button>
                ) : (
                    <Button
                        mode="contained"
                        disabled
                        style={[styles.button, styles.disabledButton]}
                        labelStyle={styles.buttonLabel}
                        icon="clock"
                    >
                        Inscrito
                    </Button>
                )}
            </Card.Actions>
        </Card>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        margin: 8,
        backgroundColor: '#fff',
        elevation: 2,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingTop: 12,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    chip: {
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
        textTransform: 'capitalize',
    },
    chipText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    activeChip: {
        backgroundColor: 'transparent'
    },
    activeChipText: {
        color: '#34C759',
        fontWeight: 'normal',
        textTransform: 'capitalize',
    },
    content: {
        paddingTop: 12,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    description: {
        color: '#666',
        marginBottom: 16,
        minHeight: 40,
    },
    pointsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    pointsText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3D8B6D',
        marginLeft: 8,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailText: {
        marginLeft: 8,
        color: '#333',
    },
    button: {
        flex: 1,
        backgroundColor: '#3D8B6D',
        borderRadius: 8,
        margin: 8,
    },
    disabledButton: {
        backgroundColor: '#A5D6A7', 
    },
    completedButton: {
        backgroundColor: '#3D8B6D', 
    },
    buttonLabel: {
        fontWeight: 'bold',
    },
});

export default ActivityCard;