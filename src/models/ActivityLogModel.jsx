export class ActivityLogModel {
    constructor(data = {}) {
        this.id = data.id || null;
        this.dateHeure = data.dateHeure || new Date().toISOString();
        this.idUtilisateur = data.idUtilisateur || null;
        this.action = data.action || '';
        this.details = data.details || '';
        this.ipAdresse = data.ipAdresse || '';
        
        this.utilisateur = data.utilisateur || null;
    }

    get formattedDate() {
        return new Date(this.dateHeure).toLocaleString('fr-FR');
    }
}

export default ActivityLogModel;