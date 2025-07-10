import httpClient from './httpClient';
import UserModel from '../models/UserModel';

const userService = {
  async getAll(token) {
    try {
      const response = await httpClient.get('/utilisateurs/getAll', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('la reponse utilisateurs : ',response);
      return response.map(data => new UserModel(data));
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw error;
    }
  },

  async getById(id, token) {
    try {
      const response = await httpClient.get(`/utilisateurs/get/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return new UserModel(response);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      throw error;
    }
  },

  async create(userData, token) {
    try {
      const response = await httpClient.post('/utilisateurs/create', userData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return new UserModel(response);
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      throw error;
    }
  },

  async update(id, userData, token) {
    try {
      const response = await httpClient.put(`/utilisateurs/update/${id}`, userData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return new UserModel(response);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      throw error;
    }
  },

  async delete(id, token) {
    try {
      await httpClient.delete(`/utilisateurs/del/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      throw error;
    }
  }
};

export default userService;