const formatCurrency = (value) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export function MarketCompanyCard({
  company,
  isFavorite = false,
  isFavoriteLoading = false,
  onToggleFavorite,
  onDetail,
  onBuy,
}) {
  const companyLogo = company.logoUrl || 'https://placehold.co/240x160/0f172a/ffffff?text=Empresa';

  return (
    <article className="company-card card">
      <img
        src={companyLogo}
        alt={`${company.name} logo`}
        className="company-card__logo"
        onError={(event) => {
          event.currentTarget.src = 'https://placehold.co/240x160/0f172a/ffffff?text=Empresa';
        }}
      />

      <div className="company-card__top">
        <div className="company-card__identity">
          <h3>
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
          </h3>
        </div>
      </div>

      <div className="company-card__footer">
        <div className="company-value-block">
          <span>Precio</span>
          <strong>{formatCurrency(company.marketCap)}</strong>
        </div>

        <div className="company-card__buttons">
          <button type="button" className="btn btn-secondary" onClick={() => onDetail(company)}>
            Ver detalle
          </button>
          <button type="button" className="btn btn-primary" onClick={() => onBuy(company)}>
            Comprar
          </button>
        </div>
      </div>
    </article>
  );
}

export default MarketCompanyCard;
