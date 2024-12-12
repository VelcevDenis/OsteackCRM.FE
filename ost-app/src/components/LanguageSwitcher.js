import React from 'react';
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="dropdown languages">
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        id="languageDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        🌐 {t('language')}
      </button>
      <ul className="dropdown-menu" aria-labelledby="languageDropdown">
        <li>
          <button
            className="dropdown-item"
            onClick={() => changeLanguage('ru')}
          >
            🇷🇺 Русский
          </button>
        </li>
        <li>
          <button
            className="dropdown-item"
            onClick={() => changeLanguage('en')}
          >
            🇬🇧 English
          </button>
        </li>        
      </ul>
    </div>
  );
}

export default LanguageSwitcher;
