import { Link } from "react-router-dom";

export default function Sidebar({ role }) {
  return (
    <div
      style={{
        width: "260px",
        minHeight: "100vh",
        backgroundColor: "#111",
        color: "white",
        padding: "20px"
      }}
    >

      <h5 className="mb-4" style={{ color: "#f5c542" }}>
        <i className="bi bi-building me-2"></i>
        Système Immobilier
      </h5>



      <hr style={{ borderColor: "#333" }} />

      {/*---- PROPRIÉTAIRE */}
      {role === "owner" && (
        <>
          <Link to="/DashboardProprietaire" className="d-block text-white mb-3">
            <i className="bi bi-speedometer2 me-2"></i>
            Tableau de bord
          </Link>

          <Link to="/proprietaire/logements/ajouter" className="d-block text-white mb-3">
            <i className="bi bi-house-add me-2"></i>
            Ajouter logement
          </Link>

          <Link to="/proprietaire/logements" className="d-block text-white mb-3">
            <i className="bi bi-houses me-2"></i>
            Mes logements
          </Link>

         

          <Link to="/proprietaire/contrats" className="d-block text-white mb-3">
            <i className="bi bi-file-text me-2"></i>
            Contrats
          </Link>
        </>
      )}

      {/*----- LOCATAIRE */}
      {role === "tenant" && (
        <>
          <Link className="d-block text-white mb-3" to="/DashboardLocataire">
            <i className="bi bi-speedometer2 me-2"></i>
            Tableau de bord
          </Link>

          <Link className="d-block text-white mb-3" to="/rentals">
            <i className="bi bi-house-door me-2"></i>
            Mes locations
          </Link>
        </>
      )}

    </div>
  );
}