import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase";

export default function Navbar() {

  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-4">

      <Link className="navbar-brand text-warning fw-bold" to="/">
        Blockchain Rental
      </Link>

      <div className="d-flex align-items-center">

        <button
          onClick={handleLogout}
          className="btn btn-outline-danger"
        >
          Logout
        </button>

      </div>
    </nav>
  );
}