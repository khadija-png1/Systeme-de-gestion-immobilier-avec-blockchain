import { Link } from "react-router-dom";
import "../style/Home.css";

export default function Home() {
  return (
    <div className="home-container">

      {/* NAVBAR */}
      <nav className="navbar navbar-custom px-4">
        <span className="navbar-brand fw-bold brand">
          <i className="bi bi-buildings me-2"></i>
          Système Immobilier Blockchain
        </span>

        <div>
      

          <Link className="btn btn-warning" to="/register">
            <i className="bi bi-person-circle me-1"></i>
            Connexion / Inscription
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <div className="container text-center hero">

        <h1 className="title">
          Gestion Immobilière Sécurisée par Blockchain
        </h1>

        <p className="subtitle">
          Une plateforme moderne de gestion des contrats de location basée sur
          la technologie Blockchain, offrant sécurité, transparence et confiance
          entre propriétaires et locataires.
        </p>

    

      </div>

      {/* FEATURES */}
      <div className="container mt-5">
        <div className="row text-center">

          <div className="col-md-4">
            <div className="card-custom">
              <i className="bi bi-shield-lock icon"></i>

              <h5>Contrats Sécurisés</h5>

              <p>
                Contrats intelligents protégés et stockés sur la blockchain.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card-custom brown">
              <i className="bi bi-house-door icon brown-icon"></i>

              <h5>Gestion Immobilière</h5>

              <p>
                Gestion transparente des biens immobiliers et des locations.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card-custom">
              <i className="bi bi-lightning-charge icon"></i>

              <h5>Transactions Rapides</h5>

              <p>
                Exécution instantanée des paiements et contrats intelligents.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        © 2026 Système Immobilier Blockchain
      </footer>

    </div>
  );
}