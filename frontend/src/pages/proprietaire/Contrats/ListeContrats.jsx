import { useEffect, useState } from "react";
import DashboardLayout from "../../../components/DashboardLayout";
import { supabase } from "../../../config/supabase";
import "../../../style/Contrat.css"

export default function ListeContrats() {
  const [contrats, setContrats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContrats();
  }, []);

  const fetchContrats = async () => {
    const { data, error } = await supabase
      .from("rentals")
      .select(`
        id,
        rent,
        status,
        tx_hash,
        signature_hash,
        logements (titre, adresse, ville)
      `)
      .order("created_at", { ascending: false });

    if (!error) setContrats(data);
    setLoading(false);
  };

  const getStatusClass = (status) => {
    if (status === "signed") return "status-signed";
    if (status === "pending") return "status-pending";
    return "status-draft";
  };

  return (
    <DashboardLayout role="owner">

      <div className="contrats-page">

        <div className="contrats-header">
          <h2>
            <i className="bi bi-file-earmark-lock me-2"></i>
            Contrats Blockchain
          </h2>
          <p>Gestion sécurisée des contrats immobiliers</p>
        </div>

        {loading ? (
          <p className="loading">Chargement...</p>
        ) : contrats.length === 0 ? (
          <p className="empty">
            <i className="bi bi-inbox me-2"></i>
            Aucun contrat trouvé
          </p>
        ) : (
          <div className="contrats-grid">

            {contrats.map((c) => (
              <div key={c.id} className="contrat-card">

                <div className="contrat-top">
                  <h4>
                    <i className="bi bi-house-door me-2"></i>
                    {c.logements?.titre}
                  </h4>

                  <span className={`status-badge ${getStatusClass(c.status)}`}>
                    {c.status}
                  </span>
                </div>

                <p className="adresse">
                  <i className="bi bi-geo-alt me-2"></i>
                  {c.logements?.adresse} - {c.logements?.ville}
                </p>

                <div className="info-row">
                  <div>
                    <i className="bi bi-cash-coin"></i> {c.rent} MAD
                  </div>

                  <div>
                    <i className="bi bi-link-45deg"></i>
                    {c.tx_hash ? "Blockchain OK" : "Non signé"}
                  </div>
                </div>

                <div className="signature">
                  <i className="bi bi-pen"></i>
                  {c.signature_hash || "En attente de signature"}
                </div>

                <button className="view-btn">
                  <i className="bi bi-eye me-2"></i>
                  Voir détails
                </button>

              </div>
            ))}

          </div>
        )}

      </div>

    </DashboardLayout>
  );
}