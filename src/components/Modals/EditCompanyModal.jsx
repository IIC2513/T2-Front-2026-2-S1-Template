export function EditCompanyModal({ isOpen, form, setForm, onClose, onSubmit, isSubmitting, submitError }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="edit-company-title">
      <div className="modal">
        <button type="button" className="modal-close" aria-label="Cerrar edición" onClick={onClose}>
          ×
        </button>

        <h2 id="edit-company-title">Actualizar información</h2>

        {submitError && (
          <div className="alert alert-error" role="alert">
            {submitError}
          </div>
        )}

        <form onSubmit={onSubmit} className="portfolio-form">
          <div className="form-group">
            <label className="form-label" htmlFor="edit-company-name">Nombre</label>
            <input
              id="edit-company-name"
              className="form-input"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="edit-company-sector">Sector</label>
            <input
              id="edit-company-sector"
              className="form-input"
              value={form.sector}
              onChange={(event) => setForm((prev) => ({ ...prev, sector: event.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="edit-company-description">Descripción</label>
            <textarea
              id="edit-company-description"
              className="form-input"
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              rows={4}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditCompanyModal;