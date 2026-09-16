import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient, { getErrorMessage } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { ConfirmActionModal } from '../../components/Modals/ConfirmActionModal';
import { CreateCompanyModal } from '../../components/Modals/CreateCompanyModal';
import { EditCompanyModal } from '../../components/Modals/EditCompanyModal';
import { PortfolioDetailModal } from '../../components/Modals/PortfolioDetailModal';
import { PortfolioCompanyCard } from '../../components/CompanyCard/PortfolioCompanyCard';
import { SuccessMessageModal } from '../../components/Modals/SuccessMessageModal';
import { ErrorMessageModal } from '../../components/Modals/ErrorMessageModal';
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
  const [loadError, setLoadError] = useState('');
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
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [actionSubmitting, setActionSubmitting] = useState(false);
  const [createError, setCreateError] = useState('');
  const [editError, setEditError] = useState('');
  const [successModal, setSuccessModal] = useState(null);
  const [errorModal, setErrorModal] = useState(null);

  const loadPortfolio = async () => {
    setLoading(true);
    setLoadError('');
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
      setLoadError(getErrorMessage(error, 'No pudimos cargar tu portfolio.'));
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
    setCreateSubmitting(true);
    setCreateError('');
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
      setSuccessModal({ title: 'Empresa creada', message: 'La empresa fue creada correctamente.' });
      loadPortfolio();
    } catch (error) {
      console.error('Error creando empresa:', error);
      setCreateError(getErrorMessage(error, 'No pudimos crear la empresa.'));
    } finally {
      setCreateSubmitting(false);
    }
  };

  const handleEdit = async () => {
    setEditSubmitting(true);
    setEditError('');
    try {
      await apiClient.patch(`/companies/${selectedCompany.id}`, {
        name: editForm.name,
        description: editForm.description,
        sector: editForm.sector,
      });
      setIsEditOpen(false);
      setSuccessModal({ title: 'Empresa actualizada', message: 'Los datos fueron actualizados correctamente.' });
      loadPortfolio();
    } catch (error) {
      console.error('Error editando empresa:', error);
      setEditError(getErrorMessage(error, 'No pudimos actualizar la empresa.'));
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleSell = async (company) => {
    setActionSubmitting(true);
    try {
      await apiClient.post(`/companies/${company.id}/sell`, {});
      setIsDetailOpen(false);
      setSelectedCompany(null);
      setSuccessModal({ title: 'Empresa vendida', message: `${company.name} fue vendida correctamente.` });
      loadPortfolio();
    } catch (error) {
      console.error('Error vendiendo empresa:', error);
      setErrorModal({ title: 'No se pudo vender', message: getErrorMessage(error, 'No pudimos vender la empresa.') });
    } finally {
      setActionSubmitting(false);
    }
  };

  const handleDelete = async (company) => {
    setActionSubmitting(true);
    try {
      await apiClient.delete(`/companies/${company.id}`);
      setIsDetailOpen(false);
      setConfirm(null);
      setSelectedCompany(null);
      setSuccessModal({ title: 'Empresa eliminada', message: `${company.name} fue eliminada correctamente.` });
      loadPortfolio();
    } catch (error) {
      console.error('Error eliminando empresa:', error);
      setErrorModal({ title: 'No se pudo eliminar', message: getErrorMessage(error, 'No pudimos eliminar la empresa.') });
    } finally {
      setActionSubmitting(false);
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
      ) : loadError ? (
        <div className="alert alert-error" role="alert">
          {loadError}
        </div>
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
        isSubmitting={actionSubmitting}
        onClose={() => setIsDetailOpen(false)}
        onEdit={openEdit}
        onSell={() => setConfirm({
          title: 'Vender empresa',
          description: `Deseas vender ${selectedCompany?.name}? Esta accion no se puede deshacer.`,
          confirmLabel: 'Vender',
          onConfirm: () => handleSell(selectedCompany),
        })}
        onDelete={() => setConfirm({
          title: 'Eliminar empresa',
          description: `¿Deseas eliminar ${selectedCompany?.name}? Esta acción no se puede deshacer.`,
          confirmLabel: 'Eliminar',
          variant: 'danger',
          onConfirm: () => handleDelete(selectedCompany),
        })}
      />

      <EditCompanyModal
        isOpen={isEditOpen}
        form={editForm}
        setForm={setEditForm}
        onClose={() => setIsEditOpen(false)}
        isSubmitting={editSubmitting}
        submitError={editError}
        onSubmit={(event) => {
          event.preventDefault();
          setConfirm({
            title: 'Editar empresa',
            description: `Deseas guardar los cambios de ${editForm.name}?`,
            confirmLabel: 'Guardar cambios',
            onConfirm: handleEdit,
          });
        }}
      />

      <CreateCompanyModal
        isOpen={isCreateOpen}
        form={createForm}
        setForm={setCreateForm}
        onClose={() => setIsCreateOpen(false)}
        isSubmitting={createSubmitting}
        submitError={createError}
        onSubmit={(event) => {
          event.preventDefault();
          setConfirm({
            title: 'Crear empresa',
            description: `Deseas crear la empresa ${createForm.name}?`,
            confirmLabel: 'Crear empresa',
            onConfirm: handleCreate,
          });
        }}
      />

      <ConfirmActionModal
        isOpen={Boolean(confirm)}
        title={confirm?.title}
        description={confirm?.description}
        confirmLabel={confirm?.confirmLabel}
        variant={confirm?.variant}
        isSubmitting={actionSubmitting}
        onClose={() => setConfirm(null)}
        onConfirm={confirm?.onConfirm}
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

export default PortfolioPage;
