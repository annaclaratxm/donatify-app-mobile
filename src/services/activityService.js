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

/** 
 * Obtém os detalhes de uma atividade específica.
 * @param {number} activityId - ID da atividade
 * @returns {Promise<Object>} - Dados da atividade
 */
export const getActivityDetail = async (activityId) => {
  try {
    const response = await api.get(`/activities/${activityId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar detalhes da atividade ${activityId}:`, error.response || error);
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

/** 
 * Obtém o status das inscrições do usuário para as atividades.
 * @returns {Promise<Object>} Objeto mapeando activityId para status de inscrição
 */
export const getUserActivityEnrollments = async () => {
  try {
    // Usamos o endpoint que fornece dados para o dashboard do usuário,
    // que deve incluir suas inscrições atuais
    const dashboardResponse = await api.get('/dashboard');
    
    // Transforma a lista de inscrições em um mapa de atividadeId -> status
    const enrollmentMap = {};
    
    // Extrair inscrições do dashboard se disponível
    if (dashboardResponse.data && dashboardResponse.data.enrollments && 
        Array.isArray(dashboardResponse.data.enrollments)) {
      dashboardResponse.data.enrollments.forEach(enrollment => {
        enrollmentMap[enrollment.activityId] = {
          status: enrollment.enrollmentStatus,
          enrollmentId: enrollment.enrollmentId
        };
      });
    }
    
    return enrollmentMap;
  } catch (error) {
    // Se for um erro 401 (Não autorizado) ou 403 (Proibido), apenas retornamos um objeto vazio
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn('Usuário não autenticado ou sem permissão para acessar inscrições');
      return {};
    }
    
    console.error('Erro ao buscar inscrições do usuário:', error.response || error);
    throw error;
  }
};