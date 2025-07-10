export class ValidationModel {
    constructor(data = {}) {
        this.id = data.id || null;
        this.idBesoin = data.idBesoin || null;
        this.idValidateur = data.idValidateur || null;
        this.source = data.source || 'ENSEIGNANT';
        this.statut = data.statut || 'EN_ATTENTE';
        this.commentaire = data.commentaire || '';
        this.dateValidation = data.dateValidation || new Date().toISOString();
        
        
        this.validateur = data.validateur || null;
    }

    get formattedDate() {
        return new Date(this.dateValidation).toLocaleDateString();
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

export default ValidationModel;