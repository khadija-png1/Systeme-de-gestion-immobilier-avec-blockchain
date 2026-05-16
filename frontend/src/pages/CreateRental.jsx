import { useState } from "react";
import { createRental } from "../services/api";

export default function CreateRental() {
  const [form, setForm] = useState({
    tenant: "",
    rent: "",
    pdfHash: "",
    fromAddress: ""
  });

  const handleSubmit = async () => {
    const res = await createRental(form);
    alert(res.data.txHash);
  };

  return (
    <div>
      <h2>Create Rental</h2>

      <input placeholder="tenant" onChange={(e) =>
        setForm({ ...form, tenant: e.target.value })} />

      <input placeholder="rent" onChange={(e) =>
        setForm({ ...form, rent: e.target.value })} />

      <input placeholder="pdfHash" onChange={(e) =>
        setForm({ ...form, pdfHash: e.target.value })} />

      <input placeholder="fromAddress" onChange={(e) =>
        setForm({ ...form, fromAddress: e.target.value })} />

      <button onClick={handleSubmit}>
        Create
      </button>
    </div>
  );
}