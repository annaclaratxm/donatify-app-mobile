import api from './api';

export const getAvailableActivities = async () => {
    try {
        const response = await api.get('/activities');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar atividades:', error.response || error);
        throw error;
    }
};


/** Inscreve o usuário logado em uma atividade. **/
export const enrollInActivity = async (activityId) => {
  try {
    const response = await api.post(`/activities/${activityId}/enroll`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao se inscrever na atividade ${activityId}:`, error.response || error);
    throw error;
  }
};