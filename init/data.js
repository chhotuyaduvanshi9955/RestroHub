const resturants = [
  // Delhi - 7 restaurants
  {
    name: "Taj Indian Kitchen",
    city: "New Delhi",
    cuisine: "Indian, North Indian",
    rating: 4.8,
    priceRange: 800,
    address: "Connaught Place, New Delhi",
    description: "Authentic North Indian cuisine with traditional recipes.",
    img: "https://images.unsplash.com/photo-1585521537230-68679ca871d0?w=400&h=300&fit=crop"
  },
  {
    name: "Green Leaf Cafe",
    city: "New Delhi",
    cuisine: "Vegetarian, Healthy",
    rating: 4.6,
    priceRange: 400,
    address: "Karol Bagh, New Delhi",
    description: "Healthy vegetarian meals and organic cafe.",
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop"
  },
  {
    name: "Spice Route",
    city: "New Delhi",
    cuisine: "Indian, Continental",
    rating: 4.7,
    priceRange: 800,
    address: "CP, New Delhi",
    description: "Multi-cuisine restaurant with international flavors.",
    img: "https://images.unsplash.com/photo-1589985644111-d749e0c4e5b8?w=400&h=300&fit=crop"
  },
  {
    name: "Dragon Express",
    city: "New Delhi",
    cuisine: "Chinese, Asian",
    rating: 4.5,
    priceRange: 400,
    address: "Greater Kailash, New Delhi",
    description: "Authentic Chinese food with modern twist.",
    img: "https://images.unsplash.com/photo-1571407436128-b3c50b5f5d4e?w=400&h=300&fit=crop"
  },
  {
    name: "Cafe Milano",
    city: "New Delhi",
    cuisine: "Italian, Continental",
    rating: 4.4,
    priceRange: 800,
    address: "CP, New Delhi",
    description: "Premium Italian restaurant with fine dining.",
    img: "https://images.unsplash.com/photo-1564758027156-36c7214ae82e?w=400&h=300&fit=crop"
  },
  {
    name: "Mumbai Tadka",
    city: "New Delhi",
    cuisine: "Indian, Street Food",
    rating: 4.3,
    priceRange: 200,
    address: "Chandni Chowk, New Delhi",
    description: "Authentic street food and Indian delicacies.",
    img: "https://images.unsplash.com/photo-1599521945366-40141169faa1?w=400&h=300&fit=crop"
  },
  {
    name: "The Baking Studio",
    city: "New Delhi",
    cuisine: "Bakery, Cafe",
    rating: 4.5,
    priceRange: 400,
    address: "Sector 12, New Delhi",
    description: "Freshly baked goods and artisan coffee.",
    img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop"
  },

  // Mumbai - 6 restaurants
  {
    name: "Bombay Palace",
    city: "Mumbai",
    cuisine: "Indian, Mughlai",
    rating: 4.9,
    priceRange: 800,
    address: "Bandra, Mumbai",
    description: "Luxury dining with authentic Mughlai cuisine.",
    img: "https://images.unsplash.com/photo-1585462261346-9f18de1dd5e2?w=400&h=300&fit=crop"
  },
  {
    name: "Seafood Paradise",
    city: "Mumbai",
    cuisine: "Seafood, Coastal",
    rating: 4.7,
    priceRange: 800,
    address: "Marine Drive, Mumbai",
    description: "Fresh seafood with coastal ambiance.",
    img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop"
  },
  {
    name: "Pizzeria Napoli",
    city: "Mumbai",
    cuisine: "Italian, Pizza",
    rating: 4.6,
    priceRange: 400,
    address: "Powai, Mumbai",
    description: "Wood-fired authentic Italian pizzas.",
    img: "https://images.unsplash.com/photo-1550966871-ee2850e928c9?w=400&h=300&fit=crop"
  },
  {
    name: "Vada Pav Express",
    city: "Mumbai",
    cuisine: "Street Food, Indian",
    rating: 4.4,
    priceRange: 200,
    address: "Dadar, Mumbai",
    description: "Famous for authentic Mumbai street food.",
    img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop"
  },
  {
    name: "Spice Valley",
    city: "Mumbai",
    cuisine: "Indian, Tandoori",
    rating: 4.5,
    priceRange: 400,
    address: "Worli, Mumbai",
    description: "Tandoori specialties and authentic Indian flavors.",
    img: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400&h=300&fit=crop"
  },
  {
    name: "The Coffee House",
    city: "Mumbai",
    cuisine: "Cafe, Desserts",
    rating: 4.3,
    priceRange: 400,
    address: "Fort, Mumbai",
    description: "Premium coffee and artisan desserts.",
    img: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=300&fit=crop"
  },

  // Bangalore - 6 restaurants
  {
    name: "Tech Park Bistro",
    city: "Bangalore",
    cuisine: "Continental, Fusion",
    rating: 4.7,
    priceRange: 800,
    address: "Whitefield, Bangalore",
    description: "Modern fusion cuisine with international flavors.",
    img: "https://images.unsplash.com/photo-1504674900967-a8126008fac2?w=400&h=300&fit=crop"
  },
  {
    name: "South Indian Kitchen",
    city: "Bangalore",
    cuisine: "South Indian, Dosa",
    rating: 4.8,
    priceRange: 200,
    address: "BTM Layout, Bangalore",
    description: "Authentic South Indian food and crispy dosas.",
    img: "https://images.unsplash.com/photo-1596040322539-96a4bded1e0b?w=400&h=300&fit=crop"
  },
  {
    name: "Garden Terrace",
    city: "Bangalore",
    cuisine: "Multi-Cuisine, Organic",
    rating: 4.6,
    priceRange: 400,
    address: "Indiranagar, Bangalore",
    description: "Farm-to-table organic restaurant with great ambiance.",
    img: "https://images.unsplash.com/photo-1521635523958-7ebf10fd5a00?w=400&h=300&fit=crop"
  },
  {
    name: "Spicy Dragon",
    city: "Bangalore",
    cuisine: "Chinese, Asian",
    rating: 4.5,
    priceRange: 400,
    address: "MG Road, Bangalore",
    description: "Popular Chinese restaurant with authentic taste.",
    img: "https://images.unsplash.com/photo-1571407436128-b3c50b5f5d4e?w=400&h=300&fit=crop"
  },
  {
    name: "Sushi Master",
    city: "Bangalore",
    cuisine: "Japanese, Sushi",
    rating: 4.7,
    priceRange: 1500,
    address: "Koramangala, Bangalore",
    description: "Premium Japanese cuisine and fresh sushi.",
    img: "https://images.unsplash.com/photo-1579584425555-63b60978ac25?w=400&h=300&fit=crop"
  },
  {
    name: "Burger Junction",
    city: "Bangalore",
    cuisine: "Fast Food, Burgers",
    rating: 4.4,
    priceRange: 200,
    address: "JP Nagar, Bangalore",
    description: "Gourmet burgers and fast food.",
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop"
  },

  // Hyderabad - 6 restaurants
  {
    name: "Biryani House",
    city: "Hyderabad",
    cuisine: "Hyderabadi, Biryani",
    rating: 4.9,
    priceRange: 400,
    address: "Laad Bazaar, Hyderabad",
    description: "Best Hyderabadi biryani with authentic taste.",
    img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a104?w=400&h=300&fit=crop"
  },
  {
    name: "Haleem Heritage",
    city: "Hyderabad",
    cuisine: "Hyderabadi, Traditional",
    rating: 4.7,
    priceRange: 400,
    address: "Old City, Hyderabad",
    description: "Traditional Hyderabadi cuisine and haleem.",
    img: "https://images.unsplash.com/photo-1585521537230-68679ca871d0?w=400&h=300&fit=crop"
  },
  {
    name: "Royal Feast",
    city: "Hyderabad",
    cuisine: "Indian, Mughlai",
    rating: 4.8,
    priceRange: 800,
    address: "Banjara Hills, Hyderabad",
    description: "Premium Mughlai dining experience.",
    img: "https://images.unsplash.com/photo-1585462261346-9f18de1dd5e2?w=400&h=300&fit=crop"
  },
  {
    name: "Charcoal Grill",
    city: "Hyderabad",
    cuisine: "Grilled, Continental",
    rating: 4.6,
    priceRange: 800,
    address: "Secunderabad, Hyderabad",
    description: "Specializing in charcoal grilled dishes.",
    img: "https://images.unsplash.com/photo-1555939594-58d7cb561341?w=400&h=300&fit=crop"
  },
  {
    name: "Street Spice Hub",
    city: "Hyderabad",
    cuisine: "Street Food, Indian",
    rating: 4.5,
    priceRange: 200,
    address: "Charminar, Hyderabad",
    description: "Authentic Hyderabad street food.",
    img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop"
  },
  {
    name: "Fusion Express",
    city: "Hyderabad",
    cuisine: "Fusion, Continental",
    rating: 4.4,
    priceRange: 400,
    address: "Madhapur, Hyderabad",
    description: "Modern fusion cuisine.",
    img: "https://images.unsplash.com/photo-1514432324607-2e467f4851e8?w=400&h=300&fit=crop"
  },

  // Pune - 6 restaurants
  {
    name: "Marathi Tadka",
    city: "Pune",
    cuisine: "Marathi, Indian",
    rating: 4.7,
    priceRange: 400,
    address: "Shaniwar Wada, Pune",
    description: "Authentic Marathi cuisine and traditional recipes.",
    img: "https://images.unsplash.com/photo-1589985644111-d749e0c4e5b8?w=400&h=300&fit=crop"
  },
  {
    name: "The Pan Asian",
    city: "Pune",
    cuisine: "Asian, Pan-Asian",
    rating: 4.6,
    priceRange: 800,
    address: "Viman Nagar, Pune",
    description: "Pan-Asian cuisine with authentic flavors.",
    img: "https://images.unsplash.com/photo-1571407436128-b3c50b5f5d4e?w=400&h=300&fit=crop"
  },
  {
    name: "Coffee Culture",
    city: "Pune",
    cuisine: "Cafe, Bakery",
    rating: 4.5,
    priceRange: 400,
    address: "FC Road, Pune",
    description: "Popular cafe with great coffee and pastries.",
    img: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=300&fit=crop"
  },
  {
    name: "Coastal Flavors",
    city: "Pune",
    cuisine: "Coastal, Seafood",
    rating: 4.6,
    priceRange: 400,
    address: "Koregaon Park, Pune",
    description: "Fresh seafood and coastal delicacies.",
    img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop"
  },
  {
    name: "Continental Blend",
    city: "Pune",
    cuisine: "Continental, Italian",
    rating: 4.7,
    priceRange: 800,
    address: "Baner, Pune",
    description: "Fine dining continental restaurant.",
    img: "https://images.unsplash.com/photo-1564758027156-36c7214ae82e?w=400&h=300&fit=crop"
  },
  {
    name: "Quick Bites Cafe",
    city: "Pune",
    cuisine: "Fast Food, Multi-Cuisine",
    rating: 4.3,
    priceRange: 200,
    address: "Hadapsar, Pune",
    description: "Quick service with variety of cuisines.",
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop"
  },

  // Kolkata - 5 restaurants
  {
    name: "Bengal Sweet House",
    city: "Kolkata",
    cuisine: "Bengali, Indian",
    rating: 4.8,
    priceRange: 400,
    address: "College Street, Kolkata",
    description: "Authentic Bengali cuisine and sweets.",
    img: "https://images.unsplash.com/photo-1589985644111-d749e0c4e5b8?w=400&h=300&fit=crop"
  },
  {
    name: "Raj Palace",
    city: "Kolkata",
    cuisine: "Indian, Multi-Cuisine",
    rating: 4.7,
    priceRange: 800,
    address: "Park Street, Kolkata",
    description: "Heritage restaurant with authentic flavors.",
    img: "https://images.unsplash.com/photo-1585462261346-9f18de1dd5e2?w=400&h=300&fit=crop"
  },
  {
    name: "Tea Garden Cafe",
    city: "Kolkata",
    cuisine: "Cafe, Tea",
    rating: 4.5,
    priceRange: 200,
    address: "Southern Avenue, Kolkata",
    description: "Famous for tea and light snacks.",
    img: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=300&fit=crop"
  },
  {
    name: "Italian Bistro",
    city: "Kolkata",
    cuisine: "Italian, Continental",
    rating: 4.6,
    priceRange: 3,
    address: "Tolly Club, Kolkata",
    description: "Authentic Italian dining experience.",
    img: "https://images.unsplash.com/photo-1564758027156-36c7214ae82e?w=400&h=300&fit=crop"
  },
  {
    name: "Street Food Paradise",
    city: "Kolkata",
    cuisine: "Street Food, Indian",
    rating: 4.4,
    priceRange: 200,
    address: "Lake Market, Kolkata",
    description: "Famous for pani puri and street food.",
    img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop"
  },

  // Chennai - 5 restaurants
  {
    name: "South India Kitchen",
    city: "Chennai",
    cuisine: "South Indian, Dosa",
    rating: 4.8,
    priceRange: 200,
    address: "T. Nagar, Chennai",
    description: "Crispy dosas and authentic South Indian food.",
    img: "https://images.unsplash.com/photo-1596040322539-96a4bded1e0b?w=400&h=300&fit=crop"
  },
  {
    name: "Seafood Darling",
    city: "Chennai",
    cuisine: "Seafood, Coastal",
    rating: 4.7,
    priceRange: 400,
    address: "Marina Beach, Chennai",
    description: "Fresh seafood with beach view.",
    img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop"
  },
  {
    name: "Pure Veg Palace",
    city: "Chennai",
    cuisine: "Vegetarian, Indian",
    rating: 4.6,
    priceRange: 400,
    address: "Royapettah, Chennai",
    description: "Pure vegetarian with traditional recipes.",
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop"
  },
  {
    name: "Continental Express",
    city: "Chennai",
    cuisine: "Continental, Fusion",
    rating: 4.5,
    priceRange: 800,
    address: "Anna Salai, Chennai",
    description: "Modern fusion and continental cuisine.",
    img: "https://images.unsplash.com/photo-1514432324607-2e467f4851e8?w=400&h=300&fit=crop"
  },
  {
    name: "Quick Bite Cafe",
    city: "Chennai",
    cuisine: "Fast Food, Cafe",
    rating: 4.4,
    priceRange: 200,
    address: "Nungambakkam, Chennai",
    description: "Fast food and casual dining.",
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop"
  },

  // Additional diverse locations - 9 restaurants
  {
    name: "Jaipur Royal",
    city: "Jaipur",
    cuisine: "Rajasthani, Indian",
    rating: 4.7,
    priceRange: 400,
    address: "C-Scheme, Jaipur",
    description: "Traditional Rajasthani cuisine.",
    img: "https://images.unsplash.com/photo-1589985644111-d749e0c4e5b8?w=400&h=300&fit=crop"
  },
  {
    name: "Lucknow Kebab House",
    city: "Lucknow",
    cuisine: "Awadhi, Kebab",
    rating: 4.8,
    priceRange: 400,
    address: "Hazratganj, Lucknow",
    description: "Famous Lucknow kebabs and Awadhi cuisine.",
    img: "https://images.unsplash.com/photo-1585462261346-9f18de1dd5e2?w=400&h=300&fit=crop"
  },
  {
    name: "Goa Beach Shack",
    city: "Goa",
    cuisine: "Goan, Seafood",
    rating: 4.6,
    priceRange: 400,
    address: "Calangute, Goa",
    description: "Authentic Goan cuisine and fresh seafood.",
    img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop"
  },
  {
    name: "Ahmedabad Dhokla House",
    city: "Ahmedabad",
    cuisine: "Gujarati, Indian",
    rating: 4.5,
    priceRange: 200,
    address: "Manek Chowk, Ahmedabad",
    description: "Famous for dhokla and Gujarati food.",
    img: "https://images.unsplash.com/photo-1596040322539-96a4bded1e0b?w=400&h=300&fit=crop"
  },
  {
    name: "Srinagar Wazwan",
    city: "Srinagar",
    cuisine: "Kashmiri, Wazwan",
    rating: 4.7,
    priceRange: 300,
    address: "Lal Chowk, Srinagar",
    description: "Authentic Kashmiri wazwan cuisine.",
    img: "https://images.unsplash.com/photo-1589985644111-d749e0c4e5b8?w=400&h=300&fit=crop"
  },
  {
    name: "Indore Poha Point",
    city: "Indore",
    cuisine: "Indian, Street Food",
    rating: 4.4,
    priceRange: 1000,
    address: "Sarwate, Indore",
    description: "Famous for poha and street food.",
    img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop"
  },
  {
    name: "Varanasi Baati Chokha",
    city: "Varanasi",
    cuisine: "Banarasi, Indian",
    rating: 4.6,
    priceRange: 1200,
    address: "Dashashwamedh Ghat, Varanasi",
    description: "Traditional Banarasi cuisine.",
    img: "https://images.unsplash.com/photo-1596040322539-96a4bded1e0b?w=400&h=300&fit=crop"
  },
  {
    name: "Amritsar Golden Temple Bhaji",
    city: "Amritsar",
    cuisine: "Punjabi, Indian",
    rating: 4.7,
    priceRange: 1300,
    address: "Hall Bazaar, Amritsar",
    description: "Authentic Punjabi cuisine near Golden Temple.",
    img: "https://images.unsplash.com/photo-1589985644111-d749e0c4e5b8?w=400&h=300&fit=crop"
  },
  {
    name: "Ooty Mountain Cafe",
    city: "Ooty",
    cuisine: "Continental, Cafe",
    rating: 4.5,
    priceRange: 2000,
    address: "Ooty Station Road, Ooty",
    description: "Scenic cafe with continental food.",
    img: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=300&fit=crop"
  }
];

module.exports = resturants