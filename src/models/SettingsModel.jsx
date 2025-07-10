export class SettingsModel {
    constructor(data = {}) {
        this.id = data.id || 1;
        this.anneeBudgetaire = data.anneeBudgetaire || new Date().getFullYear().toString();
        this.dateLimiteSoumission = data.dateLimiteSoumission || new Date(new Date().getFullYear(), 2, 15).toISOString().split('T')[0];
        this.notificationsActivees = data.notificationsActivees || true;
        this.devise = data.devise || 'XOF';
    }

    get formattedDateLimite() {
        return new Date(this.dateLimiteSoumission).toLocaleDateString('fr-FR');
    }
}

export default SettingsModel;