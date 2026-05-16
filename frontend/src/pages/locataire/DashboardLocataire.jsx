import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { supabase } from "../../config/supabase";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x12d6DE1f7b022138E29A7037a145632BF131c77d";

export default function DashboardLocataire() {

  const [logements, setLogements] = useState([]);
  const [selectedLogement, setSelectedLogement] = useState(null);
  const [showContract, setShowContract] = useState(false);
  const [step, setStep] = useState(1);

  const [blockchainId, setBlockchainId] = useState(null);

  const [tenantForm, setTenantForm] = useState({
    fullname: "",
    email: "",
    start_date: "",
    end_date: ""
  });

  // ================= LOAD =================
  useEffect(() => {
    loadLogements();
  }, []);

  const loadLogements = async () => {
    const { data } = await supabase
      .from("logements")
      .select("*")
      .order("created_at", { ascending: false });

    setLogements(data || []);
  };

  // ================= OPEN =================
  const openContract = (logement) => {
    setSelectedLogement(logement);
    setShowContract(true);
    setStep(1);
    setBlockchainId(null);
  };

  // ================= WALLET =================
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Installe MetaMask !");
      return null;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    return await provider.getSigner();
  };

  // ================= CREATE BLOCKCHAIN RENTAL =================
  const createRentalBlockchain = async (signer) => {
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      [
        "function createRental(address _tenant, uint _rent, string _pdfHash) returns (uint)",
        "event RentalCreated(uint id, address tenant)"
      ],
      signer
    );

    const tx = await contract.createRental(
      await signer.getAddress(),
      ethers.parseEther(String(selectedLogement.prix)),
      "pdf_temp"
    );

    const receipt = await tx.wait();

    const parsedEvent = receipt.logs
      .map(log => {
        try {
          return contract.interface.parseLog(log);
        } catch {
          return null;
        }
      })
      .find(e => e && e.name === "RentalCreated");

    if (!parsedEvent) throw new Error("Event introuvable");

    const id = Number(parsedEvent.args.id);

    setBlockchainId(id);

    return id;
  };

  // ================= SIGN CONTRACT =================
  const signContract = async () => {
    try {
      const signer = await connectWallet();
      if (!signer) return;

      let id = blockchainId;

      if (!id) {
        id = await createRentalBlockchain(signer);
      }

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ["function signContract(uint _id)"],
        signer
      );

      const tx = await contract.signContract(id);
      await tx.wait();

      alert("✍️ Contrat signé !");
    } catch (err) {
      console.log(err);
      alert("❌ erreur signature");
    }
  };

  // ================= PAYMENT =================
  const confirmRental = async () => {
    try {
      const user = await supabase.auth.getUser();

      const signer = await connectWallet();
      if (!signer) return;

      let id = blockchainId;

      if (!id) {
        id = await createRentalBlockchain(signer);
      }

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ["function payRent(uint _id) payable"],
        signer
      );

      const price = Number(selectedLogement.prix);

      const tx = await contract.payRent(id, {
        value: ethers.parseEther(price.toString())
      });

      await tx.wait();

      await supabase.from("rentals").insert([
        {
          logement_id: selectedLogement.blockchain_id ,
          owner_id: selectedLogement.owner_id,
          tenant_id: user.data.user.id,
          fullname: tenantForm.fullname,
          email: tenantForm.email,
          start_date: tenantForm.start_date,
          end_date: tenantForm.end_date,
          rent: price,
          status: "paid",
          blockchain_id: id
        }
      ]);

      alert("✅ Paiement + contrat OK !");
      setShowContract(false);

    } catch (err) {
      console.log(err);
      alert("❌ paiement échoué");
    }
  };

  // ================= UI (ANCIEN DESIGN CONSERVÉ) =================
  return (
    <DashboardLayout role="tenant">

      <div className="row">

        {logements.map((l) => (
          <div className="col-md-4 mb-3" key={l.id}>
            <div className="card bg-dark text-white border-warning p-3">

              <h5>{l.titre}</h5>
              <p>{l.adresse}</p>
              <p>{l.prix} ETH</p>

              <button
                className="btn btn-warning"
                onClick={() => openContract(l)}
              >
                Louer
              </button>

            </div>
          </div>
        ))}

      </div>

      {/* MODAL */}
      {showContract && selectedLogement && (
        <div className="modal-overlay" onClick={() => setShowContract(false)}>

          <div className="modal-box" onClick={(e) => e.stopPropagation()}>

            {step === 1 && (
              <>
                <h4>Contrat</h4>

                <p>{selectedLogement.titre}</p>
                <p>{selectedLogement.adresse}</p>
                <p>{selectedLogement.prix} ETH</p>

                <button
                  className="btn btn-warning w-100"
                  onClick={() => setStep(2)}
                >
                  Continuer
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <input
                  className="form-control mb-2"
                  placeholder="Nom"
                  onChange={(e) =>
                    setTenantForm({ ...tenantForm, fullname: e.target.value })
                  }
                />

                <input
                  className="form-control mb-2"
                  placeholder="Email"
                  onChange={(e) =>
                    setTenantForm({ ...tenantForm, email: e.target.value })
                  }
                />

                <input
                  type="date"
                  className="form-control mb-2"
                  onChange={(e) =>
                    setTenantForm({ ...tenantForm, start_date: e.target.value })
                  }
                />

                <input
                  type="date"
                  className="form-control mb-3"
                  onChange={(e) =>
                    setTenantForm({ ...tenantForm, end_date: e.target.value })
                  }
                />

                <button
                  className="btn btn-success w-100 mb-2"
                  onClick={confirmRental}
                >
                  Payer + signer
                </button>

                <button
                  className="btn btn-outline-warning w-100"
                  onClick={signContract}
                >
                  Just signer
                </button>
              </>
            )}

          </div>
        </div>
      )}

    </DashboardLayout>
  );
}