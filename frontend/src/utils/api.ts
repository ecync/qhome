export const getAuthHeaders = () => {
  const username = sessionStorage.getItem('username');
  const password = sessionStorage.getItem('password');
  return {
    'X-USERNAME': username || '',
    'X-PASSWORD': password || '',
    'Content-Type': 'application/json',
  };
};

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const headers = { ...getAuthHeaders(), ...(options.headers || {}) };
  const response = await fetch(url, { ...options, headers });
  
  if (response.status === 401) {
    // Handle unauthorized access (e.g., redirect to login)
    window.location.href = '/login';
  }
  
  return response;
};
