// client/src/services/cautionService.js
import api from '../api'; // ton instance axios configurée

const cautionService = {
  // Liste avec filtres optionnels { status, client, commande, search }
  getAll: async (params = {}) => {
    const response = await api.get('/cautions', { params });
    return response.data.data ?? response.data;
  },

  // KPIs
  getStats: async () => {
    const response = await api.get('/cautions/stats');
    return response.data.data ?? response.data;
  },

  // Détail
  getById: async (id) => {
    const response = await api.get(`/cautions/${id}`);
    return response.data.data ?? response.data;
  },

  // Création manuelle
  create: async (data) => {
    const response = await api.post('/cautions', data);
    return response.data.data ?? response.data;
  },

  // Édition
  update: async (id, data) => {
    const response = await api.put(`/cautions/${id}`, data);
    return response.data.data ?? response.data;
  },

  // Restituer intégralement
  return: async (id, data = {}) => {
    const response = await api.patch(`/cautions/${id}/return`, data);
    return response.data.data ?? response.data;
  },

  // Déduire (partiel ou total)
  deduct: async (id, data) => {
    const response = await api.patch(`/cautions/${id}/deduct`, data);
    return response.data.data ?? response.data;
  },

  // Annuler restitution/déduction → retour à 'held'
  cancel: async (id) => {
    const response = await api.patch(`/cautions/${id}/cancel`);
    return response.data.data ?? response.data;
  },

  // Suppression (admin only)
  remove: async (id) => {
    const response = await api.delete(`/cautions/${id}`);
    return response.data;
  },
};

export default cautionService;