import { IRestaurant } from "../Interfaces/IRestaurant";
import { FiEdit3, FiTrash2, FiMapPin } from "react-icons/fi";
import { IoStar, IoStarHalf, IoStarOutline } from "react-icons/io5";
import { MdFastfood } from "react-icons/md";

interface RestaurantCardProps {
  restaurant: IRestaurant;
  onEdit: (restaurant: IRestaurant) => void;
  onDelete: (id: number) => void;
  index: number;
}

const getCategoryStyle = (category: string) => {
  const lower = category.toLowerCase();
  if (lower.includes("fast food"))
    return { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20", dot: "bg-red-400" };
  if (lower.includes("kafe") || lower.includes("coffee"))
    return { bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/20", dot: "bg-violet-400" };
  if (lower.includes("geleneksel") || lower.includes("izgara"))
    return { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", dot: "bg-emerald-400" };
  if (lower.includes("dijital"))
    return { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/20", dot: "bg-cyan-400" };
  if (lower.includes("deniz"))
    return { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20", dot: "bg-blue-400" };
  if (lower.includes("pizza") || lower.includes("makarna"))
    return { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", dot: "bg-amber-400" };
  return { bg: "bg-primary/10", text: "text-primary-light", border: "border-primary/20", dot: "bg-primary" };
};

const getRatingColor = (rating: number) => {
  if (rating >= 4.5) return "text-emerald-400";
  if (rating >= 4.0) return "text-amber-400";
  if (rating >= 3.0) return "text-orange-400";
  return "text-red-400";
};

const renderStars = (rating: number) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<IoStar key={i} className="text-amber-400 text-[11px]" />);
    } else if (i === fullStars && hasHalf) {
      stars.push(<IoStarHalf key={i} className="text-amber-400 text-[11px]" />);
    } else {
      stars.push(<IoStarOutline key={i} className="text-text-muted/30 text-[11px]" />);
    }
  }
  return stars;
};

const RestaurantCard = ({ restaurant, onEdit, onDelete, index }: RestaurantCardProps) => {
  const categoryStyle = getCategoryStyle(restaurant.category);

  return (
    <div
      id={`restaurant-card-${restaurant.id}`}
      className="group relative bg-surface-card rounded-2xl border border-border hover:border-border-hover overflow-hidden card-hover animate-fade-in-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="relative h-44 sm:h-48 overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-card via-surface-card/20 to-transparent" />

        <div className="absolute top-3 left-3">
          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg glass border border-white/10 ${getRatingColor(restaurant.rating)}`}>
            <IoStar className="text-sm drop-shadow-sm" />
            <span className="text-sm font-bold">{restaurant.rating}</span>
          </div>
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <button
            id={`edit-btn-${restaurant.id}`}
            onClick={() => onEdit(restaurant)}
            className="p-2.5 rounded-xl glass border border-white/10 text-white/80 hover:text-primary hover:border-primary/30 transition-all duration-200 cursor-pointer hover:scale-110"
            title="Düzenle"
          >
            <FiEdit3 className="text-sm" />
          </button>
          <button
            id={`delete-btn-${restaurant.id}`}
            onClick={() => onDelete(restaurant.id)}
            className="p-2.5 rounded-xl glass border border-white/10 text-white/80 hover:text-danger hover:border-danger/30 transition-all duration-200 cursor-pointer hover:scale-110"
            title="Sil"
          >
            <FiTrash2 className="text-sm" />
          </button>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-text-main mb-2.5 group-hover:text-primary-light transition-colors duration-300 leading-snug truncate">
          {restaurant.name}
        </h3>

        <div className="mb-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}
          >
            <MdFastfood className="text-[10px]" />
            {restaurant.category}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-text-muted">
            <FiMapPin className="text-sm flex-shrink-0" />
            <span className="text-sm">{restaurant.location}</span>
          </div>
          <div className="flex items-center gap-0.5">
            {renderStars(restaurant.rating)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
