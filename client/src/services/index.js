// Export de tous les services API
export { default as authService } from './authService';
export { default as userService } from './userService';
export { 
  fetchDashboardStats,
  fetchRecentOrders,
  fetchTodayDeliveries,
  fetchMonthlyDeliveryCosts,
  fetchRecentPayments,
  fetchAlerts,
  fetchSociete
} from './dashboardService';
