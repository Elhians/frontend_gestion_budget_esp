import React, { useContext } from 'react';
import { AppContext } from '../App';
import RoleSelector from './RoleSelector';

const Header = () => {
  const { roleDeConnection } = useContext(AppContext);

  return (
    <header>
      <h1>ESP - Digitalisation du Budget</h1>
      {roleDeConnection === 'CHEF_DEPARTEMENT' && <RoleSelector />}
    </header>
  );
};

export default Header;