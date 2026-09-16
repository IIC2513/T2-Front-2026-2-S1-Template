import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { ConfirmActionModal } from '../../components/Modals/ConfirmActionModal';
import { CreateCompanyModal } from '../../components/Modals/CreateCompanyModal';
import { EditCompanyModal } from '../../components/Modals/EditCompanyModal';
import { PortfolioDetailModal } from '../../components/Modals/PortfolioDetailModal';
import { PortfolioCompanyCard } from '../../components/CompanyCard/PortfolioCompanyCard';
import './PortfolioPage.css';

const PAGE_SIZE = 9;

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const PortfolioPage = () => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const navigate = useNavigate();

  const [portfolio, setPortfolio] = useState({ balance: 0, companies: [], portfolioValue: 0, netWorth: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const [createForm, setCreateForm] = useState({
    name: '', symbol: '', description: '', sector: '', marketCap: '1000', logoUrl: '',
  });
  const [editForm, setEditForm] = useState({ name: '', description: '', sector: '' });

  const loadPortfolio = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get('/portfolio');
      setPortfolio({
        balance: data.balance ?? 0,
        companies: (data.companies ?? []).map((item) => ({ ...item.company, value: item.value })),
        portfolioValue: data.portfolioValue ?? 0,
        netWorth: data.netWorth ?? 0,
      });
      updateUser({ balance: data.balance ?? 0 });
    } catch (error) {
      console.error('Error cargando portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) loadPortfolio();
    else setLoading(false);
  }, [isAuthenticated]);

  const totalPages = Math.max(1, Math.ceil(portfolio.companies.length / PAGE_SIZE));
  const pagedCompanies = portfolio.companies.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openDetail = (company) => {
    setSelectedCompany(company);
    setIsDetailOpen(true);
  };

  const openEdit = () => {
    setEditForm({
      name: selectedCompany.name,
      description: selectedCompany.description,
      sector: selectedCompany.sector,
    });
    setIsDetailOpen(false);
    setIsEditOpen(true);
  };

  const handleCreate = async () => {
    try {
      await apiClient.post('/companies', {
        name: createForm.name,
        symbol: createForm.symbol,
        description: createForm.description,
        sector: createForm.sector,
        marketCap: Number(createForm.marketCap),
        logoUrl: createForm.logoUrl || undefined,
      });
      setIsCreateOpen(false);
      setCreateForm({ name: '', symbol: '', description: '', sector: '', marketCap: '1000', logoUrl: '' });
      loadPortfolio();
    } catch (error) {
      console.error('Error creando empresa:', error);
    }
  };

  const handleEdit = async () => {
    try {
      await apiClient.patch(`/companies/${selectedCompany.id}`, {
        name: editForm.name,
        description: editForm.description,
        sector: editForm.sector,
      });
      setIsEditOpen(false);
      loadPortfolio();
    } catch (error) {
      console.error('Error editando empresa:', error);
    }
  };

  const handleSell = async (company) => {
    try {
      await apiClient.post(`/companies/${company.id}/sell`, {});
      setIsDetailOpen(false);
      loadPortfolio();
    } catch (error) {
      console.error('Error vendiendo empresa:', error);
    }
  };

  const handleDelete = async (company) => {
    try {
      await apiClient.delete(`/companies/${company.id}`);
      setIsDetailOpen(false);
      loadPortfolio();
    } catch (error) {
      console.error('Error eliminando empresa:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="portfolio-page container">
        <div className="card empty-state">
          <h1>Mi portfolio</h1>
          <p>Debes iniciar sesión para ver tu balance y tus empresas.</p>
          <button type="button" className="btn btn-primary" onClick={() => navigate('/login')}>
            Iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-page container">
      <header className="portfolio-header">
        <h1>¡Bienvenido {user?.username ?? ''}!</h1>

        <div className="portfolio-header__stats">
          <div className="portfolio-stat">
            <span>DCCoins disponibles</span>
            <strong>{formatCurrency(portfolio.balance)}</strong>
          </div>
          <div className="portfolio-stat">
            <span>Empresas adquiridas</span>
            <strong>{portfolio.companies.length}</strong>
          </div>
        </div>

        <button type="button" className="btn btn-primary" onClick={() => setIsCreateOpen(true)}>
          + Crear empresa
        </button>
      </header>

      {loading ? (
        <p>Cargando tu portfolio...</p>
      ) : (
        <section className="market-section">
          <div className="section-heading">
            <h2>Mis empresas</h2>
          </div>

          {portfolio.companies.length === 0 ? (
            <div className="empty-state card">
              <p>Aún no tienes empresas en tu portfolio.</p>
            </div>
          ) : (
            <>
              <div className="company-grid">
                {pagedCompanies.map((company) => (
                  <PortfolioCompanyCard
                    key={company.id}
                    company={company}
                    onDetail={openDetail}
                  />
                ))}
              </div>

              <div className="pagination">
                <button type="button" className="btn btn-secondary" disabled={page === 1} onClick={() => setPage(page - 1)}>
                  Anterior
                </button>
                <span>Página {page} de {totalPages}</span>
                <button type="button" className="btn btn-secondary" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                  Siguiente
                </button>
              </div>
            </>
          )}
        </section>
      )}

      <PortfolioDetailModal
        company={isDetailOpen ? selectedCompany : null}
        onClose={() => setIsDetailOpen(false)}
        onEdit={openEdit}
        onSell={() => handleSell(selectedCompany)}
        onDelete={() => setConfirm({
          title: 'Eliminar empresa',
          description: `¿Deseas eliminar ${selectedCompany?.name}? Esta acción no se puede deshacer.`,
          confirmLabel: 'Eliminar',
          variant: 'danger',
          onConfirm: () => { handleDelete(selectedCompany); setConfirm(null); },
        })}
      />

      <EditCompanyModal
        isOpen={isEditOpen}
        form={editForm}
        setForm={setEditForm}
        onClose={() => setIsEditOpen(false)}
        onSubmit={(event) => { event.preventDefault(); handleEdit(); }}
      />

      <CreateCompanyModal
        isOpen={isCreateOpen}
        form={createForm}
        setForm={setCreateForm}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={(event) => { event.preventDefault(); handleCreate(); }}
      />

      <ConfirmActionModal
        isOpen={Boolean(confirm)}
        title={confirm?.title}
        description={confirm?.description}
        confirmLabel={confirm?.confirmLabel}
        variant={confirm?.variant}
        onClose={() => setConfirm(null)}
        onConfirm={confirm?.onConfirm}
      />
    </div>
  );
};

export default PortfolioPage;