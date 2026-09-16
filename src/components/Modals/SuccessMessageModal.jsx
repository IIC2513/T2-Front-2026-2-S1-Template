export function SuccessMessageModal({ isOpen, title, message, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="success-message-title">
      <div className="modal modal--compact">
        <button type="button" className="modal-close" aria-label="Cerrar mensaje" onClick={onClose}>
          ×
        </button>

        <h2 id="success-message-title">{title}</h2>
        <p className="company-modal__description">{message}</p>

        <div className="modal-actions">
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuccessMessageModal;
