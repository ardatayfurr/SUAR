import { useState, useEffect, useRef, useCallback } from "react";
import { IRestaurant, MOCK_DATA, CATEGORY_IMAGES, DEFAULT_IMAGE } from "../Interfaces/IRestaurant";
import RestaurantCard from "../Components/RestaurantCard";
import RestaurantModal from "../Components/RestaurantModal";
import DeleteConfirmModal from "../Components/DeleteConfirmModal";
import EmptyState from "../Components/EmptyState";
import StatCard from "../Components/StatCard";
import Toast, { ToastType } from "../Components/Toast";
import { FiSearch } from "react-icons/fi";
import { MdRestaurantMenu } from "react-icons/md";
import { IoStorefront, IoStar, IoLocation, IoGridOutline } from "react-icons/io5";

const STORAGE_KEY = "suar_restaurants";

const getInitialData = (): IRestaurant[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const migrated = parsed.map((r: IRestaurant) => ({
          ...r,
          image: r.image || CATEGORY_IMAGES[r.category] || DEFAULT_IMAGE,
        }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        return migrated;
      }
    }
  } catch {}
  localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_DATA));
  return MOCK_DATA;
};

interface DashboardProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const Dashboard = ({ isModalOpen, setIsModalOpen }: DashboardProps) => {
  const [restaurants, setRestaurants] = useState<IRestaurant[]>(getInitialData);
  const [editingRestaurant, setEditingRestaurant] = useState<IRestaurant | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IRestaurant | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tümü");
  const [toast, setToast] = useState<{ message: string; type: ToastType; visible: boolean }>({
    message: "",
    type: "success",
    visible: false,
  });
  const isFirstRender = useRef(true);

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type, visible: true });
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(restaurants));
    window.dispatchEvent(new Event("restaurants_updated"));
  }, [restaurants]);

  const handleSave = (data: Omit<IRestaurant, "id"> & { id?: number }) => {
    if (data.id) {
      setRestaurants((prev) =>
        prev.map((r) => (r.id === data.id ? { ...r, ...data, id: r.id } : r))
      );
      showToast(`"${data.name}" başarıyla güncellendi`, "update");
    } else {
      const newId = restaurants.length > 0
        ? Math.max(...restaurants.map((r) => r.id)) + 1
        : 1;
      const image = data.image || CATEGORY_IMAGES[data.category] || DEFAULT_IMAGE;
      setRestaurants((prev) => [...prev, { ...data, id: newId, image }]);
      showToast(`"${data.name}" başarıyla eklendi`, "success");
    }
  };

  const handleDelete = (id: number) => {
    const target = restaurants.find((r) => r.id === id);
    if (target) setDeleteTarget(target);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setRestaurants((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      showToast(`"${deleteTarget.name}" silindi`, "delete");
      setDeleteTarget(null);
    }
  };

  const handleEdit = (restaurant: IRestaurant) => {
    setEditingRestaurant(restaurant);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingRestaurant(null);
  };

  const availableCategories = ["Tümü", ...new Set(restaurants.map((r) => r.category))];

  const filteredRestaurants = restaurants.filter((r) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      r.name.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.location.toLowerCase().includes(q);
    const matchesFilter = activeFilter === "Tümü" || r.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const avgRating = restaurants.length > 0
    ? (restaurants.reduce((acc, r) => acc + r.rating, 0) / restaurants.length).toFixed(1)
    : "0";
  const uniqueLocations = new Set(restaurants.map((r) => r.location)).size;
  const uniqueCategories = new Set(restaurants.map((r) => r.category)).size;

  return (
    <>
      <main className="w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex flex-col gap-12 sm:gap-16">
        {/* Stats Section */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-surface-card via-surface to-surface-card border border-border p-8 sm:p-12 shadow-2xl shadow-black/40">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
              <div>
                <h2 className="text-4xl sm:text-5xl font-extrabold text-text-main mb-3 tracking-tight">
                  Restoranlarınız
                </h2>
                <p className="text-base sm:text-lg text-text-muted max-w-xl leading-relaxed">
                  Keşfedin, ekleyin ve yönetin — tüm restoranlarınız tek bir yerde şık bir şekilde listelensin.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <StatCard icon={<IoStorefront className="text-2xl" />} label="Toplam Restoran" value={restaurants.length} color="bg-primary" delay={0} />
              <StatCard icon={<IoStar className="text-2xl" />} label="Ortalama Puan" value={avgRating} color="bg-info" delay={80} />
              <StatCard icon={<IoLocation className="text-2xl" />} label="Farklı Lokasyon" value={uniqueLocations} color="bg-success" delay={160} />
              <StatCard icon={<IoGridOutline className="text-2xl" />} label="Kategori" value={uniqueCategories} color="bg-purple-500" delay={240} />
            </div>
          </div>
        </div>

        {/* Filters and Search Section */}
        {restaurants.length > 0 && (
          <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-surface-card/50 backdrop-blur-xl p-4 sm:p-5 rounded-[2rem] border border-border shadow-xl shadow-black/20">
              
              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide px-1">
                  {availableCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveFilter(cat)}
                      className={`flex-shrink-0 px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 cursor-pointer whitespace-nowrap ${
                        activeFilter === cat
                          ? "bg-gradient-to-r from-primary to-amber-500 text-white shadow-lg shadow-primary/30 scale-105"
                          : "bg-surface-light text-text-secondary hover:bg-surface hover:text-text-main border border-border hover:border-primary/50"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative w-full lg:w-96 flex-shrink-0 group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                  <FiSearch className="text-text-muted group-focus-within:text-primary text-xl transition-colors" />
                </div>
                <input
                  id="search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Restoran veya lokasyon ara..."
                  className="w-full pl-14 pr-5 py-4 bg-surface-light rounded-2xl border border-border text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 text-base shadow-inner"
                />
              </div>
              
            </div>
          </div>
        )}

        {/* Restaurant Grid Section */}
        {restaurants.length === 0 ? (
          <EmptyState onAddClick={() => setIsModalOpen(true)} />
        ) : filteredRestaurants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 animate-fade-in bg-surface-card/30 rounded-[2.5rem] border border-border/50">
            <div className="w-24 h-24 rounded-3xl bg-surface border border-border flex items-center justify-center mb-6 shadow-lg shadow-black/20">
              <MdRestaurantMenu className="text-5xl text-text-muted/30" />
            </div>
            <p className="text-text-muted text-lg font-medium">
              &ldquo;<span className="text-text-main">{searchQuery || activeFilter}</span>&rdquo; için sonuç bulunamadı
            </p>
            <button 
              onClick={() => {setSearchQuery(""); setActiveFilter("Tümü");}}
              className="mt-6 px-6 py-2.5 bg-surface-light hover:bg-surface border border-border hover:border-primary/50 rounded-xl text-sm font-medium transition-all text-text-secondary hover:text-text-main cursor-pointer"
            >
              Filtreleri Temizle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredRestaurants.map((restaurant, index) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onEdit={handleEdit}
                onDelete={handleDelete}
                index={index}
              />
            ))}
          </div>
        )}
      </main>

      <RestaurantModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleSave}
        editingRestaurant={editingRestaurant}
      />
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        restaurantName={deleteTarget?.name || ""}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </>
  );
};

export default Dashboard;
