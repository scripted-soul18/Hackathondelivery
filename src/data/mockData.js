export const PRODUCTS = [
    { id: 1, barcode: "1111", name: "Organic Bananas", price: 1.20, weight: 0.8, aisle: "1", image: "https://images.unsplash.com/photo-1603833665858-e61d17a86279?auto=format&fit=crop&w=400" },
    { id: 2, barcode: "2222", name: "Whole Milk 1L", price: 2.50, weight: 1.0, aisle: "Dairy", image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=400" },
    { id: 3, barcode: "3333", name: "Sourdough Bread", price: 3.99, weight: 0.6, aisle: "Bakery", image: "https://images.unsplash.com/photo-1585478259715-876a6a81ae08?auto=format&fit=crop&w=400" },
    { id: 4, barcode: "4444", name: "Eggs (Dozen)", price: 4.50, weight: 0.7, aisle: "Dairy", image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=400" },
    { id: 5, barcode: "5555", name: "Chicken Breast 500g", price: 6.99, weight: 0.5, aisle: "Meat", image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=400" },
    { id: 6, barcode: "6666", name: "Pasta 1kg", price: 1.99, weight: 1.0, aisle: "3", image: "https://images.unsplash.com/photo-1551462147-37885acc36f1?auto=format&fit=crop&w=400" },
    { id: 7, barcode: "7777", name: "Tomato Sauce", price: 2.49, weight: 0.4, aisle: "3", image: "https://images.unsplash.com/photo-1626202158866-5e5899981440?auto=format&fit=crop&w=400" },
    { id: 8, barcode: "8888", name: "Cheddar Cheese", price: 5.50, weight: 0.3, aisle: "Dairy", image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=400" },
    { id: 9, barcode: "9999", name: "Apples (1kg)", price: 3.00, weight: 1.0, aisle: "1", image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400" },
    { id: 10, barcode: "1010", name: "Orange Juice", price: 3.50, weight: 1.1, aisle: "Beverages", image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=400" },
    { id: 11, barcode: "1212", name: "Chocolate Bar", price: 1.50, weight: 0.1, aisle: "Snacks", image: "https://images.unsplash.com/photo-1606312619070-d48b706521bf?auto=format&fit=crop&w=400" },
    { id: 12, barcode: "1313", name: "Potato Chips", price: 2.00, weight: 0.2, aisle: "Snacks", image: "https://images.unsplash.com/photo-1566478919030-261744529942?auto=format&fit=crop&w=400" },
    { id: 13, barcode: "1414", name: "Ground Coffee", price: 8.99, weight: 0.3, aisle: "Beverages", image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=400" },
    { id: 14, barcode: "1515", name: "Olive Oil", price: 7.50, weight: 0.9, aisle: "Condiments", image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400" },
    { id: 15, barcode: "1616", name: "Rice 2kg", price: 4.99, weight: 2.0, aisle: "Grains", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400" },
    { id: 16, barcode: "1717", name: "Yogurt Pack", price: 3.20, weight: 0.6, aisle: "Dairy", image: "https://images.unsplash.com/photo-1571212515416-f2b740516fc4?auto=format&fit=crop&w=400" },
    { id: 17, barcode: "1818", name: "Spinach", price: 1.99, weight: 0.2, aisle: "1", image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=400" },
    { id: 18, barcode: "1919", name: "Salmon Fillet", price: 9.99, weight: 0.4, aisle: "Seafood", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a3a1b78?auto=format&fit=crop&w=400" },
    { id: 19, barcode: "2020", name: "Avocado", price: 1.50, weight: 0.2, aisle: "1", image: "https://images.unsplash.com/photo-1523049673856-42848f51a55f?auto=format&fit=crop&w=400" },
    { id: 20, barcode: "2121", name: "Soap Bar", price: 0.99, weight: 0.1, aisle: "Household", image: "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&w=400" }
];

export const STORES = [
    { id: "1234", name: "SwiftCart Downtown", location: "123 Main St" },
    { id: "5678", name: "SwiftCart Westside", location: "456 West Ave" },
    { id: "9012", name: "SwiftCart Mall", location: "789 Mall Rd" },
    { id: "3456", name: "SwiftCart Express", location: "321 Station St" },
    { id: "7890", name: "SwiftCart Airport", location: "Terminal 1" }
];

export const LOCAL_SHOPS = [
    { id: 1, name: "Fresh Bakes", location: [51.505, -0.09], eta: "15-20 min" },
    { id: 2, name: "Green Grocers", location: [51.51, -0.1], eta: "10-15 min" },
    { id: 3, name: "City Pharmacy", location: [51.515, -0.09], eta: "5-10 min" },
    { id: 4, name: "Meat Market", location: [51.52, -0.12], eta: "20-25 min" },
    { id: 5, name: "Daily Needs", location: [51.50, -0.11], eta: "10-15 min" }
];

export const DELIVERY_ITEMS = PRODUCTS.map(p => ({ ...p, inStock: true }));
