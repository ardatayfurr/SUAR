import { useState, useEffect } from "react";
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

  useEffect(() => {
    // Listen for storage events (from other tabs or same tab if custom event dispatched)
    window.addEventListener("storage", updateCount);
    window.addEventListener("restaurants_updated", updateCount);
    
    // Initial check
    updateCount();
    
    return () => {
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("restaurants_updated", updateCount);
    };
  }, [restaurantCount]);

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Navbar onAddClick={handleModalOpen} restaurantCount={restaurantCount} />
      
      <div className="flex-grow flex flex-col items-center w-full">
        <div className="w-full max-w-7xl mx-auto">
          <Dashboard isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </div>
      </div>

      <footer className="relative border-t border-border py-8 mt-auto w-full">
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
