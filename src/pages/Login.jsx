import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { AppContext } from '../App';
import authService from '../services/authService';

const Login = () => {
  const { connecterUtilisateur, loggerActivite } = useContext(AppContext);
  const [credentials, setCredentials] = useState({
    email: '',
    mot_de_passe: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!credentials.email || !credentials.mot_de_passe) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    
    try {
      // Appel direct avec les paramètres séparés pour plus de clarté
      const response = await authService.login(
        credentials.email, 
        credentials.mot_de_passe
      );

      console.log('reponse de connection : ',response)
      
      // Vérification de la structure de réponse attendue
      if (!response || !response.utilisateur || !response.token) {
        throw new Error('Réponse du serveur invalide');
      }
      
      const userData = {
        id: response.utilisateur.id,
        email: response.utilisateur.email,
        role: response.utilisateur.role,
        nom: response.utilisateur.nom,
        prenom: response.utilisateur.prenom,
        departement: response.utilisateur.departement
      };
      
      connecterUtilisateur(response.token, response.utilisateur);
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setError(error.message || 'Email ou mot de passe incorrect');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card title="Connexion au système budgétaire" className="login-card">
        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="alert alert-error">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{error}</span>
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Adresse email</label>
            <input
              type="email"
              id="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="votre.email@organisation.com"
              className="input-field"
              disabled={isLoading}
              autoFocus
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="mot_de_passe">Mot de passe</label> {/* Changé de 'password' à 'mot_de_passe' */}
            <input
              type="password"
              id="mot_de_passe" // Changé de 'password' à 'mot_de_passe'
              value={credentials.mot_de_passe}
              onChange={handleChange}
              placeholder="Votre mot de passe"
              className="input-field"
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="form-actions">
            <Button 
              type="primary" 
              fullWidth 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Connexion en cours...' : 'Connexion'}
            </Button>
          </div>
        </form>
      </Card>
      
      <style jsx>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80vh;
          background-color: #f8fafc;
          padding: 2rem;
        }
        
        .login-card {
          width: 100%;
          max-width: 480px;
          padding: 2.5rem;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        }
        
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .input-field {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          font-size: 1rem;
          transition: border-color 0.2s;
        }
        
        .input-field:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
        }
        
        .alert-error {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          background-color: #fee2e2;
          color: #b91c1c;
          border-radius: 0.375rem;
          font-size: 0.875rem;
        }
        
        @media (max-width: 640px) {
          .login-card {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;