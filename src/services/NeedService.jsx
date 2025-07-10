import httpClient from './httpClient';
import NeedModel from '../models/NeedModel';
import UserModel from '../models/UserModel';
import userService from './UserService';

const needService = {
  // services/needService.js
async getAll(token) {
  try {
    const response = await httpClient.get('/besoins/getAll', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    // Transformez les besoins en incluant l'auteur
    const besoinsAvecAuteurs = await Promise.all(
      response.map(async besoin => {
        try {
          const auteur = await userService.getById(besoin.idAuteur, token);
          return {
            ...besoin,
            auteur: new UserModel(auteur)
          };
        } catch (error) {
          console.error(`Erreur lors du chargement de l'auteur ${besoin.idAuteur}:`, error);
          return besoin; // Retourne le besoin sans auteur en cas d'erreur
        }
      })
    );
    
    return besoinsAvecAuteurs.map(data => new NeedModel(data));
  } catch (error) {
    console.error('Erreur lors de la récupération des besoins:', error);
    throw error;
  }
},

  async getById(id, token) {
    try {
      const response = await httpClient.get(`/besoins/get/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return new NeedModel(response);
    } catch (error) {
      console.error('Erreur lors de la récupération du besoin:', error);
      throw error;
    }
  },

  async getByUserId(userId, token) {
    try {
      const response = await httpClient.get(`/besoins/user/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.map(data => new NeedModel(data));
    } catch (error) {
      console.error('Erreur lors de la récupération des besoins utilisateur:', error);
      throw error;
    }
  },

  async getByDepartmentForChef(token) {
    try {
      const response = await httpClient.get('/besoins/chef/dep', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.map(data => new NeedModel(data));
    } catch (error) {
      console.error('Erreur lors de la récupération des besoins département (chef):', error);
      throw error;
    }
  },

  async getByDepartmentForDir(departmentId, token) {
    try {
      const response = await httpClient.get(`/besoins/dir/dep/${departmentId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.map(data => new NeedModel(data));
    } catch (error) {
      console.error('Erreur lors de la récupération des besoins département (dir):', error);
      throw error;
    }
  },

  async create(needData, token) {
    try {
        console.log('les info',needData);
      const response = await httpClient.post('/besoins/create', needData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return new NeedModel(response);
    } catch (error) {
      console.error('Erreur lors de la création du besoin:', error);
      throw error;
    }
  },

  async update(id, needData, token) {
    try {
        console.log('le donnes de besoisn a maj ',id)
      const response = await httpClient.put(`/besoins/update/${id}`, needData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('la reponse ',response);
      return new NeedModel(response);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du besoin:', error);
      throw error;
    }
  },

  async delete(id, token) {
    try {
      await httpClient.delete(`/besoins/del/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du besoin:', error);
      throw error;
    }
  },

  async validateByChef(id, token) {
    try {
      const response = await httpClient.patch(`/besoins/${id}/valider/chef`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return new NeedModel(response);
    } catch (error) {
      console.error('Erreur lors de la validation par le chef:', error);
      throw error;
    }
  },

  async validateByDir(id, token) {
    try {
      const response = await httpClient.patch(`/besoins/${id}/valider/dir`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return new NeedModel(response);
    } catch (error) {
      console.error('Erreur lors de la validation par le directeur:', error);
      throw error;
    }
  }
};

export default needService;