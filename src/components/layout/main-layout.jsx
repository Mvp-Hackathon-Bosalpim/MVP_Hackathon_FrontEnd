import { Outlet } from "react-router-dom";
import Header from "./header";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-surface-100">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}