import api from './api';

/**
 * Marca uma inscrição como concluída e credita os pontos ao usuário.
 * @param {number} enrollmentId - ID da inscrição a ser completada
 * @returns {Promise<Object>} - Dados da inscrição completada
 */
export const completeEnrollment = async (enrollmentId) => {
  try {
    const response = await api.post(`/enrollments/${enrollmentId}/complete`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao completar a inscrição ${enrollmentId}:`, error.response || error);
    throw error;
  }
};

/**
 * Lista todas as inscrições (apenas para admin).
 * @param {string} [status] - Filtro opcional de status (ENROLLED, COMPLETED, CANCELED)
 * @returns {Promise<Array>} - Lista de inscrições
 */
export const getAllEnrollments = async (status) => {
  try {
    const url = status
      ? `/admin/enrollments?status=${status}`
      : '/admin/enrollments';
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar inscrições:', error.response || error);
    throw error;
  }
};

/**
 * Cancela/Invalida uma inscrição (apenas para admin).
 * Se a inscrição já estava concluída, os pontos serão deduzidos do total do usuário.
 * @param {number} enrollmentId - ID da inscrição a ser cancelada
 * @returns {Promise<Object>} - Dados da inscrição cancelada
 */
export const cancelEnrollment = async (enrollmentId) => {
  try {
    const response = await api.post(`/admin/enrollments/${enrollmentId}/cancel`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao cancelar a inscrição ${enrollmentId}:`, error.response || error);
    throw error;
  }
};

/**
 * Obtém as inscrições do usuário atual.
 * @returns {Promise<Array>} - Lista de inscrições do usuário
 */
export const getUserEnrollments = async () => {
  try {
    const response = await api.get('/users/me/enrollments');
    return response.data || [];
  } catch (error) {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn('Usuário não está autenticado ou não tem permissões para ver inscrições');
      return [];
    }
    console.error('Erro ao buscar inscrições do usuário:', error.response || error);
    throw error;
  }
};
