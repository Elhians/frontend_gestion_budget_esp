import React, { useContext, useState } from 'react';
import Card from '../components/Card';
import Table from '../components/Table';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import { AppContext } from '../App';
import ProfilUtilisateur from '../components/ProfilUtilisateur'

const AgentDashboard = () => {
  const { 
    besoins = [], 
    utilisateurActuel, 
    utilisateurs,
    ajouterBesoin, 
    mettreAJourBesoin, 
    supprimerBesoin,
    parametres
  } = useContext(AppContext);

  console.log('les besoins dans agent...:',besoins);
  
  const [formData, setFormData] = useState({
    description: '',
    categorie: '60 - Achats et variations de stocks',
    cout: ''
  });
  const [besoinEnEdition, setBesoinEnEdition] = useState(null);
  const [afficherFormulaireEdition, setAfficherFormulaireEdition] = useState(false);

  const soumettreFormulaire = (e) => {
    e.preventDefault();
    if (besoinEnEdition) {
      mettreAJourBesoin(besoinEnEdition.id, {
        description: formData.description,
        categorie: formData.categorie,
        cout: parseInt(formData.cout)
      });
      setBesoinEnEdition(null);
    } else {
      ajouterBesoin({
        description: formData.description,
        categorie: formData.categorie,
        cout: parseInt(formData.cout)
      });
    }
    reinitialiserFormulaire();
    setAfficherFormulaireEdition(false);
  };

  const gererChangement = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const modifierBesoin = (idBesoin) => {
    const besoinAModifier = besoins.find(besoin => besoin.id === idBesoin);
    if (besoinAModifier) {
      setBesoinEnEdition(besoinAModifier);
      setFormData({
        description: besoinAModifier.description,
        categorie: besoinAModifier.categorie,
        cout: besoinAModifier.cout
      });
      setAfficherFormulaireEdition(true);
    }
  };

  const supprimerBesoinAgent = (idBesoin) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce besoin ?')) {
      supprimerBesoin(idBesoin);
    }
  };

  const annulerEdition = () => {
    setBesoinEnEdition(null);
    reinitialiserFormulaire();
    setAfficherFormulaireEdition(false);
  };

  const reinitialiserFormulaire = () => {
    setFormData({
      description: '',
      categorie: '60 - Achats et variations de stocks',
      cout: ''
    });
  };

  const besoinsAgent = besoins.filter(besoin => {
    const auteur = utilisateurs.find(u => u.id === besoin.idAuteur);
    return auteur && auteur.id === utilisateurActuel.id;
  });

  return (
    <div>
        <ProfilUtilisateur />


      <Card title="Mes besoins soumis">
        <Table
          headers={['Description', 'Nomenclature', 'cout demandé', 'Statut', 'Actions']}
          data={besoinsAgent}
          renderRow={(besoin) => (
            <tr key={besoin.id}>
              <td>{besoin.description}</td>
              <td>{besoin.categorie}</td>
              <td>{besoin.cout.toLocaleString('fr-FR')} {parametres.devise}</td>
              <td><StatusBadge status={besoin.statut} /></td>
              <td className="action-buttons">
                {besoin.statut === 'Soumis' ? (
                  <>
                    <button className="btn-icon" onClick={() => modifierBesoin(besoin.id)}>✏️</button>
                    <button className="btn-icon" onClick={() => supprimerBesoinAgent(besoin.id)}>🗑️</button>
                  </>
                ) : 'Verrouillé'}
              </td>
            </tr>
          )}
        />
      </Card>

      {afficherFormulaireEdition ? (
        <Card title={`Modifier le besoin ${besoinEnEdition?.id}`}>
          <form onSubmit={soumettreFormulaire}>
            <div className="form-group">
              <label htmlFor="description">Description du besoin</label>
              <input 
                type="text" 
                id="description" 
                value={formData.description}
                onChange={gererChangement}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Nomenclature Budgétaire</label>
              <select 
                id="categorie" 
                value={formData.categorie}
                onChange={gererChangement}
                required
              >
                <option value="60 - Achats et variations de stocks">60 - Achats et variations de stocks</option>
                <option value="61 - Transports">61 - Transports</option>
                <option value="62 - Services extérieurs A">62 - Services extérieurs A</option>
                <option value="63 - Services extérieurs B">63 - Services extérieurs B</option>
                <option value="64 - Impôts et taxes">64 - Impôts et taxes</option>
                <option value="65 - Autres charges">65 - Autres charges</option>
                <option value="66 - Charges de personnel">66 - Charges de personnel</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="amount">cout estimé (en {parametres.devise})</label>
              <input 
                type="number" 
                id="cout" 
                value={formData.cout}
                onChange={gererChangement}
                required 
                min="0"
              />
            </div>
            <div className="form-actions">
              <Button type="secondary" onClick={annulerEdition}>Annuler</Button>
              <Button type="primary">Enregistrer</Button>
            </div>
          </form>
        </Card>
      ) : (
        <Card title="Exprimer un nouveau besoin budgétaire">
          <form onSubmit={soumettreFormulaire}>
            <div className="form-group">
              <label htmlFor="description">Description du besoin (Matériel, service...)</label>
              <input 
                type="text" 
                id="description" 
                value={formData.description}
                onChange={gererChangement}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Nomenclature Budgétaire</label>
              <select 
                id="categorie" 
                value={formData.categorie}
                onChange={gererChangement}
                required
              >
                <option value="60 - Achats et variations de stocks">60 - Achats et variations de stocks</option>
                <option value="61 - Transports">61 - Transports</option>
                <option value="62 - Services extérieurs A">62 - Services extérieurs A</option>
                <option value="63 - Services extérieurs B">63 - Services extérieurs B</option>
                <option value="64 - Impôts et taxes">64 - Impôts et taxes</option>
                <option value="65 - Autres charges">65 - Autres charges</option>
                <option value="66 - Charges de personnel">66 - Charges de personnel</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="amount">cout estimé (en {parametres.devise})</label>
              <input 
                type="number" 
                id="cout" 
                value={formData.cout}
                onChange={gererChangement}
                required 
                min="0"
              />
            </div>
            <Button type="primary">Soumettre le besoin</Button>
          </form>
        </Card>
      )}
    </div>
  );
};

export default AgentDashboard;