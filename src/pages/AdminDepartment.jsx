import React, { useContext, useState, useEffect } from 'react';
import Card from '../components/Card';
import Table from '../components/Table';
import Button from '../components/Button';
import { AppContext } from '../App';

const AdminDepartments = () => {
  const { 
    departements, 
    utilisateurs, 
    ajouterDepartement,
    mettreAJourDepartement,
    supprimerDepartement,
    parametres,
  } = useContext(AppContext);
  
  const [afficherModal, setAfficherModal] = useState(false);
  const [idDepartementEnEdition, setIdDepartementEnEdition] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    code: '',
    chef: '',
    budget: ''
  });
  const [localDepartements, setLocalDepartements] = useState(departements);

  // Synchroniser localDepartements quand departements change
  useEffect(() => {
    setLocalDepartements(departements);
  }, [departements]);

  const genererCodeDepartement = (nom) => {
    if (!nom) return '';
    return nom.split(' ')
      .filter(word => word.length > 0) // Filtrer les mots vides
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 3);
  };

  const obtenirNomChef = (idChef) => {
    const chef = utilisateurs.find(u => u.id === idChef);
    return chef ? `${chef.prenom} ${chef.nom}` : 'Non attribué';
  };

  const gererChampFormulaire = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      
      // Génération automatique du code quand le nom change
      if (name === 'nom') {
        newData.code = genererCodeDepartement(value);
      }
      
      return newData;
    });
  };

  const gererClicAjouter = () => {
    setFormData({
      nom: '',
      code: '',
      chef: '',
      budget: ''
    });
    setIdDepartementEnEdition(null);
    setAfficherModal(true);
  };

  const gererClicModifier = (idDepartement) => {
    const departementAModifier = localDepartements.find(d => d.id === idDepartement);
    if (!departementAModifier) return;
    
    setFormData({
      nom: departementAModifier.nom,
      code: departementAModifier.code || genererCodeDepartement(departementAModifier.nom),
      chef: departementAModifier.chef || '',
      budget: departementAModifier.budget?.toString() || ''
    });
    
    setIdDepartementEnEdition(idDepartement);
    setAfficherModal(true);
  };

  const soumettreFormulaire = async (e) => {
    e.preventDefault();
    
    const donneesDepartement = {
      nom: formData.nom.trim(),
      code: formData.code || genererCodeDepartement(formData.nom),
      chef: formData.chef ? parseInt(formData.chef) : null,
      budget: parseInt(formData.budget) || 0
    };

    
    try {
      if (idDepartementEnEdition) {
        await mettreAJourDepartement(idDepartementEnEdition, donneesDepartement);
      } else {
        await ajouterDepartement(donneesDepartement);
      }
      
      setAfficherModal(false);
      setFormData({
        nom: '',
        code: '',
        chef: '',
        budget: '' 
      });
      setIdDepartementEnEdition(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du département:", error);
    }
  };

  const gererClicSupprimer = async (idDepartement) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce département ? Cette action est irréversible.')) {
      try {
        await supprimerDepartement(idDepartement);
      } catch (error) {
        console.error("Erreur lors de la suppression du département:", error);
      }
    }
  };

  return (
    <div id="admin-departments" className="admin-tab">
      <Card 
        title="Gestion des Départements"
        headerActions={
          <Button type="admin" onClick={gererClicAjouter}>
            + Ajouter un département
          </Button>
        }
      >
        <Table
          headers={['Nom', 'Code', 'Chef de département', 'Budget N-1', 'Actions']}
          data={localDepartements}
          renderRow={(dept) => (
            <tr key={dept.id}>
              <td>{dept.nom}</td>
              <td>
                {dept.nom?.split(' ')
                  .map(word => word[0]?.toUpperCase() || '')
                  .join('')}
              </td>
              <td>{obtenirNomChef(dept.chef)}</td>
              <td>{dept.budget ? dept.budget.toLocaleString('fr-FR') : '0'} {parametres.devise} </td>
              <td className="action-buttons">
                <button 
                  className="btn-icon" 
                  onClick={() => gererClicModifier(dept.id)}
                  aria-label="Modifier"
                >
                  ✏️
                </button>
                <button 
                  className="btn-icon" 
                  onClick={() => gererClicSupprimer(dept.id)}
                  aria-label="Supprimer"
                >
                  🗑️
                </button>
              </td>
            </tr>
          )}
        />
      </Card>

      {afficherModal && (
        <div className="modal" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '500px',
            maxWidth: '90%'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2>{idDepartementEnEdition ? 'Modifier département' : 'Ajouter un nouveau département'}</h2>
              <button 
                onClick={() => setAfficherModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer'
                }}
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={soumettreFormulaire}>
              <div className="form-group">
                <label htmlFor="nom">Nom du département</label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={gererChampFormulaire}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '15px',
                    borderRadius: '5px',
                    border: '1px solid #ddd'
                  }}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="code">Code</label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={gererChampFormulaire}
                  required
                  readOnly
                  style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '15px',
                    borderRadius: '5px',
                    border: '1px solid #ddd',
                    backgroundColor: '#f5f5f5'
                  }}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="chef">Chef de département</label>
                <select
                  id="chef"
                  name="chef"
                  value={formData.chef}
                  onChange={gererChampFormulaire}
                  style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '15px',
                    borderRadius: '5px',
                    border: '1px solid #ddd'
                  }}
                >
                  <option value="">-- Sélectionner --</option>
                  {utilisateurs
                    .filter(user => user.role === 'CHEF_DEPARTEMENT')
                    .map(user => (
                      <option key={user.id} value={user.id}>
                        {user.prenom} {user.nom}
                      </option>
                    ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="budget">Budget initial (FCFA)</label>
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={gererChampFormulaire}
                  min="0"
                  style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '15px',
                    borderRadius: '5px',
                    border: '1px solid #ddd'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <Button 
                  type="danger" 
                  onClick={() => setAfficherModal(false)}
                  style={{ marginRight: '10px' }}
                >
                  Annuler
                </Button>
                <Button type="admin" onClick={soumettreFormulaire}>
                  Enregistrer
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDepartments;