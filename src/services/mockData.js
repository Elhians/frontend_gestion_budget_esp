export const initialMockExpenses = [
  { id: 1, agent: 'Prof. Diallo', department: 'Génie Informatique', description: 'Achat de 5 nouveaux PC portables', category: '60 - Achats et variations de stocks', amount: 3500000, amount_n1: 3200000, realized_n1: 3200000, status: 'Soumis' },
  { id: 2, agent: 'Mme. Faye', department: 'Génie Informatique', description: 'Licences logicielles (Pack Adobe)', category: '62 - Services extérieurs A', amount: 1200000, amount_n1: 1000000, realized_n1: 1100000, status: 'Soumis' },
  { id: 3, agent: 'Prof. Diallo', department: 'Génie Informatique', description: 'Participation conférence internationale (Canada)', category: '61 - Transports', amount: 2500000, amount_n1: 2000000, realized_n1: 0, status: 'Soumis' },
  { id: 4, agent: 'M. Sarr', department: 'Génie Civil', description: 'Matériel de topographie laser', category: '60 - Achats et variations de stocks', amount: 7800000, amount_n1: 8000000, realized_n1: 8000000, status: 'Consolide' },
  { id: 5, agent: 'Service Com', department: 'Services Centraux', description: 'Campagne de communication rentrée 2025', category: '62 - Services extérieurs B', amount: 4000000, amount_n1: 3500000, realized_n1: 3800000, status: 'Approuve' }
];

export const initialMockRevenues = [
  { id: 1, department: 'Génie Informatique', description: 'Formation continue "Cybersécurité"', category: '70 - Ventes', amount: 15000000 },
  { id: 2, department: 'Génie Informatique', description: 'Vente d\'expertise (Audit SI)', category: '70 - Ventes', amount: 5000000 },
  { id: 3, department: 'Génie Civil', description: 'Prestation laboratoire BTP', category: '70 - Ventes', amount: 25000000 },
  { id: 4, department: 'Services Centraux', description: 'Droits d\'inscription', category: '75 - Autres produits opérationnels', amount: 120000000 },
];

export const initialMockUsers = [
  { id: 1, firstname: 'Amadou', lastname: 'Diallo', email: 'a.diallo@esp.sn', role: 'agent', department: 'Génie Informatique', status: 'active', password: 'temp123' },
  { id: 2, firstname: 'Fatou', lastname: 'Faye', email: 'f.faye@esp.sn', role: 'agent', department: 'Génie Informatique', status: 'active', password: 'temp123' },
  { id: 3, firstname: 'Moustapha', lastname: 'Sarr', email: 'm.sarr@esp.sn', role: 'chef', department: 'Génie Civil', status: 'active', password: 'temp123' },
  { id: 4, firstname: 'Directeur', lastname: 'ESP', email: 'direction@esp.sn', role: 'direction', department: 'Services Centraux', status: 'active', password: 'temp123' },
  { id: 5, firstname: 'Admin', lastname: 'System', email: 'admin@esp.sn', role: 'admin', department: '', status: 'active', password: 'admin123' }
];

export const initialMockDepartments = [
  { id: 1, name: 'Génie Informatique', code: 'GI', head: 1, budget: 50000000 },
  { id: 2, name: 'Génie Civil', code: 'GC', head: 3, budget: 45000000 },
  { id: 3, name: 'Services Centraux', code: 'SC', head: 4, budget: 30000000 }
];

export const initialMockSettings = {
  budgetYear: '2025',
  deadline: '2025-03-15',
  notifications: true,
  currency: 'FCFA'
};

export const initialMockActivityLogs = [
  { id: 1, timestamp: '2025-01-10 09:15:23', user: 'Admin System', action: 'Connexion', details: 'Connexion réussie', ip: '192.168.1.1' },
  { id: 2, timestamp: '2025-01-10 09:30:45', user: 'Prof. Diallo', action: 'Soumission besoin', details: 'Achat PC portables - 3.500.000 FCFA', ip: '192.168.1.25' },
  { id: 3, timestamp: '2025-01-10 10:15:12', user: 'Mme. Faye', action: 'Soumission besoin', details: 'Licences logicielles - 1.200.000 FCFA', ip: '192.168.1.30' },
  { id: 4, timestamp: '2025-01-10 11:05:33', user: 'Admin System', action: 'Modification utilisateur', details: 'Mise à jour statut M. Sarr', ip: '192.168.1.1' }
];