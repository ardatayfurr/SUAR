export interface IRestaurant {
  id: number;
  name: string;
  category: string;
  location: string;
  rating: number;
  image: string;
}

export const CATEGORIES = [
  "Geleneksel Mutfak & Izgara",
  "Fast Food",
  "Kafe",
  "Dijital Menü",
  "Deniz Ürünleri",
  "Pizza & Makarna",
  "Sokak Lezzetleri",
  "Vejetaryen",
] as const;

export const CATEGORY_IMAGES: Record<string, string> = {
  "Geleneksel Mutfak & Izgara": "/images/traditional.png",
  "Fast Food": "/images/fastfood.png",
  "Kafe": "/images/cafe.png",
  "Pizza & Makarna": "/images/pizza.png",
  "Deniz Ürünleri": "/images/seafood.png",
};

export const DEFAULT_IMAGE = "/images/default.png";

export const MOCK_DATA: IRestaurant[] = [
  {
    id: 1,
    name: "Yesemek Restaurant",
    category: "Geleneksel Mutfak & Izgara",
    location: "Bursa",
    rating: 4.8,
    image: "/images/traditional.png",
  },
  {
    id: 2,
    name: "Burger Station",
    category: "Fast Food",
    location: "İstanbul",
    rating: 4.2,
    image: "/images/fastfood.png",
  },
  {
    id: 3,
    name: "K&A Coffee Roasters",
    category: "Kafe",
    location: "İzmir",
    rating: 4.9,
    image: "/images/cafe.png",
  },
];
