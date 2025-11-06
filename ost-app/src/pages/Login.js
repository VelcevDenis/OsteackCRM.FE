import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";
import styles from "../styles/login.module.css"; // локальные стили
import logo from "../images/logo2.png"; // скорректируй путь если нужен

export default function Login() {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    if (!username || !password) {
      setError(t("error_required_fields"));
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    const formDetails = new URLSearchParams();
    formDetails.append("username", username);
    formDetails.append("password", password);

    try {
      const response = await fetch("http://localhost:8000/auth/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formDetails,
      });

      setLoading(false);

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.access_token);
        navigate("/menu/dashboard");
        window.location.reload();
      } else {
        const errorData = await response.json();
        setError(errorData.detail || t("error_auth_failed"));
      }
    } catch (error) {
      setLoading(false);
      setError(t("error_generic"));
    }
  };

 return (
  <>
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
         <div className={styles.logoWrap}>
           <img src={logo} alt="OSACO" className={styles.logo} />
         </div>
         <div className={styles.topBar}>
           <LanguageSwitcher />
         </div>
        <h2>{t("login")}</h2>
        <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label>{t("username")}:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t("placeholder_username")}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>{t("password")}:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("placeholder_password")}
                required
              />
            </div>

            <button
              type="submit"
              className={`${styles.btn} btn btn-primary`} // btn-primary от Bootstrap
              disabled={loading}
            >
              {loading ? t("logging_in") : t("login")}
            </button>

            {error && (
              <p className={`${styles.errorMessage} text-danger`}>{error}</p>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
