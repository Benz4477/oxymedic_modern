const API_BASE_URL = "http://localhost:5000/api";

export const login = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Identifiant ou mot de passe incorrect");
  }
  return data;
};
