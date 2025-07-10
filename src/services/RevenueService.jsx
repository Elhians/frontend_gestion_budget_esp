import httpClient from './httpClient';
import RevenueModel from '../models/RevenueModel';

const revenueService = {
  // Récupérer tous les revenus
  async getAll(token) {
    try {
      const response = await httpClient.get('/revenus', { headers: { Authorization: `Bearer ${token}` } });
      return response.map(data => new RevenueModel(data));
    } catch (error) {
      console.error("Erreur lors de la récupération des revenus :", error);
      throw error;
    }
  },

  // Récupérer un revenu par ID
  async getById(id, token) {
    try {
      const response = await httpClient.get(`/revenus/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      return new RevenueModel(response);
    } catch (error) {
      console.error("Erreur lors de la récupération du revenu :", error);
      throw error;
    }
  },

  // Créer un revenu
  async create(data, token) {
    try {
      const response = await httpClient.post('/revenus', data, { headers: { Authorization: `Bearer ${token}` } });
      return new RevenueModel(response);
    } catch (error) {
      console.error("Erreur lors de la création du revenu :", error);
      throw error;
    }
  },

  // Mettre à jour un revenu
  async update(id, data, token) {
    try {
      const response = await httpClient.put(`/revenus/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
      return new RevenueModel(response);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du revenu :", error);
      throw error;
    }
  },

  // Supprimer un revenu
  async remove(id, token) {
    try {
      await httpClient.delete(`/revenus/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression du revenu :", error);
      throw error;
    }
  },

  // Supprimer tous les revenus
  async removeAll(token) {
    try {
      await httpClient.delete('/revenus', { headers: { Authorization: `Bearer ${token}` } });
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression de tous les revenus :", error);
      throw error;
    }
  }
};

export default revenueService;