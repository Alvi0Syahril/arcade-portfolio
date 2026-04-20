export interface AuthResponse {
  token: string;
  user: { id: string; email: string };
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch('http://localhost:3001/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Network response was not ok');
  }

  return data;
};
