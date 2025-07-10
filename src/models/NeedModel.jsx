export class NeedModel {
    constructor(data = {}) {
        this.id = data.id || null;
        this.titre = data.titre || '';
        this.description = data.description || '';
        this.categorie = data.categorie || '';
        this.cout = data.cout || 0;
        this.statut = data.statut || 'Soumis';
        this.dateSoumission = data.dateSoumission || new Date().toISOString();
        this.idAuteur = data.idAuteur || null;
        this.auteur = data.auteur || null;
        
        
        this.auteur = data.auteur || null;
        this.validations = data.validations || [];
    }

    get formattedDate() {
        return new Date(this.dateSoumission).toLocaleDateString();
    }

    get isSoumis() {
        return this.statut === 'Soumis';
    }
    
    get isConsolide() {
        return this.statut === 'Consolide';
    }
    
    get isApprouve() {
        return this.statut === 'Approuve';
    }
    
    get isRejeteParChefDepartemen() {
        return this.statut === 'Rejete par C.Departemen';
    }

    get isRejeteParDirection() {
        return this.statut === 'Rejete par Direction';
    }

}

export default NeedModel;