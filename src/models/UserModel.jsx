export class UserModel {
    constructor(data = {}) {
        this.id = data.id || null;
        this.prenom = data.prenom || '';
        this.nom = data.nom || '';
        this.email = data.email || '';
        this.motDePasse = data.motDePasse || '';
        this.role = data.role || 'ENSEIGNANT';
        this.statut = data.statut || 'inactive';
        this.dateCreation = data.dateCreation || new Date().toISOString();
        this.dateModification = data.dateModification || new Date().toISOString();
        this.resetToken = data.resetToken || null;
        this.resetTokenExpiration = data.resetTokenExpiration || null;
        this.idDepartementAppartenance = data.idDepartementAppartenance || null;
        this.idDepartementDirection = data.idDepartementDirection || null;
        
        
        this.departementAppartenance = data.departementAppartenance || null;
        this.departementDirection = data.departementDirection || null;
    }

    get fullName() {
        return `${this.prenom} ${this.nom}`;
    }

    isChefDepartement() {
        return this.role === 'CHEF_DEPARTEMENT';
    }

    isDirecteur() {
        return this.role === 'DIRECTEUR';
    }

    isEnseignant() {
        return this.role === 'ENSEIGNANT';
    }

    isAgent() {
        return this.role === 'AGENT';
    }
}

export default UserModel;