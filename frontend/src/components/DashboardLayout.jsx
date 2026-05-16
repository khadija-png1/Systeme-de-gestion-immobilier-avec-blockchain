import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout({ children, role }) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#0b0b0b",
        flexDirection: "column"
      }}
    >

      {/* NAVBAR */}
      <Navbar />

      <div style={{ display: "flex", flex: 1 }}>

        {/* SIDEBAR */}
        <Sidebar role={role} />

        {/* CONTENT */}
        <div style={{ flex: 1, padding: "20px", color: "white" }}>
          {children}
        </div>

      </div>
    </div>
  );
}