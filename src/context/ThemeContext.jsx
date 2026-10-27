import React, {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
} from "react";
import { useAuth } from "./AuthContext.jsx";

const ThemeContext = createContext();

const DEFAULT_THEME = "black";
const BOOTSTRAP_THEME_KEY = "pg-theme-last";

const isValidTheme = (theme) =>
  theme === "black" || theme === "offwhite";

const getThemeKey = (user, activeRole) => {
  if (!user) return null;

  const role =
    activeRole ||
    user.role ||
    (Array.isArray(user.roles) && user.roles.length > 0
      ? user.roles[0]
      : "user");

  const userId =
    user._id ||
    user.id ||
    user.email ||
    role;

  return `pg-theme-${role}-${userId}`;
};

const getTokenPayload = () => {
  try {
    const token = sessionStorage.getItem("token");

    if (!token) return null;

    const parts = token.split(".");

    if (parts.length !== 3) return null;

    const base64 = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );

    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
};

const getBootstrapThemeKey = () => {
  const payload = getTokenPayload();
  const activeRole = sessionStorage.getItem("activeRole");

  if (!payload) return null;

  const role =
    activeRole ||
    payload.role ||
    payload.activeRole ||
    "user";

  const userId =
    payload._id ||
    payload.id ||
    payload.userId ||
    payload.sub ||
    payload.email;

  if (!userId) return null;

  return `pg-theme-${role}-${userId}`;
};

const getInitialTheme = () => {
  const exactKey = getBootstrapThemeKey();

  if (exactKey) {
    const exactTheme = localStorage.getItem(exactKey);

    if (isValidTheme(exactTheme)) {
      return exactTheme;
    }
  }

  const bootstrapTheme = localStorage.getItem(
    BOOTSTRAP_THEME_KEY
  );

  if (isValidTheme(bootstrapTheme)) {
    return bootstrapTheme;
  }

  return DEFAULT_THEME;
};

const applyThemeImmediately = (theme) => {
  if (!isValidTheme(theme)) return;

  const bg =
    theme === "black"
      ? "#000000"
      : "#f7f1e7";

  document.documentElement.setAttribute(
    "data-theme",
    theme
  );

  document.documentElement.style.backgroundColor = bg;

  if (document.body) {
    document.body.classList.remove(
      "theme-black",
      "theme-offwhite"
    );

    document.body.classList.add(
      `theme-${theme}`
    );

    document.body.style.backgroundColor = bg;
  }
};

const INITIAL_THEME = getInitialTheme();

if (typeof document !== "undefined") {
  applyThemeImmediately(INITIAL_THEME);
}

export const ThemeProvider = ({ children }) => {
  const { user, activeRole } = useAuth();

  const themeKey = getThemeKey(
    user,
    activeRole
  );

  const [theme, setTheme] =
    useState(INITIAL_THEME);

  useLayoutEffect(() => {
    const savedTheme = themeKey
      ? localStorage.getItem(themeKey)
      : null;

    const lastTheme = localStorage.getItem(
      BOOTSTRAP_THEME_KEY
    );

    if (isValidTheme(savedTheme)) {
      setTheme(savedTheme);
      applyThemeImmediately(savedTheme);
      return;
    }

    if (isValidTheme(lastTheme)) {
      setTheme(lastTheme);
      applyThemeImmediately(lastTheme);

      if (themeKey) {
        localStorage.setItem(
          themeKey,
          lastTheme
        );
      }

      return;
    }

    setTheme(DEFAULT_THEME);
    applyThemeImmediately(DEFAULT_THEME);

    if (themeKey) {
      localStorage.setItem(
        themeKey,
        DEFAULT_THEME
      );
    }

    localStorage.setItem(
      BOOTSTRAP_THEME_KEY,
      DEFAULT_THEME
    );
  }, [themeKey]);

  useLayoutEffect(() => {
    if (!isValidTheme(theme)) return;

    applyThemeImmediately(theme);

    localStorage.setItem(
      BOOTSTRAP_THEME_KEY,
      theme
    );

    if (themeKey) {
      localStorage.setItem(
        themeKey,
        theme
      );
    }
  }, [theme, themeKey]);

  const changeTheme = (newTheme) => {
    if (!isValidTheme(newTheme)) return;

    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        changeTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
};