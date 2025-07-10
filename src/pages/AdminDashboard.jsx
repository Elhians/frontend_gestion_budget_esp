import React, { useContext } from 'react';
import Card from '../components/Card';
import Table from '../components/Table';
import { AppContext } from '../App';

const AdminDashboard = () => {
  const { 
    utilisateurs, 
    departements, 
    besoins, 
    recettes, 
    logsActivite,
    parametres,
  } = useContext(AppContext);

  const utilisateursActifs = utilisateurs.filter(u => u.statut === 'active').length;
  const budgetTotal = departements.reduce((total, dept) => total + (dept.budget || 0), 0);
  const demandesEnAttente = besoins.filter(b => b.statut === 'Soumis').length;
  const montantTotalRecettes = recettes.reduce((total, recette) => total + recette.montant, 0);

  return (
    <div id="admin-dashboard" className="admin-tab active">
      <h2>Tableau de bord Administrateur</h2>
      <div className="admin-stats">
        <div className="stat-card users">
          <h3>Utilisateurs</h3>
          <div className="value" id="total-users">{utilisateurs.length}</div>
          <div>Actifs: <span id="active-users">{utilisateursActifs}</span></div>
        </div>
        <div className="stat-card departments">
          <h3>Départements</h3>
          <div className="value" id="total-departments">{departements.length}</div>
          <div>Budget total: <span id="total-budget">{budgetTotal.toLocaleString('fr-FR')}</span> {parametres.devise} </div>
        </div>
        <div className="stat-card budget">
          <h3>Demandes Budget</h3>
          <div className="value" id="total-requests">{besoins.length}</div>
          <div>En attente: <span id="pending-requests">{demandesEnAttente}</span></div>
        </div>
        <div className="stat-card requests">
          <h3>Recettes</h3>
          <div className="value" id="total-revenues">{recettes.length}</div>
          <div>Prévision totale: <span id="total-revenue-amount">{montantTotalRecettes.toLocaleString('fr-FR')}</span> {parametres.devise} </div>
        </div>
      </div>
      
      <Card title="Activité récente">
        <Table
          headers={['Date', 'Utilisateur', 'Action', 'Détails']}
          data={logsActivite.slice(0, 5)}
          renderRow={(log) => (
            <tr key={log.id}>
              <td>{new Date(log.dateHeure).toLocaleString('fr-FR')}</td>
              <td>{log.utilisateur ? `${log.utilisateur.prenom} ${log.utilisateur.nom}` : 'Système'}</td>
              <td>{log.action}</td>
              <td>{log.details}</td>
            </tr>
          )}
        />
      </Card>
    </div>
  );
};

export default AdminDashboard;