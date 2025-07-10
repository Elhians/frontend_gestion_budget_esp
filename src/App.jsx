import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/Login';
import AgentDashboard from './pages/AgentDashboard';
import ChefDashboard from './pages/ChefDashboard';
import DirectionDashboard from './pages/DirectionDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminDepartments from './pages/AdminDepartment';
import AdminSettings from './pages/AdminSettings';
import AdminLogs from './pages/AdminLogs';
import { DepartmentModel } from './models/DepartmentModel';
import { NeedModel } from './models/NeedModel';
import { UserModel } from './models/UserModel';
import { ValidationModel } from './models/ValidationModel';
import { ActivityLogModel } from './models/ActivityLogModel';
import { RevenueModel } from './models/RevenueModel';
import { SettingsModel } from './models/SettingsModel';
import userService from './services/UserService';
import departmentService from './services/DepartmentService';
import needService from './services/NeedService';
import revenueService from './services/RevenueService';
import settingsService from './services/SettingsService';
import activityLogService from './services/ActivityLogService';
import './styles/global.css';

const initialMockData = () => {
  const departements = [
    new DepartmentModel({ 
      id: 1000, 
      nom: 'Do Not TouCh', 
      code: 'DNT'
    }),
  ];

  const utilisateurs = [
    new UserModel({
      id: 1000,
      prenom: 'Untouchable',
      nom: 'Do not bro',
      email: 'dontTouchMe@esp.sn',
      role: 'ENSEIGNANT',
      idDepartementAppartenance: 1
    }),
  ];

  const besoins = [
    new NeedModel({
      id: 1000,
      titre: '......................',
      description: '..............................',
      categorie: '60 - Achats et variations de stocks',
      cout: 3500000,
      statut: 'Soumis',
      idAuteur: 1,
      auteur: utilisateurs[0]
    }),
  ];

  const recettes = [
    new RevenueModel({
      id: 1,
      description: '...........................',
      categorie: '70 - Ventes',
      montant: 15000000,
      idDepartement: 1,
      departement: departements[0]
    }),
  ];

  const parametres = new SettingsModel({
    anneeBudgetaire: '202-',
    dateLimiteSoumission: '2025-03-20',
    notificationsActivees: true,
    devise: 'FCFA'
  });

  const logsActivite = [
    new ActivityLogModel({
      id: 1000,
      dateHeure: '2025-01-10T09:15:23',
      idUtilisateur: 5,
      utilisateur: utilisateurs[4],
      action: 'Connexion',
      details: 'Connexion réussie',
      ipAdresse: '192.168.1.1'
    }),
  ];

  return {
    departements,
    utilisateurs,
    besoins,
    recettes,
    parametres,
    logsActivite
  };
};

export const AppContext = React.createContext();


