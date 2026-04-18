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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="relative mb-10 overflow-hidden rounded-3xl bg-gradient-to-br from-surface-card via-surface to-surface-card border border-border p-8 sm:p-10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-amber-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-text-main mb-2">
                  Restoranlarınız
                </h2>
                <p className="text-sm sm:text-base text-text-muted">
                  Keşfedin, ekleyin ve yönetin — tüm restoranlarınız tek bir yerde
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <StatCard icon={<IoStorefront className="text-xl" />} label="Toplam Restoran" value={restaurants.length} color="bg-primary" delay={0} />
              <StatCard icon={<IoStar className="text-xl" />} label="Ortalama Puan" value={avgRating} color="bg-info" delay={80} />
              <StatCard icon={<IoLocation className="text-xl" />} label="Farklı Lokasyon" value={uniqueLocations} color="bg-success" delay={160} />
              <StatCard icon={<IoGridOutline className="text-xl" />} label="Kategori" value={uniqueCategories} color="bg-purple-500" delay={240} />
            </div>
          </div>
        </div>

        {restaurants.length > 0 && (
          <div className="mb-8 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                {availableCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 cursor-pointer ${
                      activeFilter === cat
                        ? "bg-primary/15 text-primary border border-primary/30 shadow-sm shadow-primary/10"
                        : "bg-surface-card text-text-muted border border-border hover:text-text-main hover:border-border-hover"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-72 flex-shrink-0">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-sm" />
                <input
                  id="search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Restoran ara..."
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-card rounded-xl border border-border text-text-main placeholder-text-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all duration-200 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {restaurants.length === 0 ? (
          <EmptyState onAddClick={() => setIsModalOpen(true)} />
        ) : filteredRestaurants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="w-20 h-20 rounded-2xl bg-surface-card border border-border flex items-center justify-center mb-5">
              <MdRestaurantMenu className="text-4xl text-text-muted/20" />
            </div>
            <p className="text-text-muted text-sm">
              &ldquo;{searchQuery || activeFilter}&rdquo; için sonuç bulunamadı
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
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
