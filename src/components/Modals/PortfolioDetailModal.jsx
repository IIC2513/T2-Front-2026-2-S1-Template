const formatCurrency = (value) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export function PortfolioDetailModal({ company, onClose, onEdit, onSell, onDelete }) {
  if (!company) return null;

  const companyLogo = company.logoUrl || 'https://placehold.co/240x160/0f172a/ffffff?text=Empresa';

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="portfolio-detail-title">
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
          <h2 id="portfolio-detail-title">{company.name}</h2>
          <p className="company-modal__symbol">{company.symbol}</p>
        </div>

        <div className="company-modal__stats">
          <div>
            <span>Valor</span>
            <strong>{formatCurrency(company.value)}</strong>
          </div>
          <div>
            <span>Market Cap</span>
            <strong>{formatCurrency(company.marketCap)}</strong>
          </div>
          <div>
            <span>Símbolo</span>
            <strong>{company.symbol}</strong>
          </div>
          <div>
            <span>Sector</span>
            <strong>{company.sector}</strong>
          </div>
        </div>

        <div className="company-modal__field">
          <span>Descripción</span>
          <p>{company.description}</p>
        </div>

        <div className="company-modal__actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cerrar
          </button>
          <button type="button" className="btn btn-secondary" onClick={onEdit}>
            Editar
          </button>
          <button type="button" className="btn btn-primary" onClick={onSell}>
            Vender
          </button>
          <button type="button" className="btn btn-danger" onClick={onDelete}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default PortfolioDetailModal;