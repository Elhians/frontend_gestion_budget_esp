export class DepartmentModel {
    constructor(data = {}) {
        this.id = data.id || null;
        this.nom = data.nom || '';
        this.budget = data.budget || 0;
        
        
        this.chef = data.chef || null;
    }
}

export default DepartmentModel;