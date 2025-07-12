import React, { useContext } from 'react';
import { AppContext } from '../App';
import RoleSelector from './RoleSelector';

const Header = () => {
  const { roleDeConnection } = useContext(AppContext);

  const handleTitleClick = () => {
    window.location.href = "https://frontend-gestion-budget-esp.onrender.com";
  };

  return (
    <header>
      <h1 style={{ cursor: 'pointer' }} onClick={handleTitleClick}>
        ESP - Digitalisation du Budget
      </h1>
      {roleDeConnection === 'CHEF_DEPARTEMENT' && <RoleSelector />}
    </header>
  );
};

export default Header;
