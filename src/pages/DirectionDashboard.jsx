import React, { useContext, useState } from 'react';
import Card from '../components/Card';
import Table from '../components/Table';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import { AppContext } from '../App';

const DirectionDashboard = () => {
  const { 
    besoins, 
    recettes, 
    departements,
    mettreAJourMontantFinal, 
    mettreAJourStatutBesoin, 
    exporterVersCSV,
    mettreAJourBesoin,
    parametres,
  } = useContext(AppContext);
  
  const [elementEnEdition, setElementEnEdition] = useState(null);
  const [afficherModalEdition, setAfficherModalEdition] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    montant: '',
    montantFinal: ''
  });

  const besoinsApprouves = besoins.filter(besoin => besoin.statut === 'Approuve');

  const donneesAffichage = [
    ...besoins.filter(besoin => besoin.statut === 'Approuve' || besoin.statut === 'Consolide')
      .map(item => ({ ...item, type: 'Depense' })),
    ...recettes.map(item => ({ ...item, type: 'Recette' }))
  ];

  const donneesExport = [
    ...besoinsApprouves.map(item => ({ ...item, type: 'Depense' })),
    ...recettes.map(item => ({ ...item, type: 'Recette' }))
  ];

  const gererClicModifier = (item) => {
    setElementEnEdition(item);
    setFormData({
      description: item.description,
      montant: item.cout?.toString() || item.montant.toString(),
      montantFinal: item.cout?.toString() || item.montant.toString()
    });
    setAfficherModalEdition(true);
  };

  const gererChangementFormulaire = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const soumettreFormulaire = (e) => {
    e.preventDefault();
    
    if (elementEnEdition.type === 'Depense') {
      mettreAJourBesoin(elementEnEdition.id, {
        description: formData.description,
        cout: parseInt(formData.montant),
        montantFinal: parseInt(formData.montantFinal)
      });
    }
    
    setAfficherModalEdition(false);
  };

  const gererExport = (format) => {
    if (format === 'csv') {
      exporterVersCSV(donneesExport);
    } else if (format === 'pdf') {
      window.print(); 
    }
  };

  return (
    <>
      <Card 
        title="Tableau de bord budgétaire global"
        headerActions={
          <>
            <Button type="secondary" onClick={() => gererExport('csv')}>
              Exporter vers Excel (CSV)
            </Button>
            <Button type="danger" onClick={() => gererExport('pdf')}>
              Exporter en PDF
            </Button>
          </>
        }
      >
        <p>Vue Consolidee des demandes de dépenses et prévisions de recettes.</p>
        <p style={{ color: 'var(--warning-color)', fontStyle: 'italic' }}>
          À l'exception de l'exportation en PDF, seules les données Approuvees seront exportées. Veillez à approuver ou rejeter les besoins Consolides avant d'exporter en PDF.
        </p>
        
        <Table
          headers={['Département', 'Type', 'Description / Source', 'Nomenclature', 'Montant Proposé (N)', 'Montant Validé Direction', 'Statut', 'Actions']}
          data={donneesAffichage}
          renderRow={(item) => {
            const estRecette = item.type === 'Recette';
            const estApprouve = item.statut === 'Approuve';
            const cleUnique = estRecette ? `recette-${item.id}` : `besoin-${item.id}`;
            const departement = departements.find(d => d.id === (item.idDepartement || item.departement?.id));
            
            return (
              <tr key={cleUnique} 
                style={estRecette ? { backgroundColor: '#f0f9ff' } : 
                       estApprouve ? { backgroundColor: '#f0fff0' } : {}}>
                <td>{departement?.nom || 'Inconnu'}</td>
                <td>{item.type}</td>
                <td>{item.description}</td>
                <td>{item.categorie}</td>
                <td>{estRecette ? item.montant.toLocaleString('fr-FR') : item.cout.toLocaleString('fr-FR')} {parametres.devise}</td>
                <td>
                  {item.montantFinal?.toLocaleString('fr-FR') || '-'} 
                </td>
                {estRecette ? (
                  <>
                    <td><StatusBadge status="VALIDE" /></td>
                    <td className="action-buttons">
                      <button className="btn-icon" onClick={() => gererClicModifier(item)}>✏️</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td><StatusBadge status={item.statut} /></td>
                    <td className="action-buttons">
                      {item.statut === 'Consolide' ? (
                        <>
                          <Button type="success" size="sm" onClick={() => mettreAJourStatutBesoin(item.id, 'Approuve')}>
                            Approuver
                          </Button>
                          <Button type="danger" size="sm" onClick={() => mettreAJourStatutBesoin(item.id, 'Rejete par Direction')}>
                            Rejeter
                          </Button>
                          <button className="btn-icon" onClick={() => gererClicModifier(item)}>✏️</button>
                        </>
                      ) : (
                        <>
                          <button className="btn-icon" onClick={() => gererClicModifier(item)}>✏️</button>
                        </>
                      )}
                    </td>
                  </>
                )}
              </tr>
            );
          }}
        />
      </Card>

      {afficherModalEdition && elementEnEdition && (
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
              <h2>Modifier {elementEnEdition.type === 'Depense' ? 'le besoin' : 'la recette'}</h2>
              <button 
                onClick={() => setAfficherModalEdition(false)}
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
                <label>Département</label>
                <input
                  type="text"
                  value={departements.find(d => d.id === (elementEnEdition.idDepartement || elementEnEdition.departement?.id))?.nom || 'Inconnu'}
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
                <label>Type</label>
                <input
                  type="text"
                  value={elementEnEdition.type}
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
                <label>Nomenclature</label>
                <input
                  type="text"
                  value={elementEnEdition.categorie}
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
                <label htmlFor="description">Description / Source</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={gererChangementFormulaire}
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
                <label htmlFor="montant">Montant Proposé (N)</label>
                <input
                  type="number"
                  name="montant"
                  value={formData.montant}
                  onChange={gererChangementFormulaire}
                  required
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
              
              <div className="form-group">
                <label htmlFor="montantFinal">Montant Validé Direction</label>
                <input
                  type="number"
                  name="montantFinal"
                  value={formData.montantFinal}
                  onChange={gererChangementFormulaire}
                  required
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
                  onClick={() => setAfficherModalEdition(false)}
                  style={{ marginRight: '10px' }}
                >
                  Annuler
                </Button>
                <Button type="primary">
                  Enregistrer
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default DirectionDashboard;