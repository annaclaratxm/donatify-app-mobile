import api from './api';

// --- Atividades ---
export const getAllActivities = () => api.get('/admin/activities');
export const createActivity = (activityData) => api.post('/admin/activities', activityData);
export const updateActivity = (id, activityData) => api.put(`/admin/activities/${id}`, activityData);
export const deleteActivity = (id) => api.delete(`/admin/activities/${id}`);

// --- Usuários ---
export const getAllUsers = () => api.get('/admin/users');
export const updateUserByAdmin = (id, userData) => api.put(`/admin/users/${id}`, userData);
export const deleteUserByAdmin = (id) => api.delete(`/admin/users/${id}`);

// --- ONGs ---
export const getAllOngs = () => api.get('/admin/ongs');
export const createOng = (ongData) => api.post('/admin/ongs', ongData);
export const updateOng = (id, ongData) => api.put(`/admin/ongs/${id}`, ongData);
export const deleteOng = (id) => api.delete(`/admin/ongs/${id}`);

// --- Inscrições ---
/**
 * @param {string} status 
 */
export const getEnrollments = (status = '') => {
    const endpoint = status ? `/admin/enrollments?status=${status}` : '/admin/enrollments';
    return api.get(endpoint);
};


export const approveEnrollment = (enrollmentId) => {
    return api.post(`/enrollments/${enrollmentId}/complete`);
};


export const cancelEnrollment = (enrollmentId) => {
    return api.post(`/admin/enrollments/${enrollmentId}/cancel`);
};