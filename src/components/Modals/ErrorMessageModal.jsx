export function ErrorMessageModal({ isOpen, title = 'No se pudo completar la acción', message, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="error-message-title">
      <div className="modal modal--compact">
        <button type="button" className="modal-close" aria-label="Cerrar error" onClick={onClose}>
          ×
        </button>
        <h2 id="error-message-title">{title}</h2>
        <p className="company-modal__description">{message}</p>

        <div className="modal-actions">
          <button type="button" className="btn btn-danger" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorMessageModal;
