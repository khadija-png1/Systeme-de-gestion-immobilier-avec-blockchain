import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import RentalCard from "../../components/shared/RentalCard";
import { supabase } from "../../config/supabase";

export default function DashboardProprietaire() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        setLoading(false);
        return;
      }

      // Récupérer les rentals de ce propriétaire
      const { data, error } = await supabase
        .from("rentals")
        .select("*")
        .eq("owner_id", user.data.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erreur:", error);
        alert("❌ Erreur chargement: " + error.message);
      } else {
        setRentals(data || []);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="owner">

      <h2 style={{ color: "#f5c542" }}>
        Tableau de bord propriétaire
      </h2>

      {loading ? (
        <p>⏳ Chargement...</p>
      ) : rentals.length === 0 ? (
        <p style={{ color: "#aaa" }}>
          <i className="bi bi-inbox"></i> Aucun contrat créé
        </p>
      ) : (
        rentals.map((r, i) => (
          <RentalCard key={i} rental={r} />
        ))
      )}

    </DashboardLayout>
  );
}