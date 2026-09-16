import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient, { getErrorMessage } from '../../api/client';
import './Landing.css';

const Landing = () => {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [companiesLoading, setCompaniesLoading] = useState(true);
  const [usersError, setUsersError] = useState('');
  const [companiesError, setCompaniesError] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersRes = await apiClient.get('/rankings/users');
        setUsers(usersRes.data?.data || []);
      } catch (error) {
        setUsersError(getErrorMessage(error, 'No pudimos cargar el ranking de usuarios.'));
      } finally {
        setUsersLoading(false);
      }
    };

    const loadCompanies = async () => {
      try {
        const companiesRes = await apiClient.get('/rankings/companies');
        setCompanies(companiesRes.data?.data || []);
      } catch (error) {
        setCompaniesError(getErrorMessage(error, 'No pudimos cargar el ranking de empresas.'));
      } finally {
        setCompaniesLoading(false);
      }
    };

    loadUsers();
    loadCompanies();
  }, []);

  return (
    <main className="landing">
      <section className="landing-content">

        <div className="landing-info">
          <h1>Bienvenido a DCCapital</h1>

          <p>
            En este sitio podrás comprar/vender una empresa en su totalidad.
          </p>

          <Link to="/market" className="market-button">
            Ir al mercado
          </Link>
        </div>

        <div className="landing-data">

          <div className="data-card">
            <h2>Usuarios con más patrimonio</h2>

            {usersLoading ? (
              <p className="data-state">Cargando ranking...</p>
            ) : usersError ? (
              <p className="data-state data-state--error" role="alert">{usersError}</p>
            ) : users.length === 0 ? (
              <p className="data-empty">Aún no hay usuarios rankeados.</p>
            ) : (
              users.slice(0, 5).map((user, index) => (
                <div className="data-row" key={user.id || index}>
                  <span>
                    {index + 1}. {user.username}
                  </span>

                  <span>
                    {user.netWorth} DCC
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="data-card">
            <h2>Empresas más valuadas</h2>

            {companiesLoading ? (
              <p className="data-state">Cargando ranking...</p>
            ) : companiesError ? (
              <p className="data-state data-state--error" role="alert">{companiesError}</p>
            ) : companies.length === 0 ? (
              <p className="data-empty">No hay empresas rankeadas.</p>
            ) : (
              companies.slice(0, 5).map((company, index) => (
                <div className="data-row" key={company.id || index}>
                  <span>
                    {company.symbol}
                  </span>

                  <span>
                    {company.marketCap} DCC
                  </span>
                </div>
              ))
            )}
          </div>

        </div>

      </section>
    </main>
  );
};

export default Landing;
