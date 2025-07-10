// services/validationService.js
import httpClient from './httpClient';
import ValidationModel from '../models/ValidationModel';

const validationService = {
  async getAll() {
    try {
      const response = await httpClient.get('/api/validations/getAll');
      return response.data.map(data => new ValidationModel(data));
    } catch (error) {
      console.error('Erreur lors de la récupération des validations:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const response = await httpClient.get(`/api/validations/get/${id}`);
      return new ValidationModel(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération de la validation:', error);
      throw error;
    }
  },

  async create(validationData) {
    try {
      const response = await httpClient.post('/api/validations/create', validationData);
      return new ValidationModel(response.data);
    } catch (error) {
      console.error('Erreur lors de la création de la validation:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      await httpClient.delete(`/api/validations/del/${id}`);
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de la validation:', error);
      throw error;
    }
  }
};

export default validationService;