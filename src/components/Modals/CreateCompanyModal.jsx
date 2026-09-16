export function CreateCompanyModal({ isOpen, form, setForm, onClose, onSubmit, isSubmitting, submitError }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="create-company-title">
      <div className="modal">
        <button type="button" className="modal-close" aria-label="Cerrar modal" onClick={onClose}>
          ×
        </button>
        <h2 id="create-company-title">Crear empresa</h2>

        {submitError && (
          <div className="alert alert-error" role="alert">
            {submitError}
          </div>
        )}

        <form onSubmit={onSubmit} className="portfolio-form">
          <div className="form-group">
            <label className="form-label" htmlFor="company-name">Nombre</label>
            <input
              id="company-name"
              className="form-input"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Ej: DCC Mining"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="company-symbol">Símbolo</label>
            <input
              id="company-symbol"
              className="form-input"
              value={form.symbol}
              onChange={(event) => setForm((prev) => ({ ...prev, symbol: event.target.value.toUpperCase() }))}
              placeholder="Ej: DCCM"
              maxLength={10}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="company-description">Descripción</label>
            <textarea
              id="company-description"
              className="form-input"
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="Empresa ficticia de robots educativos."
              rows={4}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="company-sector">Sector</label>
            <input
              id="company-sector"
              className="form-input"
              value={form.sector}
              onChange={(event) => setForm((prev) => ({ ...prev, sector: event.target.value }))}
              placeholder="Tecnologia"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="company-market-cap">Market Cap</label>
            <input
              id="company-market-cap"
              className="form-input"
              type="number"
              min="1000"
              max="5000"
              step="100"
              value={form.marketCap}
              onChange={(event) => setForm((prev) => ({ ...prev, marketCap: event.target.value }))}
              placeholder="3200"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="company-logo-url">Logo URL (opcional)</label>
            <input
              id="company-logo-url"
              className="form-input"
              value={form.logoUrl}
              onChange={(event) => setForm((prev) => ({ ...prev, logoUrl: event.target.value }))}
              placeholder="https://example.com/logo.png"
            />
          </div>


          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creando...' : 'Crear empresa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCompanyModal;
