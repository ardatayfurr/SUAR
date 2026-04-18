import { useState, useEffect } from "react";
import { IRestaurant, CATEGORIES, CATEGORY_IMAGES, DEFAULT_IMAGE } from "../Interfaces/IRestaurant";
import { IoClose } from "react-icons/io5";
import { FiSave, FiImage } from "react-icons/fi";
import { MdRestaurantMenu } from "react-icons/md";

interface RestaurantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (restaurant: Omit<IRestaurant, "id"> & { id?: number }) => void;
  editingRestaurant: IRestaurant | null;
}

const RestaurantModal = ({ isOpen, onClose, onSave, editingRestaurant }: RestaurantModalProps) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState("4.0");
  const [image, setImage] = useState(DEFAULT_IMAGE);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingRestaurant) {
      setName(editingRestaurant.name);
      setCategory(editingRestaurant.category);
      setLocation(editingRestaurant.location);
      setRating(editingRestaurant.rating.toString());
      setImage(editingRestaurant.image);
    } else {
      setName("");
      setCategory(CATEGORIES[0]);
      setLocation("");
      setRating("4.0");
      setImage(CATEGORY_IMAGES[CATEGORIES[0]] || DEFAULT_IMAGE);
    }
    setErrors({});
  }, [editingRestaurant, isOpen]);

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    if (!editingRestaurant) {
      setImage(CATEGORY_IMAGES[newCategory] || DEFAULT_IMAGE);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Restoran adı zorunludur";
    if (!location.trim()) newErrors.location = "Lokasyon zorunludur";
    const ratingNum = parseFloat(rating);
    if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 5) {
      newErrors.rating = "Puan 0 ile 5 arasında olmalıdır";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      ...(editingRestaurant ? { id: editingRestaurant.id } : {}),
      name: name.trim(),
      category,
      location: location.trim(),
      rating: parseFloat(parseFloat(rating).toFixed(1)),
      image,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      id="restaurant-modal-overlay"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative w-full max-w-xl bg-surface rounded-2xl border border-border shadow-2xl shadow-black/60 animate-scale-in overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />

        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-amber-500 blur-md opacity-40" />
              <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center">
                <MdRestaurantMenu className="text-white text-lg" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-main">
                {editingRestaurant ? "Restoranı Düzenle" : "Yeni Restoran Ekle"}
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                {editingRestaurant ? "bilgileri güncelleyip kaydedin" : "restoran bilgilerini doldurun"}
              </p>
            </div>
          </div>
          <button
            id="modal-close-button"
            onClick={onClose}
            className="p-2.5 rounded-xl hover:bg-surface-lighter text-text-muted hover:text-text-main transition-all duration-200 cursor-pointer hover:rotate-90"
          >
            <IoClose className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-5">
            <div className="relative h-32 rounded-xl overflow-hidden border border-border group">
              <img src={image} alt="Önizleme" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="flex items-center gap-2 text-white/80 text-xs">
                  <FiImage className="text-sm" />
                  <span>Kategoriye göre otomatik seçilir</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label htmlFor="restaurant-name" className="block text-sm font-medium text-text-secondary mb-1.5">
                Restoran Adı
              </label>
              <input
                id="restaurant-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="örn: Yesemek Restaurant"
                className={`w-full px-4 py-3 bg-surface-light rounded-xl border text-text-main placeholder-text-muted/40 focus:outline-none focus:ring-2 transition-all duration-200 text-sm ${
                  errors.name ? "border-danger focus:ring-danger/30" : "border-border focus:border-primary/50 focus:ring-primary/20"
                }`}
              />
              {errors.name && <p className="mt-1 text-xs text-danger">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="restaurant-category" className="block text-sm font-medium text-text-secondary mb-1.5">
                Kategori
              </label>
              <select
                id="restaurant-category"
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-4 py-3 bg-surface-light rounded-xl border border-border text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200 cursor-pointer text-sm"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-surface-light">{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="restaurant-location" className="block text-sm font-medium text-text-secondary mb-1.5">
                Lokasyon
              </label>
              <input
                id="restaurant-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="örn: İstanbul"
                className={`w-full px-4 py-3 bg-surface-light rounded-xl border text-text-main placeholder-text-muted/40 focus:outline-none focus:ring-2 transition-all duration-200 text-sm ${
                  errors.location ? "border-danger focus:ring-danger/30" : "border-border focus:border-primary/50 focus:ring-primary/20"
                }`}
              />
              {errors.location && <p className="mt-1 text-xs text-danger">{errors.location}</p>}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="restaurant-rating" className="block text-sm font-medium text-text-secondary mb-1.5">
                Puan
                <span className="text-text-muted/50 font-normal ml-1">(0 - 5)</span>
              </label>
              <input
                id="restaurant-rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className={`w-full px-4 py-3 bg-surface-light rounded-xl border text-text-main focus:outline-none focus:ring-2 transition-all duration-200 text-sm ${
                  errors.rating ? "border-danger focus:ring-danger/30" : "border-border focus:border-primary/50 focus:ring-primary/20"
                }`}
              />
              {errors.rating && <p className="mt-1 text-xs text-danger">{errors.rating}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6 pt-5 border-t border-border">
            <button
              id="modal-cancel-button"
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border border-border text-text-muted hover:text-text-main hover:bg-surface-lighter hover:border-border-hover transition-all duration-200 font-medium cursor-pointer text-sm"
            >
              İptal
            </button>
            <button
              id="modal-save-button"
              type="submit"
              className="relative flex-1 flex items-center justify-center gap-2 px-4 py-3 overflow-hidden rounded-xl font-semibold text-sm transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-amber-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-dark to-amber-600 opacity-0 hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 shadow-lg shadow-primary/25" />
              <FiSave className="relative text-white text-base" />
              <span className="relative text-white">
                {editingRestaurant ? "Güncelle" : "Kaydet"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestaurantModal;
