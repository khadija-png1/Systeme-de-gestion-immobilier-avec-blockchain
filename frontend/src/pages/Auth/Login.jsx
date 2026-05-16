import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../style/Auth.css";
import { supabase } from "../../config/supabase";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password
    });

    if (error) {
      alert(error.message);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (profile.role === "owner") {
      navigate("/DashboardProprietaire");
    } else {
      navigate("/DashboardLocataire");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <div className="text-center">
          <i className="bi bi-shield-lock auth-icon"></i>
          <h1 className="auth-title">Connexion</h1>
          <p className="auth-subtitle">
            Accédez à votre espace sécurisé
          </p>
        </div>

        <form className="mt-4" onSubmit={handleLogin}>

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

          <button className="btn auth-btn w-100">
            Se connecter
          </button>

        </form>

        <p className="text-center mt-4 text-light">
          Pas de compte ?
          <Link to="/register" className="auth-link">
            S'inscrire
          </Link>
        </p>

      </div>
    </div>
  );
}