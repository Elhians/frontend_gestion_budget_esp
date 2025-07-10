import httpClient from './httpClient';
import ActivityLogModel from '../models/ActivityLogModel';

const activitylogservice = {
  // Récupérer tous les logs
  async getAll(token) {
    try {
      const response = await httpClient.get('/activitylogs', { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      return response.map(data => new ActivityLogModel(data));
    } catch (error) {
      console.error('Erreur lors de la récupération des logs d\'activité:', error);
      throw error;
    }
  },

  // Récupérer un log par ID
  async getById(id, token) {
    try {
      const response = await httpClient.get(`/activitylogs/${id}`, {
         headers: { Authorization: `Bearer ${token}` } 
      });
      return new ActivityLogModel(response);
    } catch (error) {
      console.error('Erreur lors de la récupération du log:', error);
      throw error;
    }
  },

  // Créer un nouveau log
  async create(logData, token) {
    try {
      const response = await httpClient.post('/activitylogs/', logData, {
         headers: { Authorization: `Bearer ${token}` } 
      });
      return new ActivityLogModel(response);
    } catch (error) {
      console.error('Erreur lors de la création du log:', error);
      throw error;
    }
  },

  // Mettre à jour un log
  async update(id, updatedData, token) {
    try {
      const response = await httpClient.put(`/activitylogs/${id}`, updatedData, {
         headers: { Authorization: `Bearer ${token}` } 
      });
      return new ActivityLogModel(response);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du log:', error);
      throw error;
    }
  },

  // Supprimer un log
  async remove(id, token) {
    try {
      await httpClient.delete(`/activitylogs/${id}`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du log:', error);
      throw error;
    }
  },

  // Supprimer tous les logs
  async removeAll(token) {
    try {
      await httpClient.delete('/activitylogs', { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de tous les logs:', error);
      throw error;
    }
  }
};

export default activitylogservice;