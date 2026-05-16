import { useEffect, useState } from "react";
import DashboardLayout from "../../../components/DashboardLayout";
import { supabase } from "../../../config/supabase";
import "../../../style/Logements.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
export default function ListeLogements() {
  const [logements, setLogements] = useState([]);

  const [selectedLogement, setSelectedLogement] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadLogements();
  }, []);
  const generatePDF = async () => {
    const element = document.getElementById("contract-pdf");

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff"
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = 210;
    const pageHeight = 297;

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("contrat-location.pdf");
  };
  const loadLogements = async () => {
    const user = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("logements")
      .select("*")
      .eq("owner_id", user.data.user.id)
      .order("created_at", { ascending: false });

    if (!error) setLogements(data);
  };

  const openContract = (logement) => {
    setSelectedLogement(logement);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedLogement(null);
    setShowModal(false);
  };

  return (
    <DashboardLayout role="owner">

      <div className="logements-page">

        {/* HEADER */}
        <div className="logements-header">
          <h2>
            <i className="bi bi-building me-2"></i>
            Mes logements
          </h2>
          <p>Gérez vos biens immobiliers sur la blockchain</p>
        </div>

        {/* LIST */}
        <div className="logements-grid">

          {logements.map((logement) => (

            <div className="logement-card" key={logement.id}>

              <div className="logement-top">
                <h4>
                  <i className="bi bi-house-door me-2"></i>
                  {logement.titre}
                </h4>

                <span className="badge-status">
                  Disponible
                </span>
              </div>

              <p className="logement-adresse">
                <i className="bi bi-geo-alt me-2"></i>
                {logement.adresse}
              </p>

              <p className="logement-ville">
                <i className="bi bi-geo"></i> {logement.ville}
              </p>

              <div className="logement-price">
                <i className="bi bi-cash-coin me-2"></i>
                {logement.prix} ETH / mois
              </div>

              <div className="logement-actions">

                <button className="btn-view">
                  <i className="bi bi-eye me-1"></i>
                  Voir
                </button>

                <button
                  className="btn-contract"
                  onClick={() => openContract(logement)}
                >
                  <i className="bi bi-file-earmark-plus me-1"></i>
                  Contrat
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

      {showModal && selectedLogement && (
        <div className="modal-overlay" onClick={closeModal}>

          <div className="modal-box" onClick={(e) => e.stopPropagation()}>

            <div id="contract-pdf" className="pdf-container">

              <h2 style={{
                textAlign: "center",
                color: "#8b5e3c",
                marginBottom: "25px"
              }}>
                CONTRAT DE LOCATION IMMOBILIÈRE
              </h2>

              <hr />

              <p><b>Titre :</b> {selectedLogement.titre}</p>
              <p><b>Adresse :</b> {selectedLogement.adresse}</p>
              <p><b>Ville :</b> {selectedLogement.ville}</p>
              <p><b>Prix :</b> {selectedLogement.prix} ETH / mois</p>

              <hr />

              <h4 style={{ color: "#8b5e3c" }}>
                Conditions
              </h4>

              <p>
                Ce contrat est généré automatiquement par la plateforme immobilière blockchain.
                Il garantit la transparence et la traçabilité du logement.
              </p>

              <br />

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px" }}>
                <div>
                  <p><b>Propriétaire</b></p>
                  <p>Signature : ____________</p>
                </div>

                <div>
                  <p><b>Locataire</b></p>
                  <p>Signature : ____________</p>
                </div>
              </div>

            </div>

            {/* ACTIONS */}
            <button
              className="btn btn-warning w-100 mt-3"
              onClick={generatePDF}
            >
              <i className="bi bi-download me-2"></i>
              Générer & Télécharger PDF
            </button>

            <button
              className="btn btn-dark w-100 mt-2"
              onClick={closeModal}
            >
              Fermer
            </button>

          </div>

        </div>
      )}

    </DashboardLayout>
  );
}