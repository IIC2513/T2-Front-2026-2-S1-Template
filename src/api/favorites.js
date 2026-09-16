import apiClient from './client';

export async function getFavorites() {
  const { data } = await apiClient.get('/favorites');
  return data;
}

export async function addFavorite(companyId) {
  const { data } = await apiClient.post('/favorites', { companyId });
  return data;
}

export async function removeFavorite(companyId) {
  await apiClient.delete(`/favorites/${companyId}`);
}
