export function ConfirmActionModal({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onClose,
  onConfirm,
  isSubmitting = false,
  variant = 'primary',
  showAmountInput = false,
  amountLabel = 'Monto a donar',
  amountValue = '',
  onAmountChange,
  amountPlaceholder = '1000',
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="confirm-action-title">
      <div className="modal modal--compact">
        <button type="button" className="modal-close" aria-label="Cerrar confirmación" onClick={onClose}>
          ×
        </button>
        <h2 id="confirm-action-title">{title}</h2>
        <p className="company-modal__description">{description}</p>

        {showAmountInput && (
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label className="form-label" htmlFor="donate-amount">{amountLabel}</label>
            <input
              id="donate-amount"
              className="form-input"
              type="number"
              min="1"
              step="1"
              value={amountValue}
              onChange={(event) => onAmountChange?.(event.target.value)}
              placeholder={amountPlaceholder}
              autoFocus
            />
          </div>
        )}

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`btn ${variant === 'danger' ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
            disabled={isSubmitting || (showAmountInput && Number(amountValue || 0) <= 0)}
          >
            {isSubmitting ? 'Procesando...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmActionModal;
