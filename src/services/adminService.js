import api from './api';

// --- Atividades ---
export const getAllActivities = () => api.get('/admin/activities');
export const getActivity = (id) => api.get(`/admin/activities/${id}`);
export const createActivity = (activityData) => api.post('/admin/activities', activityData);
export const updateActivity = (id, activityData) => api.patch(`/admin/activities/${id}`, activityData);
export const deleteActivity = (id) => api.delete(`/admin/activities/${id}`);

// --- Usuários ---
export const getAllUsers = () => api.get('/admin/users');
export const updateUserByAdmin = (id, userData) => api.patch(`/admin/users/${id}`, userData);
export const deleteUserByAdmin = (id) => api.delete(`/admin/users/${id}`);

// --- ONGs ---
export const getAllOngs = () => api.get('/admin/ongs');
export const getOng = (id) => api.get(`/admin/ongs/${id}`);
export const createOng = (ongData) => api.post('/admin/ongs', ongData);
export const updateOng = (id, ongData) => api.patch(`/admin/ongs/${id}`, ongData);
export const deleteOng = (id) => api.delete(`/admin/ongs/${id}`);

// --- Inscrições ---
/**
 * @param {string} status 
 */
export const getEnrollments = (status = '') => {
    const endpoint = status ? `/admin/enrollments?status=${status}` : '/admin/enrollments';
    return api.get(endpoint);
};


/**
 * Aprova uma inscrição, marcando-a como concluída e creditando pontos ao usuário.
 * @param {number} enrollmentId - ID da inscrição a ser aprovada
 * @returns {Promise<Object>} - Resposta da API
 */
export const approveEnrollment = (enrollmentId) => {
    return api.post(`/enrollments/${enrollmentId}/complete`);
};

/**
 * Cancela uma inscrição. Se já estiver concluída, deduz os pontos do usuário.
 * @param {number} enrollmentId - ID da inscrição a ser cancelada
 * @returns {Promise<Object>} - Resposta da API
 */
export const cancelEnrollment = (enrollmentId) => {
    return api.post(`/admin/enrollments/${enrollmentId}/cancel`);
};