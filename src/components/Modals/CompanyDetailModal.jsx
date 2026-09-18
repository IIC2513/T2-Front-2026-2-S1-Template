import { CompanyReviews } from '../CompanyReviews/CompanyReviews';

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export function CompanyDetailModal({
  company,
  isAuthenticated,
  isFavorite = false,
  isFavoriteLoading = false,
  onToggleFavorite,
  onClose,
  onBuy,
  onDonate,
  onLogin,
}) {
  if (!company) return null;

  const companyLogo = company.logoUrl || 'https://placehold.co/240x160/0f172a/ffffff?text=Empresa';

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="company-modal-title">
      <div className="modal">
        <button type="button" className="modal-close" aria-label="Cerrar detalle" onClick={onClose}>
          ×
        </button>

        <div className="company-modal__header">
          <img
            src={companyLogo}
            alt={`${company.name} logo`}
            className="company-modal__logo"
            onError={(event) => {
              event.currentTarget.src = 'https://placehold.co/240x160/0f172a/ffffff?text=Empresa';
            }}
          />
          <h2 id="company-modal-title">
            {company.name}
            <button
              type="button"
              className={`favorite-button${isFavorite ? ' favorite-button--active' : ''}`}
              onClick={() => onToggleFavorite?.(company)}
              disabled={isFavoriteLoading}
              aria-label={isFavorite ? `Quitar ${company.name} de favoritos` : `Agregar ${company.name} a favoritos`}
              aria-pressed={isFavorite}
              title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              {isFavorite ? '★' : '☆'}
            </button>
          </h2>
          <p className="company-modal__symbol">{company.symbol}</p>
        </div>

        <div className="company-modal__stats">
          <div>
            <span>Valor</span>
            <strong>{formatCurrency(company.marketCap)}</strong>
          </div>
          <div>
            <span>Sector</span>
            <strong>{company.sector}</strong>
          </div>
          <div>
            <span>Símbolo</span>
            <strong>{company.symbol}</strong>
          </div>
          <div>
            <span>Estado</span>
            <strong>{company.isMarket ? 'En venta' : 'No disponible'}</strong>
          </div>
        </div>

        <div className="company-modal__field">
          <span>Descripción</span>
          <p>{company.description}</p>
        </div>

        <CompanyReviews companyId={company.id} onLogin={onLogin} />

        <div className="company-modal__actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cerrar
          </button>

          {isAuthenticated ? (
            <>
              <button type="button" className="btn btn-secondary" onClick={onDonate}>
                Donar
              </button>
              <button type="button" className="btn btn-primary" onClick={onBuy}>
                Comprar
              </button>
            </>
          ) : (
            <button type="button" className="btn btn-primary" onClick={onLogin}>
              Iniciar sesión
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CompanyDetailModal;