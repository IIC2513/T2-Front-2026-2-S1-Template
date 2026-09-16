const formatCurrency = (value) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const FALLBACK_LOGO =
  'https://placehold.co/240x160/0f172a/ffffff?text=Empresa';

export function PortfolioCompanyCard({ company, onDetail }) {
  return (
    <article className="company-card card">
      <img
        src={company.logoUrl || FALLBACK_LOGO}
        alt={`Logo de ${company.name}`}
        className="company-card__logo"
        onError={(event) => {
          event.currentTarget.src = FALLBACK_LOGO;
        }}
      />

      <div className="company-card__top">
        <div className="company-card__identity">
          <h3>{company.name}</h3>

          {company.symbol && (
            <span className="company-symbol">
              {company.symbol}
            </span>
          )}
        </div>
      </div>

      <div className="company-card__footer">
        <div className="company-value-block">
          <span>Valor</span>
          <strong>
            {formatCurrency(company.value)}
          </strong>
        </div>

        <div className="company-card__buttons">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => onDetail(company)}
          >
            Ver detalle
          </button>
        </div>
      </div>
    </article>
  );
}

export default PortfolioCompanyCard;
