import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, ShoppingBag, Store, ChevronRight, ArrowLeft, Check, Search } from 'lucide-react';
import { PRODUCTS, LOCAL_SHOPS } from '../data/mockData';

// Generate 30 delivery items
const DELIVERY_ITEMS = [
    ...PRODUCTS,
    { id: 21, name: "Butter", price: 2.50, weight: 0.2, image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400" },
    { id: 22, name: "Honey Jar", price: 4.99, weight: 0.5, image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400" },
    { id: 23, name: "Peanut Butter", price: 3.50, weight: 0.4, image: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=400" },
    { id: 24, name: "Cornflakes", price: 3.99, weight: 0.5, image: "https://images.unsplash.com/photo-1517456793572-1d8efd6dc135?auto=format&fit=crop&w=400" },
    { id: 25, name: "Mineral Water", price: 0.99, weight: 1.0, image: "https://images.unsplash.com/photo-1564419320461-6262a502fcb4?auto=format&fit=crop&w=400" },
    { id: 26, name: "Green Tea", price: 2.99, weight: 0.1, image: "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=400" },
    { id: 27, name: "Toothpaste", price: 1.99, weight: 0.1, image: "https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?auto=format&fit=crop&w=400" },
    { id: 28, name: "Shampoo", price: 4.50, weight: 0.3, image: "https://images.unsplash.com/photo-1585232351009-aa0817f9a64c?auto=format&fit=crop&w=400" },
    { id: 29, name: "Tissues", price: 1.50, weight: 0.1, image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=400" },
    { id: 30, name: "Soda Can", price: 1.00, weight: 0.3, image: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&w=400" },
];

const DirectDelivery = () => {
    const [cart, setCart] = useState({});
    const [selectedShop, setSelectedShop] = useState(null);
    const [step, setStep] = useState('items'); // 'items' | 'shop' | 'confirm'
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const addItem = (id) => {
        setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    };
    const removeItem = (id) => {
        setCart(prev => {
            const next = { ...prev };
            if (next[id] > 1) next[id]--;
            else delete next[id];
            return next;
        });
    };

    const cartItems = Object.entries(cart).map(([id, qty]) => ({
        ...DELIVERY_ITEMS.find(i => i.id === Number(id)),
        qty
    })).filter(i => i.name);

    const totalPrice = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
    const totalCount = cartItems.reduce((s, i) => s + i.qty, 0);

    const filteredItems = DELIVERY_ITEMS.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleOrder = () => {
        navigate('/tracking', { state: { shop: selectedShop, cartItems, totalPrice } });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-slate-100 px-4 py-3 sticky top-0 z-20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {step !== 'items' && (
                            <button onClick={() => setStep(step === 'confirm' ? 'shop' : 'items')} className="p-2 hover:bg-slate-50 rounded-xl">
                                <ArrowLeft size={20} />
                            </button>
                        )}
                        <div>
                            <h1 className="font-bold text-lg text-slate-900">Direct Delivery</h1>
                            <p className="text-xs text-slate-500">
                                {step === 'items' ? 'Select items' : step === 'shop' ? 'Choose a shop' : 'Review order'}
                            </p>
                        </div>
                    </div>
                    {totalCount > 0 && step === 'items' && (
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setStep('shop')}
                            className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-xl text-sm font-semibold shadow-lg shadow-secondary/20"
                        >
                            <ShoppingBag size={16} /> {totalCount} items
                        </motion.button>
                    )}
                </div>
            </div>

            {/* Items Grid */}
            {step === 'items' && (
                <>
                    {/* Search */}
                    <div className="px-4 pt-3">
                        <div className="relative">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search items..."
                                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="grid grid-cols-3 gap-3">
                            {filteredItems.map(item => (
                                <motion.div
                                    key={item.id}
                                    whileTap={{ scale: 0.97 }}
                                    className="bg-white rounded-xl overflow-hidden shadow-card"
                                >
                                    <div className="relative">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full aspect-square object-cover bg-slate-100"
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Item'; }}
                                        />
                                        {cart[item.id] && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute top-1 right-1 bg-secondary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                                            >
                                                {cart[item.id]}
                                            </motion.div>
                                        )}
                                    </div>
                                    <div className="p-2">
                                        <h4 className="text-xs font-semibold text-slate-900 truncate">{item.name}</h4>
                                        <p className="text-xs font-bold text-secondary mt-0.5">₹{item.price.toFixed(2)}</p>
                                        <div className="flex items-center justify-between mt-2">
                                            {cart[item.id] ? (
                                                <div className="flex items-center gap-1 w-full">
                                                    <button onClick={() => removeItem(item.id)} className="p-1 rounded bg-slate-100 hover:bg-red-50 text-slate-600"><Minus size={12} /></button>
                                                    <span className="flex-1 text-center text-xs font-bold">{cart[item.id]}</span>
                                                    <button onClick={() => addItem(item.id)} className="p-1 rounded bg-secondary/10 text-secondary"><Plus size={12} /></button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => addItem(item.id)}
                                                    className="w-full py-1.5 border border-secondary text-secondary rounded-lg text-xs font-semibold hover:bg-secondary/5"
                                                >
                                                    + Add
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* Shop Selection */}
            {step === 'shop' && (
                <div className="flex-1 p-4 space-y-3">
                    <h2 className="font-bold text-slate-900 mb-2">Choose a Local Shop</h2>
                    {LOCAL_SHOPS.map(shop => (
                        <motion.button
                            key={shop.id}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => { setSelectedShop(shop); setStep('confirm'); }}
                            className={`w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-card border-2 transition-colors ${selectedShop?.id === shop.id ? 'border-secondary' : 'border-transparent'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-secondary/10 rounded-xl">
                                    <Store size={20} className="text-secondary" />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-semibold text-slate-900">{shop.name}</h4>
                                    <p className="text-xs text-slate-500">ETA: {shop.eta}</p>
                                </div>
                            </div>
                            <ChevronRight size={18} className="text-slate-300" />
                        </motion.button>
                    ))}
                </div>
            )}

            {/* Order Confirmation */}
            {step === 'confirm' && selectedShop && (
                <div className="flex-1 p-4 space-y-4">
                    <div className="bg-white rounded-2xl p-5 shadow-card">
                        <h2 className="font-bold text-slate-900 mb-1">Order Summary</h2>
                        <p className="text-sm text-slate-500 mb-4">From <span className="font-semibold text-secondary">{selectedShop.name}</span></p>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span className="text-slate-600">{item.qty}× {item.name}</span>
                                    <span className="font-semibold">₹{(item.price * item.qty).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-slate-100 mt-4 pt-3 flex justify-between">
                            <span className="font-semibold text-slate-900">Total</span>
                            <span className="font-bold text-lg text-secondary">₹{totalPrice.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="bg-secondary/5 border border-secondary/20 rounded-2xl p-4 flex items-center gap-3">
                        <Check size={20} className="text-secondary" />
                        <div>
                            <p className="text-sm font-semibold text-slate-900">Estimated Delivery</p>
                            <p className="text-xs text-slate-500">{selectedShop.eta} · Zero Commission</p>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleOrder}
                        className="w-full py-4 bg-secondary text-white rounded-2xl font-semibold text-lg shadow-lg shadow-secondary/30 flex items-center justify-center gap-2"
                    >
                        Place Order · ₹{totalPrice.toFixed(2)}
                    </motion.button>
                </div>
            )}
        </div>
    );
};

export default DirectDelivery;
