// services/departmentService.js
import httpClient from './httpClient';
import DepartmentModel from '../models/DepartmentModel';

const departmentService = {
  async getAll(token) {
    try {
      const response = await httpClient.get('/departements/getAll', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('la reponse departement : ',response);
      return response.map(data => new DepartmentModel(data));
    } catch (error) {
      console.error('Erreur lors de la récupération des départements:', error);
      throw error;
    }
  },

  async getById(id, token) {
    try {
      const response = await httpClient.get(`/departements/get/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return new DepartmentModel(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération du département:', error);
      throw error;
    }
  },

  async create(departmentData, token) {
    // console.log('donnes de crea envoye ',departmentData);
    try {
      const response = await httpClient.post('/departements/create', departmentData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      // console.log('la reponse CREEE : ',response);
      return new DepartmentModel({id:response.id,
        nom : response.nom,
        budget : response.budget,
        chef : null
      });
    } catch (error) {
      console.error('Erreur lors de la création du département:', error);
      throw error;
    }
  },

  async update(id, departmentData, token) {
    // console.log('donnes de crea envoye ',departmentData);
    try {
      const response = await httpClient.put(`/departements/up/${id}`, departmentData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      // console.log('la reponse maj : ',response);
      return new DepartmentModel({id:response.id,
        nom : response.nom,
        budget : response.budget,
        chef : departmentData.chef
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du département:', error);
      throw error;
    }
  },

  async delete(id, token) {
    try {
      await httpClient.delete(`/departements/del/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du département:', error);
      throw error;
    }
  }
};

export default departmentService;