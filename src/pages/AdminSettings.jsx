import React, { useContext } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { AppContext } from '../App';

const AdminSettings = () => {
  const { parametres, mettreAJourParametres } = useContext(AppContext);
  const [formData, setFormData] = React.useState({
    anneeBudgetaire: parametres.anneeBudgetaire,
    dateLimiteSoumission: parametres.dateLimiteSoumission,
    notificationsActivees: parametres.notificationsActivees,
    devise: parametres.devise
  });

  const soumettreFormulaire = async (e) => {
    e.preventDefault();
    try {
      await mettreAJourParametres(formData);
      alert('Paramètres système mis à jour avec succès.');
    } catch (error) {
      alert('Erreur lors de la mise à jour des paramètres: ' + error.message);
    }
  };

  const gererChangement = (e) => {
    const { id, value, type, checked } = e.target;
    const fieldName = id.replace('setting-', '');
    
    setFormData(prev => ({
      ...prev,
      [fieldName]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div id="admin-settings" className="admin-tab">
      <Card title="Paramètres Système">
        <form onSubmit={soumettreFormulaire}>
          <div className="form-group">
            <label htmlFor="setting-anneeBudgetaire">Année Budgétaire</label>
            <input
              type="text"
              id="setting-anneeBudgetaire"
              value={formData.anneeBudgetaire}
              onChange={gererChangement}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="setting-dateLimiteSoumission">Date limite de soumission</label>
            <input
              type="date"
              id="setting-dateLimiteSoumission"
              value={formData.dateLimiteSoumission}
              onChange={gererChangement}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="setting-notificationsActivees">Activer les notifications</label>
            <select
              id="setting-notificationsActivees"
              value={formData.notificationsActivees.toString()}
              onChange={gererChangement}
              required
            >
              <option value="true">Oui</option>
              <option value="false">Non</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="setting-devise">Devise</label>
            <select
              id="setting-devise"
              value={formData.devise}
              onChange={gererChangement}
              required
            >
              <option value="XOF">FCFA</option>
              <option value="EUR">Euro</option>
              <option value="USD">Dollar US</option>
            </select>
          </div>
          <Button type="admin">Enregistrer les paramètres</Button>
        </form>
      </Card>
    </div>
  );
};

export default AdminSettings;