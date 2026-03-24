// src/data/shopsData.js

export const CATEGORIES = [
  { id: 'groceries',   label: 'Groceries',   emoji: '🛒', color: 'bg-green-50 text-green-700 border-green-200' },
  { id: 'electronics', label: 'Electronics', emoji: '💻', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'sports',      label: 'Sports',      emoji: '⚽', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { id: 'clothing',    label: 'Clothing',    emoji: '👗', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'cosmetics',   label: 'Cosmetics',   emoji: '💄', color: 'bg-pink-50 text-pink-700 border-pink-200' },
  { id: 'furniture',   label: 'Furniture',   emoji: '🪑', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  { id: 'bakery',      label: 'Bakery',      emoji: '🥐', color: 'bg-amber-50 text-amber-700 border-amber-200' },
];

export const SHOPS = [
  { id: 1,  name: 'Fresh Basket',        category: 'groceries',   rating: 4.8, reviews: 312, distance: '1.2 km', status: 'open',   city: 'Mumbai',    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80' },
  { id: 2,  name: 'Green Valley Mart',   category: 'groceries',   rating: 4.5, reviews: 198, distance: '2.1 km', status: 'open',   city: 'Delhi',     image: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=400&q=80' },
  { id: 3,  name: 'Daily Needs Store',   category: 'groceries',   rating: 4.2, reviews: 145, distance: '0.8 km', status: 'closed', city: 'Pune',      image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400&q=80' },
  { id: 4,  name: 'Organic Hub',         category: 'groceries',   rating: 4.9, reviews: 421, distance: '3.4 km', status: 'open',   city: 'Bangalore', image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=400&q=80' },
  { id: 5,  name: 'TechZone',            category: 'electronics', rating: 4.7, reviews: 289, distance: '2.5 km', status: 'open',   city: 'Mumbai',    image: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=400&q=80' },
  { id: 6,  name: 'Gadget Galaxy',       category: 'electronics', rating: 4.4, reviews: 176, distance: '4.0 km', status: 'open',   city: 'Hyderabad', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80' },
  { id: 7,  name: 'Digital World',       category: 'electronics', rating: 4.1, reviews: 98,  distance: '1.9 km', status: 'closed', city: 'Chennai',   image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&q=80' },
  { id: 8,  name: 'Smart Electronics',   category: 'electronics', rating: 4.6, reviews: 334, distance: '3.1 km', status: 'open',   city: 'Delhi',     image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=400&q=80' },
  { id: 9,  name: 'ProSports Arena',     category: 'sports',      rating: 4.8, reviews: 267, distance: '2.8 km', status: 'open',   city: 'Pune',      image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&q=80' },
  { id: 10, name: 'FitGear Store',       category: 'sports',      rating: 4.3, reviews: 154, distance: '1.5 km', status: 'open',   city: 'Mumbai',    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80' },
  { id: 11, name: 'Champion Sports',     category: 'sports',      rating: 4.6, reviews: 209, distance: '3.7 km', status: 'closed', city: 'Bangalore', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&q=80' },
  { id: 12, name: 'Style Studio',        category: 'clothing',    rating: 4.9, reviews: 512, distance: '1.1 km', status: 'open',   city: 'Mumbai',    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&q=80' },
  { id: 13, name: 'Urban Threads',       category: 'clothing',    rating: 4.5, reviews: 378, distance: '2.3 km', status: 'open',   city: 'Delhi',     image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=80' },
  { id: 14, name: 'Ethnic Wear House',   category: 'clothing',    rating: 4.7, reviews: 291, distance: '0.9 km', status: 'open',   city: 'Jaipur',    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400&q=80' },
  { id: 15, name: 'Glow Beauty',         category: 'cosmetics',   rating: 4.8, reviews: 445, distance: '1.6 km', status: 'open',   city: 'Mumbai',    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80' },
  { id: 16, name: 'Luxe Cosmetics',      category: 'cosmetics',   rating: 4.6, reviews: 322, distance: '2.9 km', status: 'open',   city: 'Bangalore', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80' },
  { id: 17, name: 'Natural Beauty Co.',  category: 'cosmetics',   rating: 4.4, reviews: 187, distance: '3.2 km', status: 'closed', city: 'Chennai',   image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&q=80' },
  { id: 18, name: 'Home Comfort',        category: 'furniture',   rating: 4.5, reviews: 203, distance: '4.5 km', status: 'open',   city: 'Pune',      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80' },
  { id: 19, name: 'Wood & Craft',        category: 'furniture',   rating: 4.7, reviews: 156, distance: '5.1 km', status: 'open',   city: 'Delhi',     image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=400&q=80' },
  { id: 22, name: 'Golden Crust Bakery', category: 'bakery',      rating: 4.8, reviews: 567, distance: '0.7 km', status: 'open',   city: 'Bangalore', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80' },
  { id: 23, name: 'Sweet Delights',      category: 'bakery',      rating: 4.5, reviews: 312, distance: '2.2 km', status: 'open',   city: 'Mumbai',    image: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=400&q=80' },
  { id: 24, name: 'Sunrise Bakehouse',   category: 'bakery',      rating: 4.3, reviews: 178, distance: '3.6 km', status: 'closed', city: 'Delhi',     image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80' },
];
