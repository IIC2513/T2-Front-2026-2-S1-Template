import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';
import { addFavorite, getFavorites, removeFavorite } from '../../api/favorites';
import { useAuth } from '../../context/AuthContext';
import { MarketCompanyCard } from '../../components/CompanyCard/MarketCompanyCard';
import { CompanyDetailModal } from '../../components/Modals/CompanyDetailModal';
import { ConfirmActionModal } from '../../components/Modals/ConfirmActionModal';
import { SuccessMessageModal } from '../../components/Modals/SuccessMessageModal';
import { ErrorMessageModal } from '../../components/Modals/ErrorMessageModal';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import './MarketPage.css';

const PAGE_SIZE = 9;

const MarketPage = () => {
  const { isAuthenticated, updateUser } = useAuth();
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [favoriteActionId, setFavoriteActionId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [pendingAction, setPendingAction] = useState(null); // { type, company }
  const [donateAmount, setDonateAmount] = useState('1000');
  const [successModal, setSuccessModal] = useState(null);
  const [errorModal, setErrorModal] = useState(null);
  const [search, setSearch] = useState('');


  const loadCompanies = useCallback(async (nextPage = 1, searchTerm = '') => {
    setLoading(true);
    try {
      const { data } = await apiClient.get('/companies', {
        params: { page: nextPage, limit: PAGE_SIZE, search: searchTerm || undefined },
      });
      setCompanies(data.data ?? []);
      setPage(data.meta?.currentPage ?? nextPage);
      setTotalPages(data.meta?.totalPages ?? 1);
    } catch (error) {
      console.error('Error cargando el mercado:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCompanies(1);
  }, [loadCompanies]);

  useEffect(() => {
    if (!isAuthenticated) {
      setFavoriteIds([]);
      return;
    }

    getFavorites()
      .then((response) => {
        const companies = response.data ?? [];
        setFavoriteIds(companies.map((company) => company.id));
      })
      .catch((error) => {
        console.error('Error cargando favoritos:', error);
        setFavoriteIds([]);
      });
  }, [isAuthenticated]);

  const handleToggleFavorite = async (company) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const isFavorite = favoriteIds.includes(company.id);
    setFavoriteActionId(company.id);

    try {
      if (isFavorite) {
        await removeFavorite(company.id);
        setFavoriteIds((current) => current.filter((id) => id !== company.id));
        setSuccessModal({ title: 'Favorito eliminado', message: `${company.name} ya no está en tus favoritos.` });
      } else {
        await addFavorite(company.id);
        setFavoriteIds((current) => [...current, company.id]);
        setSuccessModal({ title: 'Favorito agregado', message: `${company.name} fue agregada a tus favoritos.` });
      }
    } catch (error) {
      setErrorModal({
        title: 'No se pudo actualizar favoritos',
        message: error?.response?.data?.error || 'No pudimos actualizar tus favoritos.',
      });
    } finally {
      setFavoriteActionId(null);
    }
  };

  const handleBuy = async (company) => {
    try {
      const { data } = await apiClient.post(`/companies/${company.id}/buy`, {});
      updateUser({ balance: data.balance });
      setSuccessModal({ title: 'Compra realizada', message: `Compraste ${company.name} correctamente.` });
      setPendingAction(null);
      setSelectedCompany(null);
      loadCompanies(page);
    } catch (error) {
      setPendingAction(null);
      setErrorModal({
        title: 'No se pudo comprar',
        message: error?.response?.data?.error || 'No pudimos completar la compra.',
      });
    }
  };

  const handleDonate = async (company) => {
    try {
      await apiClient.post(`/companies/${company.id}/donate`, { amount: Number(donateAmount) });
      setSuccessModal({ title: 'Donación realizada', message: `Donaste a ${company.name} correctamente.` });
      setPendingAction(null);
      setSelectedCompany(null);
      setDonateAmount('1000');
      loadCompanies(page);
    } catch (error) {
      setPendingAction(null);
      setErrorModal({ title: 'Error', message: 'No pudimos completar la donación.' });
    }
  };


  const handleSearch = (term) => {
    setSearch(term);
    loadCompanies(1, term);
  };

  return (
    <div className="market-page container">
      <SearchBar onSearch={handleSearch} />

      {loading ? (
        <p>Cargando empresas disponibles...</p>
      ) : (
        <>
          <section className="market-section">


            <div className="section-heading">
              <h2>Empresas disponibles</h2>
              <span>{companies.length} resultados</span>
            </div>

            {companies.length === 0 ? (
              <div className="empty-state card">
                <p>No hay empresas para mostrar.</p>
              </div>
            ) : (
              <div className="company-grid">
                {companies.map((company) => (
                  <MarketCompanyCard
                    key={company.id}
                    company={company}
                    isFavorite={favoriteIds.includes(company.id)}
                    isFavoriteLoading={favoriteActionId === company.id}
                    onToggleFavorite={handleToggleFavorite}
                    onDetail={setSelectedCompany}
                    onBuy={(company) => setPendingAction({ type: 'buy', company })}
                  />
                ))}
              </div>
            )}
          </section>

          <div className="pagination">
            <button type="button" className="btn btn-secondary" disabled={page === 1} onClick={() => loadCompanies(page - 1, search)}>
              Anterior
            </button>
            <span>Página {page} de {totalPages}</span>
            <button type="button" className="btn btn-secondary" disabled={page === totalPages} onClick={() => loadCompanies(page + 1, search)}>
              Siguiente
            </button>
          </div>
        </>
      )}

      <CompanyDetailModal
        company={selectedCompany}
        isAuthenticated={isAuthenticated}
        onClose={() => setSelectedCompany(null)}
        onBuy={() => setPendingAction({ type: 'buy', company: selectedCompany })}
        onDonate={() => setPendingAction({ type: 'donate', company: selectedCompany })}
        onLogin={() => navigate('/login')}
      />

      <ConfirmActionModal
        isOpen={pendingAction?.type === 'buy'}
        title="Confirmar compra"
        description={`¿Deseas comprar ${pendingAction?.company?.name}?`}
        confirmLabel="Comprar"
        onClose={() => setPendingAction(null)}
        onConfirm={() => handleBuy(pendingAction.company)}
      />

      <ConfirmActionModal
        isOpen={pendingAction?.type === 'donate'}
        title="Confirmar donación"
        description={`¿Cuánto deseas donar a ${pendingAction?.company?.name}?`}
        confirmLabel="Donar"
        variant="danger"
        showAmountInput
        amountLabel="Monto a donar"
        amountValue={donateAmount}
        onAmountChange={setDonateAmount}
        onClose={() => { setPendingAction(null); setDonateAmount('1000'); }}
        onConfirm={() => handleDonate(pendingAction.company)}
      />

      <SuccessMessageModal
        isOpen={Boolean(successModal)}
        title={successModal?.title ?? 'Listo'}
        message={successModal?.message ?? ''}
        onClose={() => setSuccessModal(null)}
      />

      <ErrorMessageModal
        isOpen={Boolean(errorModal)}
        title={errorModal?.title ?? 'Error'}
        message={errorModal?.message ?? ''}
        onClose={() => setErrorModal(null)}
      />
    </div>
  );
};

export default MarketPage;
