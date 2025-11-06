import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { logout, getUserRole } from "../../utils/authHelper";
import { useTranslation } from "react-i18next";
import styles from "../../styles/menu.module.css";
import LanguageSwitcherSideBarMenu from "../../components/LanguageSwitcherSideBarMenu";

// конфигурация пунктов меню
const buildNavItems = (t, role) => [
  {
    key: "dashboard",
    label: t("dashboard"),
    icon: "lni lni-dashboard-square-1",
    route: "/menu/dashboard",
  },
  {
    key: "Products",
    label: t("orders"),
    icon: "lni lni-line-height",
    route: "/menu/products",
  },
  {
    key: "users",
    label: t("users"),
    icon: "lni lni-user-multiple-4",
    children: [
      ...(role === 1 || role === 2
        ? [
          {
            key: "employees",
            label: t("employees"),
            route: "/menu/employees",
          },
        ]
        : []),
      {
        key: "PotencialClients",
        label: t("potential_companies"),
        route: "/menu/PotencialClients",
      },
    ],
  },
  ...(role === 1
    ? [
      {
        key: "logs",
        label: t("logs"),
        icon: "lni lni-megaphone-1",
        route: "/menu/logs",
      },
    ]
    : []),
  ...(role === 1 || role === 2
    ? [
      {
        key: "setting",
        label: t("setting"),
        icon: "lni lni-code-1",
        children: [
          {
            key: "SettingsProducts",
            label: t("SettingsProducts"),
            icon: "lni lni-locked-1",
            route: "/menu/SettingsProducts",
          },
        ],
      },
    ]
    : []),
];

const Menu = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // раскрыто/свернуто
  const [isExpanded, setIsExpanded] = useState(true);
  const [openDropdowns, setOpenDropdowns] = useState({});

  // тема с сохранением
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("osaco-theme");
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    localStorage.setItem("osaco-theme", theme);
    document.body.classList.toggle("dark", theme === "dark");
    document.body.classList.toggle("light", theme === "light");
  }, [theme]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "osaco-theme" && (e.newValue === "dark" || e.newValue === "light")) {
        setTheme(e.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggleDropdown = (key) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // useEffect(() => {
  //   localStorage.setItem("osaco-theme", theme);
  // }, [theme]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");

    const handleChange = () => {
      if (mq.matches) {
        // вошли в мобильный брейкпоинт — закрываем меню
        setIsExpanded(false);
      } else {
        // вышли из мобильного — можно вернуть раскрытым (если нужно)
        setIsExpanded(true);
      }
    };

    handleChange(); // инициализация при монтировании
    mq.addEventListener?.("change", handleChange) || mq.addListener(handleChange);

    return () => {
      mq.removeEventListener?.("change", handleChange) || mq.removeListener(handleChange);
    };
  }, []);

  const role = useMemo(() => getUserRole(), []);
  const items = useMemo(() => buildNavItems(t, role), [t, role]);

  const toggleSidebar = () => setIsExpanded((p) => !p);
  const toggleTheme = () => setTheme((p) => (p === "dark" ? "light" : "dark"));

  const handleItemClick = (route) => {
    if (route) navigate(route);
    // на мобилке закрываем меню
    if (window.innerWidth <= 768 && isExpanded) setIsExpanded(false);
  };

  const wrapperClass = [
    styles.wrapper,
    isExpanded ? styles.expanded : styles.collapsed,
    theme === "dark" ? styles.dark : styles.light,
  ].join(" ");

  const isActive = (route) =>
    route &&
    (location.pathname === route || location.pathname.startsWith(route));

  return (
    <div className={wrapperClass}>
      <aside className={styles.sidebar}>
        {/* Header */}
        <div className={styles.headerRow}>
          <button
            className={styles.toggleBtn}
            type="button"
            onClick={toggleSidebar}
            aria-label={isExpanded ? t("collapse") : t("expand")}
            title={isExpanded ? t("collapse") : t("expand")}
          >
            <i class="lni lni-menu-hamburger-1"></i>
          </button>

          {/* <div
            className={styles.brand}
            onClick={() => handleItemClick("/menu/dashboard")}
          >
            <img
              src="https://api.dicebear.com/9.x/bottts/svg?seed=osaco"
              alt="Avatar"
            />
            {isExpanded && (
              <div className={styles.brandMeta}>
                <div className={styles.brandTitle}>Stella Army</div>
                <div className={styles.brandSub}>Web developer</div>
              </div>
            )}
          </div> */}
        </div>

        {/* Search */}
        {isExpanded && (
          <div className={styles.searchBox}>
            <i className="lni lni-search-alt" />
            <input placeholder={t("Search") || "Search..."} />
          </div>
        )}

        {/* Nav */}
        <ul className={styles.nav}>
          {items.map((item) => (
            <li key={item.key} className={styles.navItem}>
              <button
                className={`${styles.navLink} ${isActive(item.route) ? styles.active : ""
                  }`}
                onClick={() =>
                  item.children ? toggleDropdown(item.key) : handleItemClick(item.route)
                }
                title={item.label}
              >
                <i className={item.icon || "lni lni-chevron-right"} />
                {isExpanded && <span>{item.label}</span>}
                {!!item.children && isExpanded && (
                  <i
                    className={`lni lni-chevron-right ${styles.chevron} ${openDropdowns[item.key] ? styles.rotated : ""
                      }`}
                  />
                )}
              </button>

              {!!item.children && (
                <ul
                  className={`${styles.subnav} ${openDropdowns[item.key] ? styles.open : ""
                    }`}
                >
                  {item.children.map((sub) => (
                    <li key={sub.key}>
                      <button
                        className={`${styles.subLink} ${isActive(sub.route) ? styles.active : ""}`}
                        onClick={() => handleItemClick(sub.route)}
                        title={sub.label}
                      >
                        <i className={sub.icon || "lni lni-dot"} />
                        <span>{sub.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className={styles.footer}>
          <button
            className={styles.logout}
            onClick={() => {
              logout();
              navigate("/");
            }}
            title={t("logout")}
          >
            <i className="lni lni-exit" />
            {isExpanded && <span>{t("logout")}</span>}
          </button>

          <div className={styles.themeRow}>
            {isExpanded && (
              <span className={styles.themeLabel}>
                {theme === "light"
                  ? t("Light Mode") || "Light Mode"
                  : t("Dark Mode") || "Dark Mode"}
              </span>
            )}
            <label className={styles.switch} title="Toggle theme">
              <input
                type="checkbox"
                checked={theme === "light"}
                onChange={toggleTheme}
              />
              <span className={styles.slider} />
              <i
                className={`lni ${theme === "light" ? "lni-sun-1" : "lni-moon-half-right-5"
                  }`}
              />
            </label>
          </div>

          {/* язык — в едином стиле */}
          <div className={styles.languageRow}>
            <><LanguageSwitcherSideBarMenu isExpanded={isExpanded} /></>
          </div>
        </div>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

export default Menu;