import { useState } from "react";
import DashboardLayout from "../../../components/DashboardLayout";
import "../../../style/AjouterLogement.css";
import { supabase } from "../../../config/supabase";

export default function AjouterLogement() {
  const [form, setForm] = useState({
    titre: "",
    adresse: "",
    ville: "",
    prix: "",
    description: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = (await supabase.auth.getUser()).data.user;

      // 1------CREATE LOGEMENT
      const { data: logement, error: errorLogement } = await supabase
        .from("logements")
        .insert([
          {
            titre: form.titre,
            adresse: form.adresse,
            ville: form.ville,
            prix: form.prix,
            description: form.description,
            owner_id: user.id
          }
        ])
        .select()
        .single();

      if (errorLogement) throw errorLogement;

      // ------------- CREATE CONTRAT --------
      const { error: errorRental } = await supabase
        .from("rentals")
        .insert([
          {
            logement_id: logement.id,
            owner_id: user.id,
            rent: form.prix,
            status: "draft"
          }
        ]);

      if (errorRental) throw errorRental;

      alert("Logement créé  avec success");

      setForm({
        titre: "",
        adresse: "",
        ville: "",
        prix: "",
        description: ""
      });

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <DashboardLayout role="owner">

      <div className="logement-page">

        <h2 className="logement-title">
          Ajouter un logement
        </h2>

        <form className="logement-card" onSubmit={handleSubmit}>

          <div className="mb-3">
            <label className="logement-label">Titre du logement</label>
            <input name="titre" onChange={handleChange} className="form-control logement-input" />
          </div>

          <div className="mb-3">
            <label className="logement-label">Adresse</label>
            <input name="adresse" onChange={handleChange} className="form-control logement-input" />
          </div>

          <div className="mb-3">
            <label className="logement-label">Ville</label>
            <input name="ville" onChange={handleChange} className="form-control logement-input" />
          </div>

          <div className="mb-3">
            <label className="logement-label">Prix</label>
            <input name="prix" type="number" onChange={handleChange} className="form-control logement-input" />
          </div>

          <div className="mb-3">
            <label className="logement-label">Description</label>
            <textarea name="description" onChange={handleChange} className="form-control logement-input" />
          </div>

          <button className="logement-btn">
            Créer logement
          </button>

        </form>

      </div>

    </DashboardLayout>
  );
}