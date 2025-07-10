import React, { useContext, useState } from 'react';
import Card from '../components/Card';
import Table from '../components/Table';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import Tabs from '../components/Tabs';
import { AppContext } from '../App';
import ProfilUtilisateur from '../components/ProfilUtilisateur';

const ChefDashboard = () => {
  const { 
    besoins, 
    recettes, 
    departementActuel,
    departements,
    utilisateurs,
    mettreAJourStatutBesoin,
    ajouterRecette,
    mettreAJourRecette,
    supprimerRecette,
    consoliderBesoinsDepartement,
    ajouterBesoin,
    ajouterBesoinDepartement,
    mettreAJourBesoin,
    supprimerBesoin,
    parametres,
  } = useContext(AppContext);
  
  // États pour la gestion des besoins
  const [formulaireBesoin, setFormulaireBesoin] = useState({
    description: '',
    categorie: '60 - Achats et variations de stocks',
    montant: ''
  });
  const [besoinEnEdition, setBesoinEnEdition] = useState(null);
  const [afficherFormulaireBesoin, setAfficherFormulaireBesoin] = useState(false);
  const [afficherModalEditionBesoin, setAfficherModalEditionBesoin] = useState(false);

  // États pour la gestion des recettes
  const [formulaireRecette, setFormulaireRecette] = useState({
    description: '',
    categorie: '70 - Ventes',
    montant: ''
  });
  const [recetteEnEdition, setRecetteEnEdition] = useState(null);
  const [afficherModalEditionRecette, setAfficherModalEditionRecette] = useState(false);

  const departementCourant = departements.find(d => d.id === departementActuel);

  // Filtrer les données par département
  const besoinsDepartement = besoins.filter(besoin => {
    const auteur = utilisateurs.find(u => u.id === besoin.idAuteur);
    return auteur 
           && auteur.idDepartementAppartenance === departementActuel
           && besoin.statut === "Soumis";
});

  const besoinsSpecifiquesDepartement = besoins.filter(besoin => {
    return besoin.titre?.startsWith(`(dep-${departementActuel})`);
  });

  const recettesDepartement = recettes.filter(recette => recette.idDepartement === departementActuel);

  // Gestion des changements de formulaire
  const gererChangementBesoin = (e) => {
    setFormulaireBesoin({
      ...formulaireBesoin,
      [e.target.name]: e.target.value
    });
  };

  const gererChangementRecette = (e) => {
    setFormulaireRecette({
      ...formulaireRecette,
      [e.target.name]: e.target.value
    });
  };

  // Soumission des formulaires
  const soumettreBesoin = async (e) => {
    e.preventDefault();
    try {
      if (besoinEnEdition) {
        await mettreAJourBesoin(besoinEnEdition.id, {
          description: formulaireBesoin.description,
          cout: parseInt(formulaireBesoin.montant),
          categorie: formulaireBesoin.categorie
        });
        setBesoinEnEdition(null);
        setAfficherModalEditionBesoin(false);
      } else {
        await ajouterBesoin({
          description: formulaireBesoin.description,
          categorie: formulaireBesoin.categorie,
          cout: parseInt(formulaireBesoin.montant)
        });
        setAfficherFormulaireBesoin(false);
      }
      reinitialiserFormulaireBesoin();
    } catch (error) {
      console.error("Erreur lors de la soumission du besoin:", error);
    }
  };

  const soumettreBesoinDepartement = async (e) => {
    e.preventDefault();
    try {
      if (besoinEnEdition) {
        await mettreAJourBesoin(besoinEnEdition.id, {
          description: formulaireBesoin.description,
          categorie: formulaireBesoin.categorie,
          cout: parseInt(formulaireBesoin.montant)
        });
        setBesoinEnEdition(null);
      } else {
        await ajouterBesoinDepartement({
          description: formulaireBesoin.description,
          categorie: formulaireBesoin.categorie,
          cout: parseInt(formulaireBesoin.montant)
        });
      }
      reinitialiserFormulaireBesoin();
      setAfficherFormulaireBesoin(false);
    } catch (error) {
      console.error("Erreur lors de la soumission du besoin département:", error);
    }
  };

  const soumettreRecette = async (e) => {
    e.preventDefault();
    try {
      if (recetteEnEdition) {
        await mettreAJourRecette(recetteEnEdition.id, {
          description: formulaireRecette.description,
          categorie: formulaireRecette.categorie,
          montant: parseInt(formulaireRecette.montant)
        });
        setRecetteEnEdition(null);
        setAfficherModalEditionRecette(false);
      } else {
        await ajouterRecette({
          description: formulaireRecette.description,
          categorie: formulaireRecette.categorie,
          montant: parseInt(formulaireRecette.montant)
        });
      }
      reinitialiserFormulaireRecette();
    } catch (error) {
      console.error("Erreur lors de la soumission de la recette:", error);
    }
  };

  // Gestion des éditions
  const modifierBesoin = (idBesoin) => {
    const besoinAModifier = besoins.find(b => b.id === idBesoin);
    if (besoinAModifier) {
      setBesoinEnEdition(besoinAModifier);
      setFormulaireBesoin({
        description: besoinAModifier.description,
        categorie: besoinAModifier.categorie,
        montant: besoinAModifier.cout?.toString() || ''
      });
      setAfficherModalEditionBesoin(true);
    }
  };

  const modifierRecette = (idRecette) => {
    const recetteAModifier = recettes.find(r => r.id === idRecette);
    if (recetteAModifier) {
      setRecetteEnEdition(recetteAModifier);
      setFormulaireRecette({
        description: recetteAModifier.description,
        categorie: recetteAModifier.categorie,
        montant: recetteAModifier.montant?.toString() || ''
      });
      setAfficherModalEditionRecette(true);
    }
  };

  // Suppressions
  const supprimerBesoinChef = async (idBesoin) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce besoin ?')) {
      try {
        await supprimerBesoin(idBesoin);
      } catch (error) {
        console.error("Erreur lors de la suppression du besoin:", error);
      }
    }
  };

  const supprimerRecetteChef = async (idRecette) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette recette ?')) {
      try {
        await supprimerRecette(idRecette);
      } catch (error) {
        console.error("Erreur lors de la suppression de la recette:", error);
      }
    }
  };

  // Réinitialisation des formulaires
  const reinitialiserFormulaireBesoin = () => {
    setFormulaireBesoin({
      description: '',
      categorie: '60 - Achats et variations de stocks',
      montant: ''
    });
  };

  const reinitialiserFormulaireRecette = () => {
    setFormulaireRecette({
      description: '',
      categorie: '70 - Ventes',
      montant: ''
    });
  };

  // Configuration des onglets
  const onglets = [
    {
      id: 'gestion-depenses',
      label: 'Gestion des Dépenses',
      content: (
        <>
          <ProfilUtilisateur />
          <Card 
            title={`Besoins généraux du Département : ${departementCourant?.nom || ''}`}
            headerActions={
              <Button type="primary" onClick={consoliderBesoinsDepartement}>
                Consolider et soumettre à la Direction
              </Button>
            }
          >
            <Table
              headers={['Auteur', 'Description', 'Nomenclature', 'Montant demandé', 'Statut', 'Actions']}
              data={besoinsDepartement}
              renderRow={(besoin) => {
                const auteur = utilisateurs.find(u => u.id === besoin.idAuteur);
                return (
                  <tr key={besoin.id}>
                    <td>{auteur ? `${auteur.prenom} ${auteur.nom}` : 'Inconnu'}</td>
                    <td>{besoin.description}</td>
                    <td>{besoin.categorie}</td>
                    <td>{besoin.cout?.toLocaleString('fr-FR') || 'N/A'} {parametres.devise}</td>
                    <td><StatusBadge status={besoin.statut} /></td>
                    <td className="action-buttons">
                      {besoin.statut === 'Soumis' && (
                        <>
                          <button className="btn-icon" onClick={() => modifierBesoin(besoin.id)}>✏️</button>
                          <Button type="danger" size="sm" onClick={() => mettreAJourStatutBesoin(besoin.id, 'Rejete par CDepartement')}>
                            Rejeter
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              }}
            />
          </Card>

          {afficherFormulaireBesoin ? (
            <Card title={besoinEnEdition ? "Modifier le besoin" : "Nouveau besoin départemental"}>
              <form onSubmit={soumettreBesoinDepartement}>
                <div className="form-group">
                  <label htmlFor="description">Description du besoin</label>
                  <input 
                    type="text" 
                    name="description" 
                    value={formulaireBesoin.description}
                    onChange={gererChangementBesoin}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="categorie">Nomenclature Budgétaire</label>
                  <select 
                    name="categorie" 
                    value={formulaireBesoin.categorie}
                    onChange={gererChangementBesoin}
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
                  <label htmlFor="montant">Montant estimé (en {parametres.devise})</label>
                  <input 
                    type="number" 
                    name="montant" 
                    value={formulaireBesoin.montant}
                    onChange={gererChangementBesoin}
                    required 
                    min="0"
                  />
                </div>
                <div className="form-actions">
                  <Button type="secondary" onClick={() => {
                    setAfficherFormulaireBesoin(false);
                    setBesoinEnEdition(null);
                    reinitialiserFormulaireBesoin();
                  }}>
                    Annuler
                  </Button>
                  <Button type="primary">
                    {besoinEnEdition ? "Mettre à jour" : "Enregistrer"}
                  </Button>
                </div>
              </form>
            </Card>
          ) : (
            <Card title="Besoins spécifiques du Département">
              <Button 
                type="primary" 
                onClick={() => setAfficherFormulaireBesoin(true)}
                style={{ marginBottom: '20px' }}
              >
                Nouveau besoin départemental
              </Button>
              
              <Table
                headers={['Description', 'Nomenclature', 'Montant demandé', 'Statut', 'Actions']}
                data={besoinsSpecifiquesDepartement}
                renderRow={(besoin) => (
                  <tr key={besoin.id}>
                    <td>{besoin.description}</td>
                    <td>{besoin.categorie}</td>
                    <td>{besoin.cout?.toLocaleString('fr-FR') || 'N/A'} {parametres.devise}</td>
                    <td><StatusBadge status={besoin.statut} /></td>
                    <td className="action-buttons">
                      {besoin.statut === 'Soumis' ? (
                        <>
                          <button className="btn-icon" onClick={() => modifierBesoin(besoin.id)}>✏️</button>
                          <button className="btn-icon" onClick={() => supprimerBesoinChef(besoin.id)}>🗑️</button>
                        </>
                      ) : 'Verrouillé'}
                    </td>
                  </tr>
                )}
              />
            </Card>
          )}
        </>
      )
    },
    {
      id: 'gestion-recettes',
      label: 'Gestion des Recettes',
      content: (
        <>
          <Card title={recetteEnEdition ? "Modifier une recette" : "Ajouter une recette"}>
            <form onSubmit={soumettreRecette}>
              <div className="form-group">
                <label htmlFor="description">Source de la recette</label>
                <input
                  type="text"
                  name="description"
                  value={formulaireRecette.description}
                  onChange={gererChangementRecette}
                  required
                  placeholder="Formation payante, vente d'expertise..."
                />
              </div>
              <div className="form-group">
                <label htmlFor="categorie">Nomenclature Budgétaire</label>
                <select
                  name="categorie"
                  value={formulaireRecette.categorie}
                  onChange={gererChangementRecette}
                  required
                >
                  <option value="70 - Ventes">70 - Ventes (Prestations de service, expertises)</option>
                  <option value="72 - Production immobilisée">72 - Production immobilisée</option>
                  <option value="75 - Autres produits opérationnels">75 - Autres produits opérationnels (Droits d'inscription)</option>
                  <option value="77 - Revenus financiers">77 - Revenus financiers</option>
                  <option value="78 - Subventions d'exploitation">78 - Subventions d'exploitation</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="montant">Montant prévu (en {parametres.devise})</label>
                <input
                  type="number"
                  name="montant"
                  value={formulaireRecette.montant}
                  onChange={gererChangementRecette}
                  required
                  min="0"
                />
              </div>
              <div className="form-actions">
                <Button 
                  type="secondary" 
                  onClick={() => {
                    setRecetteEnEdition(null);
                    reinitialiserFormulaireRecette();
                  }}
                >
                  Annuler
                </Button>
                <Button type="primary">
                  {recetteEnEdition ? "Mettre à jour" : "Ajouter"}
                </Button>
              </div>
            </form>
          </Card>

          <Card title="Recettes prévisionnelles du Département">
            <Table
              headers={['Source', 'Nomenclature', 'Montant Prévu', 'Actions']}
              data={recettesDepartement}
              renderRow={(recette) => (
                <tr key={recette.id}>
                  <td>{recette.description}</td>
                  <td>{recette.categorie}</td>
                  <td>{recette.montant.toLocaleString('fr-FR')} {parametres.devise}</td>
                  <td className="action-buttons">
                    <button className="btn-icon" onClick={() => modifierRecette(recette.id)}>✏️</button>
                    <button className="btn-icon" onClick={() => supprimerRecetteChef(recette.id)}>🗑️</button>
                  </td>
                </tr>
              )}
            /> 
          </Card>
        </>
      )
    }
  ];

  return (
    <>
      <Tabs tabs={onglets} />
      
      {/* Modal d'édition de besoin */}
      {afficherModalEditionBesoin && besoinEnEdition && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Modifier le besoin</h2>
              <button onClick={() => setAfficherModalEditionBesoin(false)}>
                &times;
              </button>
            </div>
            
            <form onSubmit={soumettreBesoin}>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  name="description"
                  value={formulaireBesoin.description}
                  onChange={gererChangementBesoin}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Montant demandé</label>
                <input
                  type="number"
                  name="montant"
                  value={formulaireBesoin.montant}
                  onChange={gererChangementBesoin}
                  required
                  min="0"
                />
              </div>
              
              <div className="modal-actions">
                <Button 
                  type="danger" 
                  onClick={() => {
                    setAfficherModalEditionBesoin(false);
                    setBesoinEnEdition(null);
                    reinitialiserFormulaireBesoin();
                  }}
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

      {/* Modal d'édition de recette */}
      {afficherModalEditionRecette && recetteEnEdition && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Modifier la recette</h2>
              <button onClick={() => setAfficherModalEditionRecette(false)}>
                &times;
              </button>
            </div>
            
            <form onSubmit={soumettreRecette}>
              <div className="form-group">
                <label>Source</label>
                <input
                  type="text"
                  name="description"
                  value={formulaireRecette.description}
                  onChange={gererChangementRecette}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Nomenclature</label>
                <select
                  name="categorie"
                  value={formulaireRecette.categorie}
                  onChange={gererChangementRecette}
                  required
                >
                  <option value="70 - Ventes">70 - Ventes</option>
                  <option value="72 - Production immobilisée">72 - Production immobilisée</option>
                  <option value="75 - Autres produits opérationnels">75 - Autres produits opérationnels</option>
                  <option value="77 - Revenus financiers">77 - Revenus financiers</option>
                  <option value="78 - Subventions d'exploitation">78 - Subventions d'exploitation</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Montant prévu</label>
                <input
                  type="number"
                  name="montant"
                  value={formulaireRecette.montant}
                  onChange={gererChangementRecette}
                  required
                  min="0"
                />
              </div>
              
              <div className="modal-actions">
                <Button 
                  type="danger" 
                  onClick={() => {
                    setAfficherModalEditionRecette(false);
                    setRecetteEnEdition(null);
                    reinitialiserFormulaireRecette();
                  }}
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

export default ChefDashboard;
