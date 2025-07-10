import React, { useContext } from 'react';
import { AppContext } from '../App';

const RoleSelector = () => {
  const { roleUtilisateurActuel, definirRoleUtilisateurActuel } = useContext(AppContext);

  const handleRoleChange = (e) => {
    const displayRole = e.target.value;
    
    const actualRole = getRoleValue(displayRole);
    
    definirRoleUtilisateurActuel(actualRole);
  };


  const getRoleValue = (displayRole) => {
    switch(displayRole) {
      case 'inconnu': return 'INCONNU';
      case 'agent': return 'ENSEIGNANT';
      case 'chef': return 'CHEF_DEPARTEMENT';
      case 'direction': return 'DIRECTEUR';
      case 'admin': return 'ADMIN';
      default: return 'ENSEIGNANT';
    }
  };

 
  const getDisplayRole = (role) => {
    switch(role) {
      case 'INCONNU': return 'inconnu';
      case 'ENSEIGNANT': return 'agent';
      case 'CHEF_DEPARTEMENT': return 'chef';
      case 'DIRECTEUR': return 'direction';
      case 'ADMIN': return 'admin';
      default: return 'agent';
    }
  };

  return (
    <div className="user-role-selector">
      <label htmlFor="role-switcher">Connecté en tant que :</label>
      <select 
        id="role-switcher" 
        value={getDisplayRole(roleUtilisateurActuel)} 
        onChange={handleRoleChange}
      >
        {/* <option value="inconnu">Non Conecté(e) </option> */}
        <option value="agent">Agent / Enseignant</option>
        <option value="chef">Chef de Département/service</option>
        {/* <option value="direction">Direction ESP</option> */}
        {/* <option value="admin">Administrateur</option> */}
      </select>
    </div>
  );
};

export default RoleSelector;