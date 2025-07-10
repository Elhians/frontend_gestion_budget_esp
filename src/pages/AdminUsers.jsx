import React, { useContext, useState } from 'react';
import Card from '../components/Card';
import Table from '../components/Table';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import { AppContext } from '../App';

const AdminUsers = () => {
  const { 
    utilisateurs, 
    departements,
    ajouterUtilisateur,
    basculerStatutUtilisateur, 
    mettreAJourUtilisateur, 
    supprimerUtilisateur 
  } = useContext(AppContext);

  const [afficherModal, setAfficherModal] = useState(false);
  const [idUtilisateurEnEdition, setIdUtilisateurEnEdition] = useState(null);
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    role: 'ENSEIGNANT',
    departement: '',
    motDePasse: '',
    statut: 'active'
  });

  const obtenirLibelleRole = (role) => {
    const roles = {
      'ENSEIGNANT': 'Enseignant',
      'CHEF_DEPARTEMENT': 'Chef de Département',
      'DIRECTEUR': 'Direction',
      'ADMIN': 'Administrateur',
      'AGENT': 'Agent administratif'
    };
    return roles[role] || role;
  };

  const gererChampFormulaire = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const gererClicAjouter = () => {
    setFormData({
      prenom: '',
      nom: '',
      email: '',
      role: 'ENSEIGNANT',
      departement: '',
      motDePasse: '',
      statut: 'active'
    });
    setIdUtilisateurEnEdition(null);
    setAfficherModal(true);
  };

  const gererClicModifier = (idUtilisateur) => {
    const utilisateurAModifier = utilisateurs.find(u => u.id === idUtilisateur);
    
    setFormData({
      prenom: utilisateurAModifier.prenom,
      nom: utilisateurAModifier.nom,
      email: utilisateurAModifier.email,
      role: utilisateurAModifier.role,
      departement: utilisateurAModifier.idDepartementAppartenance || '',
      motDePasse: '',
      statut: utilisateurAModifier.statut || 'inactive'
    });
    
    setIdUtilisateurEnEdition(idUtilisateur);
    setAfficherModal(true);
  };

  const soumettreFormulaire = (e) => {
    e.preventDefault();
    
    if (idUtilisateurEnEdition) {
      // Modification
      const donneesMaj = {
        prenom: formData.prenom,
        nom: formData.nom,
        email: formData.email,
        role: formData.role,
        idDepartementAppartenance: formData.departement ? parseInt(formData.departement) : null,
        statut: formData.statut
      };
      
      mettreAJourUtilisateur(idUtilisateurEnEdition, donneesMaj);
    } else {
      // Ajout
      const nouvelUtilisateur = {
        prenom: formData.prenom,
        nom: formData.nom,
        email: formData.email,
        role: formData.role,
        idDepartementAppartenance: formData.departement ? parseInt(formData.departement) : null,
        motDePasse: formData.motDePasse,
        statut: formData.statut
      };
      console.log(nouvelUtilisateur);
      
      ajouterUtilisateur(nouvelUtilisateur);
    }
    
    setAfficherModal(false);
    setFormData({
      prenom: '',
      nom: '',
      email: '',
      role: 'ENSEIGNANT',
      departement: '',
      motDePasse: '',
      statut: 'active'
    });
    setIdUtilisateurEnEdition(null);
  };

  return (
    <div id="admin-users" className="admin-tab">
      <Card 
        title="Gestion des Utilisateurs"
        headerActions={
          <Button type="admin" onClick={gererClicAjouter}>
            + Ajouter un utilisateur
          </Button>
        }
      >
        <Table
          headers={['Nom', 'Email', 'Rôle', 'Département', 'Statut', 'Actions']}
          data={utilisateurs}
          renderRow={(user) => (
            <tr key={user.id}>
              <td>{user.prenom} {user.nom}</td>
              <td>{user.email}</td>
              <td>{obtenirLibelleRole(user.role)}</td>
              <td>{departements.find(d => d.id === user.idDepartementAppartenance)?.nom || '-'}</td>
              <td><StatusBadge status={user.statut} /></td>
              <td className="action-buttons">
                <button className="btn-icon" onClick={() => gererClicModifier(user.id)}>✏️</button>
                <button className="btn-icon" onClick={() => supprimerUtilisateur(user.id)}>🗑️</button>
                {user.statut === 'active' ? (
                  <Button type="danger" size="sm" onClick={() => basculerStatutUtilisateur(user.id, 'inactive')}>
                    Désactiver
                  </Button>
                ) : (
                  <Button type="success" size="sm" onClick={() => basculerStatutUtilisateur(user.id, 'active')}>
                    Activer
                  </Button>
                )}
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
              <h2>{idUtilisateurEnEdition ? 'Modifier utilisateur' : 'Ajouter un nouvel utilisateur'}</h2>
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
                <label htmlFor="firstname">Prénom</label>
                <input
                  type="text"
                  id="prenom"
                  name="prenom"
                  value={formData.prenom}
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
                <label htmlFor="lastname">Nom</label>
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
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
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
                <label htmlFor="role">Rôle</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={gererChampFormulaire}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '15px',
                    borderRadius: '5px',
                    border: '1px solid #ddd'
                  }}
                >
                  <option value="ENSEIGNANT">Enseignant</option>
                  <option value="CHEF_DEPARTEMENT">Chef de Département</option>
                  <option value="DIRECTEUR">Direction</option>
                  <option value="ADMIN">Administrateur</option>
                  <option value="AGENT">Agent administratif</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="department">Département</label>
                <select
                  id="departement"
                  name="departement"
                  value={formData.departement}
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
                  {departements.map(dept => (
                    <option key={dept.id} value={dept.id}>
                      {dept.nom}
                    </option>
                  ))}
                </select>
              </div>
              
              {!idUtilisateurEnEdition && (
                <div className="form-group">
                  <label htmlFor="password">Mot de passe temporaire</label>
                  <input
                    type="password"
                    id="motDePasse"
                    name="motDePasse"
                    value={formData.motDePasse}
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
              )}
              
              <div className="form-group">
                <label htmlFor="status">Statut</label>
                <select
                  id="statut"
                  name="statut"
                  value={formData.statut}
                  onChange={gererChampFormulaire}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '15px',
                    borderRadius: '5px',
                    border: '1px solid #ddd'
                  }}
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </select>
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

export default AdminUsers;