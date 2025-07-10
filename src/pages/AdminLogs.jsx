import React, { useContext, useState, useEffect } from 'react';
import Card from '../components/Card';
import Table from '../components/Table';
import Button from '../components/Button';
import { AppContext } from '../App';
import activitylogservice from '../services/ActivityLogService';

const AdminLogs = () => {
  const { getAuthToken, loggerActivite, utilisateurs } = useContext(AppContext);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fonction pour trouver un utilisateur par son ID
  const trouverUtilisateurParId = (id) => {
    return utilisateurs.find(user => user.id === id) || null;
  };

  // Charger les logs au montage du composant
  useEffect(() => {
    const chargerLogs = async () => {
      try {
        const token = getAuthToken();
        const logsData = await activitylogservice.getAll(token);
        
        // Enrichir les logs avec les données utilisateur
        const logsAvecUtilisateurs = logsData.map(log => ({
          ...log,
          utilisateur: trouverUtilisateurParId(log.idUtilisateur)
        }));
        
        setLogs(logsAvecUtilisateurs);
      } catch (error) {
        console.error("Erreur lors du chargement des logs:", error);
        loggerActivite('Erreur chargement logs', `Échec du chargement: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    chargerLogs();
  }, [getAuthToken, loggerActivite, utilisateurs]);

  const viderJournal = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir vider le journal d\'activité ? Cette action est irréversible.')) {
      try {
        const token = getAuthToken();
        await activitylogservice.removeAll(token);
        setLogs([]);
        loggerActivite('Nettoyage logs', 'Journal d\'activité vidé');
      } catch (error) {
        console.error("Erreur lors de la suppression des logs:", error);
        loggerActivite('Erreur suppression logs', `Échec de la suppression: ${error.message}`);
      }
    }
  };

  if (isLoading) {
    return (
      <div id="admin-logs" className="admin-tab">
        <Card title="Journal d'activité">
          <p>Chargement des logs en cours...</p>
        </Card>
      </div>
    );
  }

  return (
    <div id="admin-logs" className="admin-tab">
      <Card 
        title="Journal d'activité"
        headerActions={
          <Button type="danger" onClick={viderJournal}>Vider le journal</Button>
        }
      >
        <Table
          headers={['Date/Heure', 'Utilisateur', 'Action', 'Détails', 'Adresse IP']}
          data={logs}
          renderRow={(log) => (
            <tr key={log.id}>
              <td>{new Date(log.dateHeure).toLocaleString('fr-FR')}</td>
              <td>
                {log.utilisateur 
                  ? `${log.utilisateur.prenom} ${log.utilisateur.nom}`
                  : `Utilisateur inconnu (ID: ${log.idUtilisateur})`
                }
              </td>
              <td>{log.action}</td>
              <td>{log.details}</td>
              <td>{log.ipAdresse}</td>
            </tr>
          )}
        />
      </Card>
    </div>
  );
};

export default AdminLogs;