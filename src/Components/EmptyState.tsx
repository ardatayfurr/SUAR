import { MdRestaurantMenu } from "react-icons/md";
import { IoAddCircle } from "react-icons/io5";

interface EmptyStateProps {
  onAddClick: () => void;
}

const EmptyState = ({ onAddClick }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 animate-fade-in-up">
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-3xl bg-primary/10 blur-2xl" />
        <div className="relative w-24 h-24 rounded-3xl bg-surface-card border border-border flex items-center justify-center">
          <MdRestaurantMenu className="text-5xl text-text-muted/30" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-text-main mb-3">Henüz restoran yok</h3>
      <p className="text-sm text-text-muted mb-8 text-center max-w-md leading-relaxed">
        İlk restoranınızı ekleyerek listenizi oluşturmaya başlayın. Eklediğiniz restoranlar burada kartlar halinde listelenecektir.
      </p>
      <button
        id="empty-state-add-button"
        onClick={onAddClick}
        className="relative flex items-center gap-2 px-7 py-3.5 overflow-hidden rounded-xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-amber-500" />
        <div className="absolute inset-0 shadow-lg shadow-primary/30" />
        <IoAddCircle className="relative text-white text-lg" />
        <span className="relative text-white">İlk Restoranı Ekle</span>
      </button>
    </div>
  );
};

export default EmptyState;
