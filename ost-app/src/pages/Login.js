import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Login() {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    if (!username || !password) {
      setError(t('error_required_fields'));
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    const formDetails = new URLSearchParams();
    formDetails.append('username', username);
    formDetails.append('password', password);

    try {
      const response = await fetch('http://localhost:8000/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formDetails,
      });

      setLoading(false);

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        navigate('/menu/dashboard');
        window.location.reload();
      } else {
        const errorData = await response.json();
        setError(errorData.detail || t('error_auth_failed'));
      }
    } catch (error) {
      setLoading(false);
      setError(t('error_generic'));
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{t('login')}</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>{t('username')}:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t('placeholder_username')}
              required
            />
          </div>
          <div className="input-group">
            <label>{t('password')}:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('placeholder_password')}
              required
            />
          </div>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? t('logging_in') : t('login')}
          </button>
          {error && <p className="error-message text-danger">{error}</p>}
        </form>
      </div>
    </div>
  );
}
