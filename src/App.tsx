import { useState } from "react";
import Navbar from "./Components/Navbar";
import Dashboard from "./Pages/Dashboard";

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getCount = () => {
    try {
      const stored = localStorage.getItem("suar_restaurants");
      if (stored) return JSON.parse(stored).length;
    } catch {}
    return 3;
  };

  const [restaurantCount, setRestaurantCount] = useState(getCount);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const updateCount = () => {
    try {
      const stored = localStorage.getItem("suar_restaurants");
      if (stored) {
        const count = JSON.parse(stored).length;
        if (count !== restaurantCount) setRestaurantCount(count);
      }
    } catch {}
  };

  setTimeout(updateCount, 500);

  return (
    <div className="min-h-screen bg-bg">
      <Navbar onAddClick={handleModalOpen} restaurantCount={restaurantCount} />
      <Dashboard isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />

      <footer className="relative border-t border-border py-8 mt-16">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-text-muted">
              © 2026{" "}
              <span className="text-gradient font-bold">SUAR</span>
              {" "}— Restoran Listeleme Uygulaması
            </p>
            <p className="text-xs text-text-muted/50">
              React + TypeScript + Tailwind CSS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
