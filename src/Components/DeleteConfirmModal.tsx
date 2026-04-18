import { IoWarningOutline } from "react-icons/io5";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  restaurantName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmModal = ({ isOpen, restaurantName, onConfirm, onCancel }: DeleteConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      id="delete-confirm-overlay"
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-sm bg-surface rounded-2xl border border-border shadow-2xl shadow-black/60 animate-scale-in overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-danger to-transparent" />
        <div className="p-6 text-center">
          <div className="relative w-16 h-16 mx-auto mb-5">
            <div className="absolute inset-0 rounded-full bg-danger/20 blur-xl" />
            <div className="relative w-full h-full rounded-full bg-danger/10 border border-danger/20 flex items-center justify-center">
              <IoWarningOutline className="text-danger text-3xl" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-text-main mb-2">Restoranı Sil</h3>
          <p className="text-sm text-text-muted mb-6 leading-relaxed">
            <span className="font-semibold text-text-main">{restaurantName}</span> restoranını silmek istediğinize emin misiniz?
            <br /><span className="text-xs text-text-muted/70">Bu işlem geri alınamaz.</span>
          </p>
          <div className="flex items-center gap-3">
            <button id="delete-cancel-button" onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-xl border border-border text-text-muted hover:text-text-main hover:bg-surface-lighter transition-all duration-200 font-medium cursor-pointer text-sm">Vazgeç</button>
            <button id="delete-confirm-button" onClick={onConfirm} className="flex-1 px-4 py-2.5 bg-danger hover:bg-danger-dark text-white font-semibold rounded-xl shadow-lg shadow-danger/25 hover:shadow-danger/40 transition-all duration-300 cursor-pointer text-sm">Evet, Sil</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