const SubmissionAlert = ({ message, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;
  
  return (
    <div className="submission-alert">
      <div className="alert-content">
        <span className="alert-icon">⚠️</span>
        <span className="alert-message">{message}</span>
      </div>
      <button 
        type="button" 
        className="alert-close-btn" 
        aria-label="Fermer"
        onClick={onClose}
      >
        &times;
      </button>
    </div>
  );
};


const App = () => {
  const [state, setState] = useState({
    roleUtilisateurActuel: 'INCONNU',
    roleDeConnection: null,
    utilisateurActuel: null,
    departementActuel: null,
    ongletAdminActuel: 'dashboard',
    error: null,
    submissionError: null,
    ...initialMockData()
  });

  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  const getSubmissionMessage = (dateLimite) => {
    if (!dateLimite) return { closed: false, message: '' };
    
    const today = new Date();
    const limitDate = new Date(dateLimite);
    limitDate.setHours(23, 59, 59, 999);
    
    return {
      closed: today > limitDate,
      message: `La période de soumission est terminée depuis le ${new Date(dateLimite).toLocaleDateString('fr-FR')}`
    };
  };

  useEffect(() => {
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 2000;

    const loadInitialData = async (retryCount = 0) => {
      const token = getAuthToken();
      
      try {
        const [utilisateurs, departements, besoins, recettes, parametres, logsActivite] = await Promise.all([
          userService.getAll(token),
          departmentService.getAll(token),
          needService.getAll(token),
          revenueService.getAll(token),
          settingsService.get(token),
          activityLogService.getAll(token)
        ]);

        const departementsAvecChefs = departements.map(departement => {
          const chefDepartement = utilisateurs.find(user => 
            user.idDepartementDirection === departement.id && 
            user.role === 'CHEF_DEPARTEMENT'
          );
          
          return new DepartmentModel({
            ...departement,
            chef: chefDepartement ? chefDepartement.id : null
          });
        });

        setState(prev => ({
          ...prev,
          utilisateurs,
          departements: departementsAvecChefs,
          besoins,
          recettes,
          parametres: new SettingsModel(parametres),
          logsActivite: logsActivite.map(log => new ActivityLogModel(log)),
          isLoading: false,
          error: null,
        }));

      } catch (error) {
        console.error(`Erreur lors du chargement des données initiales (tentative ${retryCount + 1}):`, error);
        
        if (retryCount < MAX_RETRIES - 1) {
          setState(prev => ({
            ...prev,
            isLoading: true,
            error: `Échec du chargement, nouvelle tentative dans ${RETRY_DELAY/1000}s... (${retryCount + 1}/${MAX_RETRIES})`
          }));
          
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          return loadInitialData(retryCount + 1);
        } else {
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: "Échec du chargement des données après plusieurs tentatives. Veuillez vérifier votre connexion."
          }));
        }
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Vérification du token avec le serveur pourrait être ajoutée ici
    } else {
      setState(prev => ({
        ...prev,
        roleUtilisateurActuel: 'INCONNU',
        utilisateurActuel: null,
        departementActuel: null
      }));
    }
  }, []);

  const loggerActivite = async (action, details) => {
    const token = getAuthToken();
    const utilisateur = state.utilisateurActuel || 
                       state.utilisateurs.find(u => u.role === 'ADMIN');
    
    if (!utilisateur) {
      console.error("Aucun utilisateur trouvé pour le log d'activité");
      return;
    }

    try {
      const nouveauLog = await activityLogService.create({
        idUtilisateur: utilisateur.id,
        action,
        details,
        ipAdresse: '192.168.1.' + Math.floor(Math.random() * 100)
      }, token);

      setState(prev => ({
        ...prev,
        logsActivite: [new ActivityLogModel(nouveauLog), ...prev.logsActivite]
      }));
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du log d'activité:", error);
    }
  };

  const ajouterBesoin = async (besoinData) => {
    const token = getAuthToken();
    const submissionStatus = getSubmissionMessage(state.parametres.dateLimiteSoumission);
    
    if (submissionStatus.closed) {
      setState(prev => ({ ...prev, submissionError: submissionStatus.message }));
      throw new Error(submissionStatus.message);
    }
    
    try {
      setState(prev => ({ ...prev, submissionError: null }));
      
      const nouveauBesoin = await needService.create({
        titre: besoinData.description.substring(0, 30),
        description: besoinData.description,
        categorie: besoinData.categorie,
        cout: besoinData.cout,
        idAuteur: state.utilisateurActuel.id,
        roleAuteur: state.roleUtilisateurActuel
      }, token);
      
      setState(prev => ({
        ...prev,
        besoins: [...prev.besoins, nouveauBesoin]
      }));
      
      loggerActivite('Soumission besoin', `Nouveau besoin: ${nouveauBesoin.description} - ${nouveauBesoin.cout.toLocaleString('fr-FR')} FCFA`);
      return nouveauBesoin;
    } catch (error) {
      console.error("Erreur lors de l'ajout du besoin:", error);
      throw error;
    }
  };

  const ajouterBesoinDepartement = async (besoinData) => {
    const token = getAuthToken();
    const submissionStatus = getSubmissionMessage(state.parametres.dateLimiteSoumission);
    
    if (submissionStatus.closed) {
      setState(prev => ({ ...prev, submissionError: submissionStatus.message }));
      throw new Error(submissionStatus.message);
    }
    
    try {
      setState(prev => ({ ...prev, submissionError: null }));
      
      const titreFormatte = `(dep-${state.departementActuel}) ${besoinData.description.substring(0, 30)}`;
      const nouveauBesoin = await needService.create({
        titre: titreFormatte, 
        description: besoinData.description,
        categorie: besoinData.categorie,
        cout: besoinData.cout,
        idAuteur: state.utilisateurActuel.id,
        isDepartmentNeed: true,
        roleAuteur: state.roleUtilisateurActuel
      }, token);

      setState(prev => ({
        ...prev,
        besoins: [...prev.besoins, nouveauBesoin]
      }));

      loggerActivite('Soumission besoin département', 
        `Nouveau besoin: ${nouveauBesoin.description} - ${nouveauBesoin.cout.toLocaleString('fr-FR')} FCFA`);
      return nouveauBesoin;
    } catch (error) {
      console.error("Erreur lors de l'ajout du besoin département:", error);
      throw error;
    }
  };

  const supprimerBesoin = async (id) => {
    const token = getAuthToken();
    const submissionStatus = getSubmissionMessage(state.parametres.dateLimiteSoumission);
    
    if (submissionStatus.closed) {
      setState(prev => ({ ...prev, submissionError: submissionStatus.message }));
      throw new Error(submissionStatus.message);
    }
    
    try {
      setState(prev => ({ ...prev, submissionError: null }));
      
      await needService.delete(id, token);
      setState(prev => ({
        ...prev,
        besoins: prev.besoins.filter(b => b.id !== id)
      }));
      loggerActivite('Suppression besoin', `ID: ${id}`);
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression du besoin:", error);
      throw error;
    }
  };

  const mettreAJourStatutBesoin = async (idBesoin, nouveauStatut) => {
    if (window.confirm(`Cette action va modifier le statut du besoin à "${nouveauStatut}". Continuer ?`)) {
      try {
        const token = getAuthToken();
        const { besoins, utilisateurs, departementActuel } = state;

        const besoinAModifier = besoins.find(b => b.id === idBesoin);
        
        if (!besoinAModifier) {
          throw new Error("Besoin non trouvé");
        }

        const auteur = utilisateurs.find(u => u.id === besoinAModifier.idAuteur);
        const isCurrentDepartment = auteur?.idDepartementAppartenance === departementActuel;
        
        if (!isCurrentDepartment) {
          throw new Error("Ce besoin n'appartient pas à votre département");
        }

        await needService.update(idBesoin, { statut: nouveauStatut }, token);

        setState(prev => ({
          ...prev,
          besoins: prev.besoins.map(besoin => 
            besoin.id === idBesoin ? { ...besoin, statut: nouveauStatut } : besoin
          )
        }));
        
        loggerActivite('Modification statut budget', `Besoin ${idBesoin} mis à jour à "${nouveauStatut}"`);
        
        return { success: true, id: idBesoin, newStatus: nouveauStatut };
      } catch (error) {
        console.error("Erreur lors de la modification du statut du besoin:", error);
        loggerActivite('Erreur modification statut', `Échec de la modification: ${error.message}`);
        throw error;
      }
    }
    return { success: false, id: idBesoin };
  };

  const mettreAJourBesoin = async (id, modifications) => {
    const token = getAuthToken();
    const submissionStatus = getSubmissionMessage(state.parametres.dateLimiteSoumission);
    
    if (submissionStatus.closed) {
      setState(prev => ({ ...prev, submissionError: submissionStatus.message }));
      throw new Error(submissionStatus.message);
    }
    
    try {
      setState(prev => ({ ...prev, submissionError: null }));
      
      const besoinMaj = await needService.update(id, modifications, token);
      setState(prev => ({
        ...prev,
        besoins: prev.besoins.map(b => 
          b.id === id ? besoinMaj : b
        )
      }));
      loggerActivite('Modification besoin', `ID: ${id}`);
      return besoinMaj;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du besoin:", error);
      throw error;
    }
  };

  const validerBesoinChef = async (id) => {
    try {
      const besoinValide = await needService.validateByChef(id);
      setState(prev => ({
        ...prev,
        besoins: prev.besoins.map(b => 
          b.id === id ? besoinValide : b
        )
      }));
      loggerActivite('Validation besoin', `Besoin ${id} validé par le chef`);
      return besoinValide;
    } catch (error) {
      console.error("Erreur lors de la validation par le chef:", error);
      throw error;
    }
  };

  const validerBesoinDir = async (id) => {
    try {
      const besoinValide = await needService.validateByDir(id);
      setState(prev => ({
        ...prev,
        besoins: prev.besoins.map(b => 
          b.id === id ? besoinValide : b
        )
      }));
      loggerActivite('Validation besoin', `Besoin ${id} validé par le directeur`);
      return besoinValide;
    } catch (error) {
      console.error("Erreur lors de la validation par le directeur:", error);
      throw error;
    }
  };

  const consoliderBesoinsDepartement = async () => {
    if (window.confirm('Cette action va marquer tous les besoins validés comme "Consolide" et les soumettre à la direction. Continuer ?')) {
      try {
        const token = getAuthToken();
        const { besoins, utilisateurs, departementActuel } = state;

        const besoinsAConsolider = besoins.filter(besoin => {
          const auteur = utilisateurs.find(u => u.id === besoin.idAuteur);
          const isCurrentDepartment = auteur?.idDepartementAppartenance === departementActuel;
          return isCurrentDepartment && besoin.statut === 'Soumis';
        });

        const promises = besoinsAConsolider.map(besoin => 
          needService.update(besoin.id, { statut: 'Consolide' }, token)
        );

        await Promise.all(promises);

        setState(prev => {
          const besoinsMaj = prev.besoins.map(besoin => {
            const auteur = prev.utilisateurs.find(u => u.id === besoin.idAuteur);
            const isCurrentDepartment = auteur?.idDepartementAppartenance === prev.departementActuel;
            
            if (isCurrentDepartment && besoin.statut === 'Soumis') {
              return { ...besoin, statut: 'Consolide' };
            }
            return besoin;
          });
          
          return {
            ...prev,
            besoins: besoinsMaj
          };
        });
        
        loggerActivite('Consolidation budget', `Besoins du département ${departementActuel} Consolides`);
        
        return { success: true, count: besoinsAConsolider.length };
      } catch (error) {
        console.error("Erreur lors de la consolidation des besoins:", error);
        loggerActivite('Erreur consolidation', `Échec de la consolidation: ${error.message}`);
        throw error;
      }
    }
    return { success: false, count: 0 };
  };

  const mettreAJourMontantFinal = (id, nouveauMontant, type) => {
    const montant = parseInt(nouveauMontant);
    
    if (type === 'Depense') {
      setState(prev => ({
        ...prev,
        besoins: prev.besoins.map(b => 
          b.id === id ? { ...b, cout: montant } : b
        )
      }));
    } else {
      setState(prev => ({
        ...prev,
        recettes: prev.recettes.map(r => 
          r.id === id ? { ...r, montant: montant } : r
        )
      }));
    }
    
    loggerActivite('Modification montant', `${type === 'Depense' ? 'Dépense' : 'Recette'} ${id} mise à jour: ${montant.toLocaleString('fr-FR')} FCFA`);
  };

  const exporterVersCSV = () => {
    const enTetes = ['Département', 'Type', 'Description', 'Nomenclature', 'Montant Validé'];
    const donnees = [];
    
    state.besoins
      .filter(b => b.statut === 'VALIDE')
      .forEach(b => donnees.push([
        b.departement.nom,
        'Dépense',
        b.description.replace(/,/g, ''),
        b.categorie,
        b.cout
      ]));
      
    state.recettes
      .forEach(r => donnees.push([
        r.departement.nom,
        'Recette',
        r.description.replace(/,/g, ''),
        r.categorie,
        r.montant
      ]));

    let contenuCSV = "data:text/csv;charset=utf-8," 
      + enTetes.join(",") + "\n" 
      + donnees.map(e => e.join(",")).join("\n");
    
    const lien = document.createElement("a");
    lien.setAttribute("href", encodeURI(contenuCSV));
    lien.setAttribute("download", "export_budget_esp.csv");
    document.body.appendChild(lien);
    lien.click();
    document.body.removeChild(lien);
    loggerActivite('Export données', 'Export CSV du budget');
  };

  const basculerStatutUtilisateur = async (id, nouveauStatut) => {
    const token = getAuthToken();
    try {
      const utilisateurMaj = await userService.update(id, { statut: nouveauStatut }, token);
      
      setState(prev => ({
        ...prev,
        utilisateurs: prev.utilisateurs.map(u => 
          u.id === id ? utilisateurMaj : u
        )
      }));
      
      loggerActivite('Changement statut utilisateur', 
        `Utilisateur ${utilisateurMaj.prenom} ${utilisateurMaj.nom} ${nouveauStatut === 'ACTIF' ? 'activé' : 'désactivé'}`);
    } catch (error) {
      console.error("Erreur lors du changement de statut de l'utilisateur:", error);
      throw error;
    }
  };

  const ajouterUtilisateur = async (utilisateur) => {
    const token = getAuthToken();
    try {
      const nouvelUtilisateur = await userService.create({
        prenom: utilisateur.prenom,
        nom: utilisateur.nom,
        email: utilisateur.email,
        role: utilisateur.role,
        idDepartementAppartenance: utilisateur.idDepartementAppartenance,
        motDePasse: 'passer123',
        statut: utilisateur.statut || 'inactive'
      }, token);

      setState(prev => ({
        ...prev,
        utilisateurs: [...prev.utilisateurs, nouvelUtilisateur]
      }));

      loggerActivite('Ajout utilisateur', 
        `Nouvel utilisateur: ${nouvelUtilisateur.prenom} ${nouvelUtilisateur.nom} (${nouvelUtilisateur.role})`);
      
      return nouvelUtilisateur;
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur:", error);
      throw error;
    }
  };

  const connecterUtilisateur = (token, utilisateurData) => {
    localStorage.setItem('authToken', token);
    
    const utilisateurTrouve = state.utilisateurs.find(u => u.id === utilisateurData.id) || 
      new UserModel({
        id: utilisateurData.id,
        prenom: utilisateurData.prenom,
        nom: utilisateurData.nom,
        email: utilisateurData.email,
        role: utilisateurData.role,
        idDepartementAppartenance: utilisateurData.idDepartementAppartenance,
        idDepartementDirection: utilisateurData.idDepartementDirection
      });

    setState(prev => ({
      ...prev,
      roleUtilisateurActuel: utilisateurData.role,
      roleDeConnection: utilisateurData.role,
      utilisateurActuel: utilisateurTrouve,
      departementActuel: utilisateurData.idDepartementAppartenance || 
                       utilisateurData.idDepartementDirection || 
                       null,
      submissionError: null
    }));
    
    loggerActivite('Connexion', `Utilisateur ${utilisateurData.email} connecté`);
  };

  const mettreAJourUtilisateur = async (id, modifications) => {
    const token = getAuthToken();
    try {
      const utilisateurMaj = await userService.update(id, modifications, token);
      
      setState(prev => ({
        ...prev,
        utilisateurs: prev.utilisateurs.map(u => 
          u.id === id ? utilisateurMaj : u
        )
      }));

      loggerActivite('Modification utilisateur', 
        `Utilisateur ${utilisateurMaj.prenom} ${utilisateurMaj.nom} mis à jour`);
      
      return utilisateurMaj;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
      throw error;
    }
  };

  const supprimerUtilisateur = async (id) => {
    const token = getAuthToken();
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.')) {
      try {
        const utilisateur = state.utilisateurs.find(u => u.id === id);
        await userService.delete(id, token);
        
        setState(prev => ({
          ...prev,
          utilisateurs: prev.utilisateurs.filter(u => u.id !== id)
        }));
        
        loggerActivite('Suppression utilisateur', 
          `Utilisateur ${utilisateur.prenom} ${utilisateur.nom} supprimé`);
        
        return true;
      } catch (error) {
        console.error("Erreur lors de la suppression de l'utilisateur:", error);
        throw error;
      }
    }
    return false;
  };

  const ajouterDepartement = async (departement) => {
    const token = getAuthToken();
    try {
      const nouveauDepartement = await departmentService.create(
        {
          nom: departement.nom,
          code: departement.code,
          budget: departement.budget
        },
        token
      );

      setState(prev => ({
        ...prev,
        departements: [...prev.departements, nouveauDepartement]
      }));

      loggerActivite('Ajout département', `Nouveau département: ${nouveauDepartement.nom} (${nouveauDepartement.code})`);
      return nouveauDepartement;
    } catch (error) {
      console.error("Erreur lors de l'ajout du département:", error);
      throw error;
    }
  };

  const mettreAJourDepartement = async (id, modifications) => {
    const token = getAuthToken();
    try {
      const departementMaj = await departmentService.update(
        id, 
        modifications,
        token
      );
      
      setState(prev => ({
        ...prev,
        departements: prev.departements.map(d => 
          d.id === id ? departementMaj : d
        )
      }));

      loggerActivite('Modification département', `Département ${departementMaj.nom} mis à jour`);
      return departementMaj;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du département:", error);
      throw error;
    }
  };

  const supprimerDepartement = async (id) => {
    const token = getAuthToken();
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce département ? Cette action est irréversible.')) {
      try {
        const departement = state.departements.find(d => d.id === id);
        await departmentService.delete(id, token);
        
        setState(prev => ({
          ...prev,
          departements: prev.departements.filter(d => d.id !== id),
          utilisateurs: prev.utilisateurs.map(u => {
            if (u.idDepartementAppartenance === id) {
              return { ...u, idDepartementAppartenance: null };
            }
            if (u.idDepartementDirection === id) {
              return { ...u, idDepartementDirection: null };
            }
            return u;
          })
        }));
        
        loggerActivite('Suppression département', `Département ${departement.nom} supprimé`);
        return true;
      } catch (error) {
        console.error("Erreur lors de la suppression du département:", error);
        throw error;
      }
    }
    return false;
  };

  const ajouterRecette = async (recetteData) => {
    const token = getAuthToken();
    const submissionStatus = getSubmissionMessage(state.parametres.dateLimiteSoumission);
    
    if (submissionStatus.closed) {
      setState(prev => ({ ...prev, submissionError: submissionStatus.message }));
      throw new Error(submissionStatus.message);
    }
    
    try {
      setState(prev => ({ ...prev, submissionError: null }));
      
      const nouvelleRecette = await revenueService.create({
        description: recetteData.description,
        categorie: recetteData.categorie,
        montant: recetteData.montant,
        idDepartement: state.departementActuel
      }, token);

      const departement = state.departements.find(d => d.id === state.departementActuel);
      
      setState(prev => ({
        ...prev,
        recettes: [...prev.recettes, new RevenueModel({
          ...nouvelleRecette,
          departement: departement
        })]
      }));
      
      loggerActivite('Ajout recette', `Nouvelle recette: ${recetteData.description} - ${recetteData.montant.toLocaleString('fr-FR')} FCFA`);
      return nouvelleRecette;
    } catch (error) {
      console.error("Erreur lors de l'ajout de la recette:", error);
      throw error;
    }
  };

  const mettreAJourRecette = async (id, modifications) => {
    const token = getAuthToken();
    const submissionStatus = getSubmissionMessage(state.parametres.dateLimiteSoumission);
    
    if (submissionStatus.closed) {
      setState(prev => ({ ...prev, submissionError: submissionStatus.message }));
      throw new Error(submissionStatus.message);
    }
    
    try {
      setState(prev => ({ ...prev, submissionError: null }));
      
      const recetteMaj = await revenueService.update(id, modifications, token);

      setState(prev => {
        const departement = prev.departements.find(d => d.id === (modifications.idDepartement || recetteMaj.idDepartement));
        
        return {
          ...prev,
          recettes: prev.recettes.map(r => 
            r.id === id ? new RevenueModel({
              ...r,
              ...recetteMaj,
              departement: departement || r.departement
            }) : r
          )
        };
      });

      const details = Object.entries(modifications)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
      loggerActivite('Modification recette', `Recette ${id} mise à jour - ${details}`);

      return recetteMaj;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la recette:", error);
      throw error;
    }
  };

  const supprimerRecette = async (id) => {
    const token = getAuthToken();
    const submissionStatus = getSubmissionMessage(state.parametres.dateLimiteSoumission);
    
    if (submissionStatus.closed) {
      setState(prev => ({ ...prev, submissionError: submissionStatus.message }));
      throw new Error(submissionStatus.message);
    }
    
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette recette ?')) {
      try {
        setState(prev => ({ ...prev, submissionError: null }));
        
        await revenueService.remove(id, token);
        setState(prev => ({
          ...prev,
          recettes: prev.recettes.filter(r => r.id !== id)
        }));
        loggerActivite('Suppression recette', `Recette ${id} supprimée`);
        return true;
      } catch (error) {
        console.error("Erreur lors de la suppression de la recette:", error);
        throw error;
      }
    }
    return false;
  };

  const mettreAJourParametres = async (nouveauxParametres) => {
    const token = getAuthToken();
    try {
      const paramsToSend = {
        ...nouveauxParametres,
        notificationsActivees: nouveauxParametres.notificationsActivees === 'true' || 
                             nouveauxParametres.notificationsActivees === true
      };

      const parametresMaj = await settingsService.update(paramsToSend, token);

      setState(prev => ({
        ...prev,
        parametres: new SettingsModel(parametresMaj),
        submissionError: null
      }));
      
      loggerActivite('Modification paramètres', 'Mise à jour des paramètres système');
      return parametresMaj;
    } catch (error) {
      console.error("Erreur lors de la mise à jour des paramètres:", error);
      loggerActivite('Erreur modification paramètres', `Échec de la mise à jour: ${error.message}`);
      throw error;
    }
  };

  const viderLogsActivite = async () => {
    const token = getAuthToken();
    if (window.confirm('Êtes-vous sûr de vouloir vider le journal d\'activité ? Cette action est irréversible.')) {
      try {
        await activityLogService.removeAll(token);
        setState(prev => ({
          ...prev,
          logsActivite: []
        }));
        loggerActivite('Nettoyage logs', 'Journal d\'activité vidé');
      } catch (error) {
        console.error("Erreur lors de la suppression des logs:", error);
        throw error;
      }
    }
  };

  const definirRoleUtilisateurActuel = (role) => {
    setState(prev => ({
      ...prev,
      roleUtilisateurActuel: role
    }));
  };

  const definirOngletAdminActuel = (onglet) => {
    setState(prev => ({
      ...prev,
      ongletAdminActuel: onglet
    }));
  };

  return (
    <AppContext.Provider value={{
      ...state,
      definirRoleUtilisateurActuel,
      getAuthToken,
      definirOngletAdminActuel,
      ajouterBesoin,
      ajouterBesoinDepartement,
      mettreAJourBesoin,
      mettreAJourStatutBesoin,
      supprimerBesoin,
      validerBesoinChef,
      validerBesoinDir,
      consoliderBesoinsDepartement,
      ajouterRecette,
      mettreAJourRecette,
      supprimerRecette,
      mettreAJourMontantFinal,
      exporterVersCSV,
      basculerStatutUtilisateur,
      ajouterUtilisateur,
      connecterUtilisateur,
      mettreAJourUtilisateur,
      supprimerUtilisateur,
      ajouterDepartement,
      mettreAJourDepartement,
      supprimerDepartement,
      mettreAJourParametres,
      viderLogsActivite,
      loggerActivite
    }}>
      <div className="app">
        <Header />
        <SubmissionAlert 
          message={state.submissionError} 
          onClose={() => setState(prev => ({ ...prev, submissionError: null }))}
        />
        <main className="container">
          {state.roleUtilisateurActuel === 'INCONNU' && <Login />}
          {state.roleUtilisateurActuel === 'ENSEIGNANT' && <AgentDashboard />}
          {state.roleUtilisateurActuel === 'CHEF_DEPARTEMENT' && <ChefDashboard />}
          {state.roleUtilisateurActuel === 'DIRECTEUR' && <DirectionDashboard />}
          {state.roleUtilisateurActuel === 'ADMIN' && (
            <>
              <AdminDashboard />
              <AdminUsers />
              <AdminDepartments />
              <AdminSettings />
              <AdminLogs />
            </>
          )}
        </main>
      </div>
    </AppContext.Provider>
  );
};

export default App;