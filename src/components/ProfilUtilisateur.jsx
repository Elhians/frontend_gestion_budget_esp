import React, { useContext, useState } from 'react';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import { AppContext } from '../App';

const ProfilUtilisateur = () => {
  const { 
    utilisateurs,
    utilisateurActuel,
    departements,
    departementActuel,
    mettreAJourUtilisateur,
    loggerActivite
  } = useContext(AppContext);

  const utilisateurCourant = utilisateurActuel;

  const [afficherModal, setAfficherModal] = useState(false);
  const [formData, setFormData] = useState({
    prenom: utilisateurCourant.prenom,
    nom: utilisateurCourant.nom,
    email: utilisateurCourant.email,
    motDePasse: '',
    confirmation_motDePasse: ''
  });

  const [erreurs, setErreurs] = useState({});
  const [messageSucces, setMessageSucces] = useState('');

  const obtenirLibelleRole = (role) => {
    const roles = {
      'LOGIN ': 'Login',
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
    
    if (erreurs[name]) {
      setErreurs(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validerFormulaire = () => {
    const nouvellesErreurs = {};
    
    if (!formData.prenom) nouvellesErreurs.prenom = 'Le prénom est requis';
    if (!formData.nom) nouvellesErreurs.nom = 'Le nom est requis';
    if (!formData.email) {
      nouvellesErreurs.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nouvellesErreurs.email = 'Email invalide';
    }
    
    if (formData.motDePasse && formData.motDePasse.length < 6) {
      nouvellesErreurs.motDePasse = 'Le mot de passe doit faire au moins 6 caractères';
    }
    
    if (formData.motDePasse !== formData.confirmation_motDePasse) {
      nouvellesErreurs.confirmation_motDePasse = 'Les mots de passe ne correspondent pas';
    }
    
    setErreurs(nouvellesErreurs);
    return Object.keys(nouvellesErreurs).length === 0;
  };

  const soumettreFormulaire = (e) => {
    e.preventDefault();
    
    if (!validerFormulaire()) return;
    
    const donneesMaj = {
      prenom: formData.prenom,
      nom: formData.nom,
      email: formData.email
    };
    
    if (formData.motDePasse) {
      donneesMaj.motDePasse = formData.motDePasse;
    }
    
    mettreAJourUtilisateur(utilisateurCourant.id, donneesMaj);
    loggerActivite('Modification profil', 'Mise à jour des informations personnelles');
    
    setMessageSucces('Profil mis à jour avec succès');
    setTimeout(() => setMessageSucces(''), 3000);
    
    setFormData(prev => ({
      ...prev,
      motDePasse: '',
      confirmation_motDePasse: ''
    }));
    
    setAfficherModal(false);
  };

  return (
    <div id="profil-utilisateur" className="admin-tab">
      <Card 
        title="Mon Profil"
        headerActions={
          <Button type="admin" onClick={() => setAfficherModal(true)}>
            ✏️ Modifier mon profil
          </Button>
        }
      >
        
        <div className="profil-info" style={{ padding: '20px' }}>
          <div style={{ marginBottom: '15px' }}>
            <strong>Nom complet: </strong> 
            {utilisateurCourant.prenom} {utilisateurCourant.nom}
          </div>
          <div style={{ marginBottom: '15px' }}>
            <strong>Email: </strong> 
            {utilisateurCourant.email}
          </div>
          <div style={{ marginBottom: '15px' }}>
            <strong>Rôle: </strong> 
            {obtenirLibelleRole(utilisateurCourant.role)}
          </div>
          <div style={{ marginBottom: '15px' }}>
            <strong>Département: </strong> 
            {departementActuel?.nom || 
            departements.find(d => d.id === utilisateurCourant.idDepartementAppartenance)?.nom || 
            '-'}
          </div>
          <div style={{ marginBottom: '15px' }}>
            <strong>Statut: </strong> 
            {console.log(utilisateurCourant.statut)}
            <StatusBadge status={utilisateurCourant.statut} />
          </div>
        </div>

        {messageSucces && (
          <div className="alert alert-success" style={{ marginBottom: '20px' }}>
            {messageSucces}
          </div>
        )}

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
              <h2>Modifier mon profil</h2>
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
                <label htmlFor="prenom">Prénom</label>
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
                    marginBottom: '5px',
                    borderRadius: '5px',
                    border: `1px solid ${erreurs.prenom ? 'red' : '#ddd'}`
                  }}
                />
                {erreurs.prenom && <div style={{ color: 'red', fontSize: '0.8em', marginBottom: '10px' }}>{erreurs.prenom}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="nom">Nom</label>
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
                    marginBottom: '5px',
                    borderRadius: '5px',
                    border: `1px solid ${erreurs.nom ? 'red' : '#ddd'}`
                  }}
                />
                {erreurs.nom && <div style={{ color: 'red', fontSize: '0.8em', marginBottom: '10px' }}>{erreurs.nom}</div>}
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
                    marginBottom: '5px',
                    borderRadius: '5px',
                    border: `1px solid ${erreurs.email ? 'red' : '#ddd'}`
                  }}
                />
                {erreurs.email && <div style={{ color: 'red', fontSize: '0.8em', marginBottom: '10px' }}>{erreurs.email}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="motDePasse">Nouveau mot de passe (laisser vide si inchangé)</label>
                <input
                  type="password"
                  id="motDePasse"
                  name="motDePasse"
                  value={formData.motDePasse}
                  onChange={gererChampFormulaire}
                  style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '5px',
                    borderRadius: '5px',
                    border: `1px solid ${erreurs.motDePasse ? 'red' : '#ddd'}`
                  }}
                />
                {erreurs.motDePasse && <div style={{ color: 'red', fontSize: '0.8em', marginBottom: '10px' }}>{erreurs.motDePasse}</div>}
              </div>
              
              {formData.motDePasse && (
                <div className="form-group">
                  <label htmlFor="confirmation_motDePasse">Confirmation du mot de passe</label>
                  <input
                    type="password"
                    id="confirmation_motDePasse"
                    name="confirmation_motDePasse"
                    value={formData.confirmation_motDePasse}
                    onChange={gererChampFormulaire}
                    style={{
                      width: '100%',
                      padding: '10px',
                      marginBottom: '5px',
                      borderRadius: '5px',
                      border: `1px solid ${erreurs.confirmation_motDePasse ? 'red' : '#ddd'}`
                    }}
                  />
                  {erreurs.confirmation_motDePasse && (
                    <div style={{ color: 'red', fontSize: '0.8em', marginBottom: '10px' }}>
                      {erreurs.confirmation_motDePasse}
                    </div>
                  )}
                </div>
              )}
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                gap: '10px',
                marginTop: '20px'
              }}>
                <Button 
                  type="danger" 
                  onClick={() => {
                    setAfficherModal(false);
                    setErreurs({});
                  }}
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

export default ProfilUtilisateur;