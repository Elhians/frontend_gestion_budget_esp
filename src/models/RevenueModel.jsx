export class RevenueModel {
    constructor(data = {}) {
        this.id = data.id || null;
        this.description = data.description || '';
        this.categorie = data.categorie || '';
        this.montant = data.montant || 0;
        this.idDepartement = data.idDepartement || null;
        this.dateCreation = data.dateCreation || new Date().toISOString();
        
        // Relations
        this.departement = data.departement || null;
    }

    get formattedMontant() {
        return this.montant.toLocaleString('fr-FR') + ' FCFA';
    }
}

export default RevenueModel;