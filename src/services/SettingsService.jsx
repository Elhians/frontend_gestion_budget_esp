import httpClient from './httpClient';
import SettingsModel from '../models/SettingsModel';

const settingsService = {
  async get(token) {
    try {
      const response = await httpClient.get('/settings', {
        headers: { 
            Authorization: `Bearer ${token}` 
        } 
    });
      return new SettingsModel(response);
    } catch (error) {
      console.error("Erreur lors de la récupération des paramètres :", error);
      throw error;
    }
  },

  
  async update(data, token) {
    try {
      const response = await httpClient.put('/settings', data, {
         headers: { 
            Authorization: `Bearer ${token}` 
        } 
    });
      return new SettingsModel(response);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des paramètres :", error);
      throw error;
    }
  }
};

export default settingsService;