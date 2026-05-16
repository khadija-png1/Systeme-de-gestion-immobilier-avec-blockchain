import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../style/Auth.css";
import { supabase } from "../../config/supabase";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "tenant"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password
    });

    if (error) {
      alert(error.message);
      return;
    }

    await supabase.from("profiles").insert([
      {
        id: data.user.id,
        fullname: form.fullname,
        role: form.role
      }
    ]);

    navigate("/login");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <div className="text-center">
          <i className="bi bi-person-plus auth-icon"></i>
          <h1 className="auth-title">Inscription</h1>
          <p className="auth-subtitle">
            Créez votre compte 
          </p>
        </div>

        <form className="mt-4" onSubmit={handleRegister}>

          {/* FULL NAME */}
          <label className="auth-label">Nom complet</label>
          <input
            name="fullname"
            onChange={handleChange}
            className="form-control auth-input mb-3"
            placeholder="Ex: Amine Bouallaoui"
          />

          {/* EMAIL */}
          <label className="auth-label">Adresse email</label>
          <input
            name="email"
            onChange={handleChange}
            className="form-control auth-input mb-3"
            placeholder="exemple@email.com"
          />

          {/* PASSWORD */}
          <label className="auth-label">Mot de passe</label>
          <input
            name="password"
            type="password"
            onChange={handleChange}
            className="form-control auth-input mb-3"
            placeholder="********"
          />

          {/* ROLE */}
          <label className="auth-label">Type de compte</label>
          <select
            name="role"
            onChange={handleChange}
            className="form-control auth-input mb-3"
          >
            <option value="tenant">Locataire</option>
            <option value="owner">Propriétaire</option>
          </select>

          <button className="btn auth-btn w-100">
            Créer un compte
          </button>

        </form>

        <p className="text-center mt-4 text-light">
          Déjà un compte ?
          <Link to="/login" className="auth-link">
            Se connecter
          </Link>
        </p>

      </div>
    </div>
  );
}