import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// Dashboard
export const fetchSummary = () => api.get('/dashboard/summary').then(r => r.data);
export const fetchFundAllocation = () => api.get('/dashboard/fund-allocation').then(r => r.data);
export const fetchApplicationFlow = () => api.get('/dashboard/application-flow').then(r => r.data);
export const fetchProjectedVsActual = () => api.get('/dashboard/projected-vs-actual').then(r => r.data);

// Beneficiaries
export const fetchBeneficiaries = () => api.get('/beneficiaries').then(r => r.data);
export const createBeneficiary = (data) => api.post('/beneficiaries', data).then(r => r.data);

// Applications
export const fetchApplications = () => api.get('/applications').then(r => r.data);
export const fetchKanban = () => api.get('/applications/kanban').then(r => r.data);
export const verifyApplication = (id, data) => api.post(`/applications/${id}/verify`, data).then(r => r.data);

// Grants
export const fetchGrants = () => api.get('/grants').then(r => r.data);

// Payments
export const fetchPayments = () => api.get('/payments').then(r => r.data);

// Fraud
export const fetchFraudLogs = () => api.get('/fraud').then(r => r.data);
export const fetchHighRisk = () => api.get('/fraud/high-risk').then(r => r.data);
export const fetchRiskDistribution = () => api.get('/fraud/distribution').then(r => r.data);

// Chatbot Queries
export const fetchChatbotQueries = () => api.get('/chatbot').then(r => r.data);

// Staff
export const fetchStaff = () => api.get('/staff').then(r => r.data);

export default api;
