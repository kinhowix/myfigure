import { useState } from 'react';
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth } from '../firebase/config';
import './Login.css';

import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Define a persistência como LOCAL antes de fazer o login
      // Isso garante que a sessão dure mesmo após fechar o navegador/app
      await setPersistence(auth, browserLocalPersistence);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
      setError('E-mail ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <button className="back-link" onClick={() => navigate('/')}>&larr; Voltar</button>
        <h1>MyFigure</h1>
        <p className="login-subtitle">O álbum da família</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>E-mail</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              required
            />
          </div>
          <div className="input-group">
            <label>Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar no Álbum'}
          </button>
        </form>
      </div>
    </div>
  );
}
