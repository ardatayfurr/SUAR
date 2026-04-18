import { useState, useEffect } from "react";
import { MdRestaurantMenu } from "react-icons/md";
import { IoAddCircle } from "react-icons/io5";

interface NavbarProps {
  onAddClick: () => void;
  restaurantCount: number;
}

const Navbar = ({ onAddClick, restaurantCount }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass border-b border-border shadow-xl shadow-black/30"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          <div className="flex items-center gap-3.5 group cursor-pointer select-none">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-amber-500 blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-all duration-300 group-hover:scale-105">
                <MdRestaurantMenu className="text-white text-xl" />
              </div>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                <span className="text-gradient">SU</span>
                <span className="text-text-main">AR</span>
              </h1>
              <p className="text-[9px] sm:text-[10px] text-text-muted -mt-0.5 tracking-[0.2em] uppercase font-medium">
                Restoran Listeleme
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-card border border-border">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs text-text-muted font-medium">
                {restaurantCount} aktif
              </span>
            </div>

            <button
              id="navbar-add-button"
              onClick={onAddClick}
              className="group/btn relative flex items-center gap-2 px-4 sm:px-5 py-2.5 overflow-hidden rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-amber-500 transition-all duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-dark to-amber-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 shadow-lg shadow-primary/25 group-hover/btn:shadow-primary/40 transition-shadow duration-300" />

              <IoAddCircle className="relative text-white text-lg" />
              <span className="relative text-white hidden sm:inline">
                Restoran Ekle
              </span>
              <span className="relative text-white sm:hidden">Ekle</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
