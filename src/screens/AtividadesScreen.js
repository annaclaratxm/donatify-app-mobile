import React, { useState, useEffect, useMemo } from 'react'; 
import { View, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { Text, Searchbar, Button } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import ActivityCard from '../components/ActivityCard';
import { getAvailableActivities, enrollInActivity } from '../services/activityService';

const AtividadesScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [enrolledActivityIds, setEnrolledActivityIds] = useState([]);

    const isFocused = useIsFocused();

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getAvailableActivities();
            setActivities(data);
        } catch (e) {
            setError('Não foi possível carregar as atividades.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isFocused) {
            fetchData();
        }
    }, [isFocused]);

    const filteredActivities = useMemo(() => {
        if (!searchQuery) {
            return activities;
        }
        return activities.filter((activity) =>
            activity.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [activities, searchQuery]); 

    const handleParticipar = async (activity) => {
        try {
            await enrollInActivity(activity.id);
            Alert.alert('Sucesso!', `Você se inscreveu na atividade "${activity.title}".`);
            setEnrolledActivityIds(prevIds => [...prevIds, activity.id]);
        } catch (error) {
            const errorMessage = error.response?.data || 'Não foi possível se inscrever. Tente novamente.';
            Alert.alert('Erro', errorMessage);
        }
    };

    if (isLoading) {
        return <View style={styles.centerContainer}><ActivityIndicator animating={true} size="large" /></View>;
    }

    if (error) {
        return <View style={styles.centerContainer}><Text>{error}</Text><Button onPress={fetchData} style={{ marginTop: 10 }}>Tentar Novamente</Button></View>;
    }

    return (
        <View style={styles.container}>
            <Text variant="titleLarge" style={styles.title}>Atividades Disponíveis</Text>
            <Searchbar
                placeholder="Pesquisar por título..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchbar}
            />

            <FlatList
                data={filteredActivities}
                renderItem={({ item }) => (
                    <ActivityCard
                        activity={item}
                        onParticipar={() => handleParticipar(item)}
                        isEnrolled={enrolledActivityIds.includes(item.id)}
                    />
                )}
                keyExtractor={item => item.id.toString()}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma atividade encontrada.</Text>}
                contentContainerStyle={styles.list}
            />
        </View>
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
        padding: 20,
    },
    title: {
        fontWeight: 'bold',
        marginHorizontal: 16,
        marginTop: 16,
    },
    searchbar: {
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 8,
        backgroundColor: '#fff',
    },
    list: {
        paddingHorizontal: 8,
        paddingBottom: 8,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: '#666',
    }
});

export default AtividadesScreen;