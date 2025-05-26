export const API_BASE_URL = 'http://localhost:8000';
export const AUTH_BASE_URL = `${API_BASE_URL}/api/auth`;

export const API_ROUTES = {
  // Auth routes
  LOGIN: `${AUTH_BASE_URL}/login/`,
  LOGOUT: `${AUTH_BASE_URL}/logout/`,
  REGISTER: `${AUTH_BASE_URL}/register/`,
  PROFILE: `${AUTH_BASE_URL}/profile/`,

  // Project routes
  PROJECTS: `${API_BASE_URL}/api/projects/`,
  PROJECT_DETAIL: (projectId) => `${API_BASE_URL}/api/projects/${projectId}/`,
  VERIFY_PROJECT: (projectId) => `${API_BASE_URL}/api/projects/${projectId}/verify/`,

  // Task routes
  CREATE_TASK: (projectId) => `${API_BASE_URL}/api/projects/${projectId}/tasks/`,
  MANAGE_TASK: (projectId, taskId) => `${API_BASE_URL}/api/projects/${projectId}/tasks/${taskId}/`,
};