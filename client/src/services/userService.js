const API_BASE_URL = "http://192.168.11.233:5000/api";
export const fetchActiveUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/users`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      data.message || "Erreur lors de la récupération des utilisateurs",
    );
  }
  return data.data;
};

export const getUserById = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      data.message || "Erreur lors de la récupération de l'utilisateur",
    );
  }
  return data.data;
};
