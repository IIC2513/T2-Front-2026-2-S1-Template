import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { ConfirmActionModal } from '../../components/Modals/ConfirmActionModal';
import { SuccessMessageModal } from '../../components/Modals/SuccessMessageModal';
import { ErrorMessageModal } from '../../components/Modals/ErrorMessageModal';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, isAuthenticated, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: user?.username ?? '', password: '', confirmPassword: '' });
  const [formError, setFormError] = useState('');

  const [pendingAction, setPendingAction] = useState(null); // 'edit' | 'delete' | null
  const [successModal, setSuccessModal] = useState(null);
  const [errorModal, setErrorModal] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated]);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError('');
  };

  const handleEditSubmit = (event) => {
    event.preventDefault();

    if (!form.username.trim()) {
      setFormError('El nombre de usuario no puede estar vacío.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setFormError('Las contraseñas no coinciden.');
      return;
    }

    setPendingAction('edit');
  };

  const confirmEdit = async () => {
    try {
      const { data } = await apiClient.patch('/me', {
        username: form.username,
        password: form.password || undefined,
      });
      updateUser(data);
      setForm({ username: data.username, password: '', confirmPassword: '' });
      setPendingAction(null);
      setSuccessModal({ title: 'Perfil actualizado', message: 'Tus cambios se guardaron correctamente.' });
    } catch (error) {
      setPendingAction(null);
      setErrorModal({ title: 'Error', message: 'No pudimos actualizar tu perfil.' });
    }
  };

  const confirmDelete = async () => {
    try {
      await apiClient.delete('/me');
      setPendingAction(null);
      logout();
      setSuccessModal({ title: 'Cuenta eliminada', message: 'Tu cuenta fue eliminada correctamente.' });
    } catch (error) {
      setPendingAction(null);
      setErrorModal({ title: 'Error', message: 'No pudimos eliminar tu cuenta.' });
    }
  };

  return (
    <div className="profile-page container">
      <header className="page-header">
        <h1>¿Cambios?</h1>
      </header>

      <div className="profile-grid">
        <section className="card profile-form-card">
          <h2>Editar perfil</h2>
          <p className="profile-form-hint">Deja la contraseña en blanco si no quieres cambiarla.</p>

          <form onSubmit={handleEditSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="username" className="form-label">Nombre de usuario</label>
              <input
                id="username"
                name="username"
                type="text"
                className="form-input"
                value={form.username}
                onChange={handleFieldChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Nueva contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-input"
                placeholder="Dejar en blanco para no cambiarla"
                value={form.password}
                onChange={handleFieldChange}
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirmar nueva contraseña</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="form-input"
                placeholder="Repite la nueva contraseña"
                value={form.confirmPassword}
                onChange={handleFieldChange}
                autoComplete="new-password"
              />
            </div>

            {formError && (
              <div className="alert alert-error" role="alert">
                {formError}
              </div>
            )}

            <button type="submit" className="btn btn-primary">Guardar cambios</button>
          </form>
        </section>

        <section className="card profile-danger-card">
          <h2>Eliminar cuenta</h2>
          <p>Esta acción elimina tu usuario para SIEMPRE</p>
          <button type="button" className="btn btn-danger" onClick={() => setPendingAction('delete')}>
            Eliminar mi cuenta
          </button>
        </section>
      </div>

      <ConfirmActionModal
        isOpen={pendingAction === 'edit'}
        title="Confirmar cambios"
        description="¿Deseas guardar los cambios en tu perfil?"
        confirmLabel="Guardar"
        onClose={() => setPendingAction(null)}
        onConfirm={confirmEdit}
      />

      <ConfirmActionModal
        isOpen={pendingAction === 'delete'}
        title="Eliminar cuenta"
        description={`¿Seguro que quieres eliminar tu cuenta "${form.username}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        variant="danger"
        onClose={() => setPendingAction(null)}
        onConfirm={confirmDelete}
      />

      <SuccessMessageModal
        isOpen={Boolean(successModal)}
        title={successModal?.title ?? 'Listo'}
        message={successModal?.message ?? ''}
        onClose={() => {
          const wasDeleted = successModal?.title === 'Cuenta eliminada';
          setSuccessModal(null);
          if (wasDeleted) navigate('/');
        }}
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

export default ProfilePage;