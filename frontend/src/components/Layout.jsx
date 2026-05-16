import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div style={{ background: "#0b0b0b", minHeight: "100vh" }}>

      <Navbar />

      <div style={{ display: "flex" }}>

        <Sidebar />

        <div style={{ flex: 1, padding: 20, color: "white" }}>
          {children}
        </div>

      </div>

      <Footer />
    </div>
  );
}