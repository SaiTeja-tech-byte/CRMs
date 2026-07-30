import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_URL || "https://crms-1.onrender.com/api").replace(/\/auth\/?$/, "");

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

const mapTicket = (ticket) => {
  return {
    ...ticket,
    createdDate: ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : ""
  };
};

const ticketService = {
  createTicket: async (ticketData) => {
    const response = await axios.post(`${API_BASE}/tickets`, ticketData, authHeaders());
    if (response.data.success && response.data.ticket) {
      response.data.ticket = mapTicket(response.data.ticket);
    }
    return response.data;
  },
  
  getMyTickets: async () => {
    const response = await axios.get(`${API_BASE}/tickets/mine`, authHeaders());
    if (response.data.success && response.data.tickets) {
      response.data.tickets = response.data.tickets.map(mapTicket);
    }
    return response.data;
  },

  getAllTickets: async () => {
    const response = await axios.get(`${API_BASE}/tickets`, authHeaders());
    if (response.data.success && response.data.tickets) {
      response.data.tickets = response.data.tickets.map(mapTicket);
    }
    return response.data;
  },

  updateTicketStatus: async (id, data) => {
    // data can include { status, assignedToId, assignedToName }
    const response = await axios.patch(`${API_BASE}/tickets/${id}`, data, authHeaders());
    if (response.data.success && response.data.ticket) {
      response.data.ticket = mapTicket(response.data.ticket);
    }
    return response.data;
  },
  
  replyToTicket: async (id, replyData) => {
    // replyData is { text, attachments }
    const response = await axios.post(`${API_BASE}/tickets/${id}/reply`, replyData, authHeaders());
    if (response.data.success && response.data.ticket) {
      response.data.ticket = mapTicket(response.data.ticket);
    }
    return response.data;
  }
};

export default ticketService;
