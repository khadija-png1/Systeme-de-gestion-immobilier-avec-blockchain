import { useEffect, useState } from "react";
import DashboardLayout from "../../../components/DashboardLayout";
import { supabase } from "../../../config/supabase";
import "../../../style/Contrat.css";

export default function CreerContrat() {
  const [logements, setLogements] = useState([]);

  const [form, setForm] = useState({
    logement_id: "",
    tenant_address: "",
    rent: "",
    pdf_hash: ""
  });

  useEffect(() => {
    loadLogements();
  }, []);

  const loadLogements = async () => {
    const user = await supabase.auth.getUser();

    const { data } = await supabase
      .from("logements")
      .select("*")
      .eq("owner_id", user.data.user.id);

    setLogements(data || []);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = await supabase.auth.getUser();

    await supabase.from("rentals").insert([
      {
        logement_id: form.logement_id,
        owner_id: user.data.user.id,
        tenant_address: form.tenant_address,
        rent: form.rent,
        pdf_hash: form.pdf_hash
      }
    ]);

    alert("Contrat créé !");
  };

  return (
    <DashboardLayout role="owner">

      <div className="contrat-page">

        <h2 className="contrat-title">
          Créer un contrat blockchain
        </h2>

        <form className="contrat-card" onSubmit={handleSubmit}>

          {/* LOGEMENT */}
          <div className="form-group">
            <label>Logement</label>
            <select
              name="logement_id"
              onChange={handleChange}
              className="form-control contrat-input"
            >
              <option value="">Sélectionner un logement</option>

              {logements.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.titre} - {l.ville}
                </option>
              ))}
            </select>
          </div>

          {/* TENANT */}
          <div className="form-group">
            <label>Adresse locataire (wallet)</label>
            <input
              name="tenant_address"
              onChange={handleChange}
              className="form-control contrat-input"
              placeholder="0x..."
            />
          </div>

          {/* RENT */}
          <div className="form-group">
            <label>Loyer</label>
            <input
              name="rent"
              onChange={handleChange}
              className="form-control contrat-input"
              placeholder="Ex: 100 ETH / MAD"
            />
          </div>

          {/* PDF HASH */}
          <div className="form-group">
            <label>Hash du contrat (PDF)</label>
            <input
              name="pdf_hash"
              onChange={handleChange}
              className="form-control contrat-input"
              placeholder="Qm...."
            />
          </div>

          <button className="contrat-btn">
            Créer contrat blockchain
          </button>

        </form>

      </div>

    </DashboardLayout>
  );
}