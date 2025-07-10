import httpClient from './httpClient';

const authService = {
  async login(email, motDePasse) {
      console.log('azertyuiop',email,'',motDePasse);
    try {
        const response = await httpClient.post('/auth/login', {
            email,
            motDePasse: motDePasse
        });
      return response;
    } catch (error) {
      console.error('Erreur de connexion:', error.response?.data || error.message);
      throw error;
    }
  },

  async setPassword(token, newPassword) {
    try {
      const response = await httpClient.post('/auth/definir-mot-de-passe', { 
        token, 
        nouveau_mot_de_passe: newPassword
      });
      return response;
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default authService;