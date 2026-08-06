import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_URL || "https://crms-1.onrender.com/api").replace(/\/auth\/?$/, "");

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

const mapExpense = (expense) => {
  return {
    ...expense,
    submittedDate: expense.createdAt ? new Date(expense.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : ""
  };
};

const expenseService = {
  createExpense: async (expenseData) => {
    const response = await axios.post(`${API_BASE}/expenses`, expenseData, authHeaders());
    if (response.data.success && response.data.expense) {
      response.data.expense = mapExpense(response.data.expense);
    }
    return response.data;
  },
  
  getMyExpenses: async () => {
    const response = await axios.get(`${API_BASE}/expenses/mine`, authHeaders());
    if (response.data.success && response.data.expenses) {
      response.data.expenses = response.data.expenses.map(mapExpense);
    }
    return response.data;
  },

  getAllExpenses: async () => {
    const response = await axios.get(`${API_BASE}/expenses`, authHeaders());
    if (response.data.success && response.data.expenses) {
      response.data.expenses = response.data.expenses.map(mapExpense);
    }
    return response.data;
  },

  
  getExpenseById: async (id) => {
    const response = await axios.get(`${API_BASE}/expenses/${id}`, authHeaders());
    if (response.data.success && response.data.expense) {
      response.data.expense = mapExpense(response.data.expense);
    }
    return response.data;
  },

  updateExpenseStatus: async (id, status, rejectReason = "") => {
    const response = await axios.patch(`${API_BASE}/expenses/${id}`, { status, rejectReason }, authHeaders());
    if (response.data.success && response.data.expense) {
      response.data.expense = mapExpense(response.data.expense);
    }
    return response.data;
  }
};

export default expenseService;
