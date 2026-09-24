
const STORAGE_KEYS = {
  transactions: "verde_transactions",
  theme: "verde_theme",
  budget: "verde_budget"
};

const Storage = {
  getTransactions() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.transactions)) || [];
  },

  saveTransactions(data) {
    localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(data));
  },

  getTheme() {
    return localStorage.getItem(STORAGE_KEYS.theme) || "dark";
  },

  saveTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.theme, theme);
  },

  getBudget() {
    return Number(localStorage.getItem(STORAGE_KEYS.budget)) || 5000;
  },

  saveBudget(value) {
    localStorage.setItem(STORAGE_KEYS.budget, value);
  }
};