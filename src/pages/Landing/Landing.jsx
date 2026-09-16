import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/client';
import './Landing.css';

const Landing = () => {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersRes, companiesRes] = await Promise.all([
          apiClient.get('/rankings/users'),
          apiClient.get('/rankings/companies'),
        ]);

        setUsers(usersRes.data?.data || []);
        setCompanies(companiesRes.data?.data || []);
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    };

    loadData();
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

            {users.length === 0 ? (
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

            {companies.slice(0, 5).map((company, index) => (
              <div className="data-row" key={company.id || index}>
                <span>
                  {company.symbol}
                </span>

                <span>
                  {company.marketCap} DCC
                </span>
              </div>
            ))}
          </div>

        </div>

      </section>
    </main>
  );
};

export default Landing;
