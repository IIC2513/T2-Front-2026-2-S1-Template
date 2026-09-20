import apiClient from './client';

export async function getCompanyReviews(companyId) {
  const { data } = await apiClient.get(`/companies/${companyId}/reviews`);
  return data; 
}

export async function createCompanyReview(companyId, { rating, comment }) {
  const { data } = await apiClient.post(`/companies/${companyId}/reviews`, { rating, comment });
  return data; 
}