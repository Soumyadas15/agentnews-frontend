import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--ink)" }}>
      <Navbar />
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
