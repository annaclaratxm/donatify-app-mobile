import React, { useState, useEffect, useMemo } from 'react'; 
import { View, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { Text, Searchbar, Button } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import ActivityCard from '../components/ActivityCard';
import { getAvailableActivities, enrollInActivity, getUserActivityEnrollments } from '../services/activityService';

const AtividadesScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [enrollments, setEnrollments] = useState({});

    const isFocused = useIsFocused();

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            // Carrega as atividades primeiro
            try {
                const activitiesData = await getAvailableActivities();
                setActivities(activitiesData);
            } catch (activitiesError) {
                console.error('Erro ao carregar atividades:', activitiesError);
                setError('Não foi possível carregar as atividades.');
                return; // Não continua se não conseguir carregar as atividades
            }
            
            // Tenta carregar as inscrições do usuário separadamente
            try {
                const enrollmentsData = await getUserActivityEnrollments();
                setEnrollments(enrollmentsData);
            } catch (enrollmentsError) {
                console.error('Erro ao carregar inscrições:', enrollmentsError);
                // Não mostra erro para o usuário, apenas usa um objeto vazio para as inscrições
                setEnrollments({});
            }
        } catch (e) {
            console.error('Erro inesperado ao carregar dados:', e);
            setError('Ocorreu um erro inesperado.');
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
            const response = await enrollInActivity(activity.id);
            Alert.alert('Sucesso!', `Você se inscreveu na atividade "${activity.title}".`);
            
            // Atualiza o estado de inscrições com a nova inscrição
            setEnrollments(prev => ({
                ...prev,
                [activity.id]: {
                    status: 'ENROLLED',
                    enrollmentId: response.enrollmentId
                }
            }));
        } catch (error) {
            // Se for um erro de autenticação, podemos informar ao usuário
            if (error.response && error.response.status === 401) {
                Alert.alert(
                    'Autenticação necessária', 
                    'Você precisa estar logado para se inscrever em atividades.',
                    [
                        { text: 'OK' }
                    ]
                );
            } else {
                const errorMessage = error.response?.data || 'Não foi possível se inscrever. Tente novamente.';
                Alert.alert('Erro', errorMessage);
            }
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
                        enrollmentInfo={enrollments[item.id]}
                        onPress={() => navigation.navigate('ActivityDetail', { activityId: item.id })}
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