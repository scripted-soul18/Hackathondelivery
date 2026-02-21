import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, ShoppingBag, Store, ChevronRight, ArrowLeft, Check, Search, X, MessageSquare, Star, Filter, SlidersHorizontal } from 'lucide-react';
import { PRODUCTS, LOCAL_SHOPS } from './data/mockData';

/* ─── Category definitions ─── */
const CATEGORIES = [
    { key: 'all', label: '🛒 All', color: 'bg-slate-100 text-slate-700' },
    { key: 'fruits', label: '🍎 Fruits', color: 'bg-red-50 text-red-600' },
    { key: 'dairy', label: '🥛 Dairy', color: 'bg-blue-50 text-blue-600' },
    { key: 'bakery', label: '🍞 Bakery', color: 'bg-amber-50 text-amber-700' },
    { key: 'meat', label: '🥩 Meat', color: 'bg-pink-50 text-pink-600' },
    { key: 'beverages', label: '🧃 Drinks', color: 'bg-orange-50 text-orange-600' },
    { key: 'snacks', label: '🍿 Snacks', color: 'bg-yellow-50 text-yellow-700' },
    { key: 'household', label: '🧹 Home', color: 'bg-green-50 text-green-700' },
];

/* ─── 30 delivery items with categories ─── */
const DELIVERY_ITEMS = [
    ...PRODUCTS.map(p => ({
        ...p,
        category: p.aisle === '1' ? 'fruits' : p.aisle === 'Dairy' ? 'dairy' : p.aisle === 'Bakery' ? 'bakery' : p.aisle === 'Meat' || p.aisle === 'Seafood' ? 'meat' : p.aisle === 'Beverages' ? 'beverages' : p.aisle === 'Snacks' ? 'snacks' : p.aisle === 'Household' ? 'household' : 'all',
        rating: (3.5 + Math.random() * 1.5).toFixed(1),
    })),
    { id: 21, name: "Butter", price: 2.50, weight: 0.2, category: 'dairy', rating: '4.3', image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400" },
    { id: 22, name: "Honey Jar", price: 4.99, weight: 0.5, category: 'all', rating: '4.7', image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400" },
    { id: 23, name: "Peanut Butter", price: 3.50, weight: 0.4, category: 'snacks', rating: '4.5', image: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=400" },
    { id: 24, name: "Cornflakes", price: 3.99, weight: 0.5, category: 'snacks', rating: '4.2', image: "https://images.unsplash.com/photo-1517456793572-1d8efd6dc135?auto=format&fit=crop&w=400" },
    { id: 25, name: "Mineral Water", price: 0.99, weight: 1.0, category: 'beverages', rating: '4.0', image: "https://images.unsplash.com/photo-1564419320461-6262a502fcb4?auto=format&fit=crop&w=400" },
    { id: 26, name: "Green Tea", price: 2.99, weight: 0.1, category: 'beverages', rating: '4.6', image: "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=400" },
    { id: 27, name: "Toothpaste", price: 1.99, weight: 0.1, category: 'household', rating: '4.1', image: "https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?auto=format&fit=crop&w=400" },
    { id: 28, name: "Shampoo", price: 4.50, weight: 0.3, category: 'household', rating: '4.4', image: "https://images.unsplash.com/photo-1585232351009-aa0817f9a64c?auto=format&fit=crop&w=400" },
    { id: 29, name: "Tissues", price: 1.50, weight: 0.1, category: 'household', rating: '3.9', image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=400" },
    { id: 30, name: "Soda Can", price: 1.00, weight: 0.3, category: 'beverages', rating: '4.2', image: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&w=400" },
];

const DirectDelivery = () => {
    const [cart, setCart] = useState({});         // { id: { qty, note } }
    const [selectedShop, setSelectedShop] = useState(null);
    const [step, setStep] = useState('items');    // 'items' | 'shop' | 'confirm'
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [editingNote, setEditingNote] = useState(null); // item id being edited
    const [noteText, setNoteText] = useState('');
    const navigate = useNavigate();

    /* ── Cart helpers ── */
    const addItem = (id) => {
        setCart(prev => ({
            ...prev,
            [id]: { qty: (prev[id]?.qty || 0) + 1, note: prev[id]?.note || '' }
        }));
    };

    const removeItem = (id) => {
        setCart(prev => {
            const next = { ...prev };
            if (next[id]?.qty > 1) {
                next[id] = { ...next[id], qty: next[id].qty - 1 };
            } else {
                delete next[id];
            }
            return next;
        });
    };

    const saveNote = (id) => {
        setCart(prev => ({
            ...prev,
            [id]: { ...prev[id], note: noteText }
        }));
        setEditingNote(null);
        setNoteText('');
    };

    const openNoteEditor = (id) => {
        setNoteText(cart[id]?.note || '');
        setEditingNote(id);
    };

    /* ── Derived state ── */
    const cartItems = Object.entries(cart).map(([id, data]) => ({
        ...DELIVERY_ITEMS.find(i => i.id === Number(id)),
        qty: data.qty,
        note: data.note,
    })).filter(i => i.name);

    const totalPrice = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
    const totalCount = cartItems.reduce((s, i) => s + i.qty, 0);

    const filteredItems = DELIVERY_ITEMS.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const handleOrder = () => {
        navigate('/tracking', { state: { shop: selectedShop, cartItems, totalPrice } });
    };

    return (
        <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
            {/* Blinkit-style header */}
            <header className="bg-[#18181b] text-white sticky top-0 z-20 shadow-md">
                <div className="px-4 py-3 flex items-center justify-between max-w-lg mx-auto">
                    <div className="flex items-center gap-2">
                        {step !== 'items' && (
                            <button onClick={() => setStep(step === 'confirm' ? 'shop' : 'items')} className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white">
                                <ArrowLeft size={20} />
                            </button>
                        )}
                        <div>
                            <h1 className="font-bold text-lg text-white">Direct Delivery</h1>
                            <p className="text-xs text-white/60">
                                {step === 'items' ? `${DELIVERY_ITEMS.length} items` : step === 'shop' ? 'Choose a shop' : 'Review order'}
                            </p>
                        </div>
                    </div>
                    {totalCount > 0 && step === 'items' && (
                        <motion.button
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setStep('shop')}
                            className="flex items-center gap-2 px-4 py-2.5 bg-[#facc15] text-[#18181b] rounded-xl text-sm font-bold shadow-lg"
                        >
                            <ShoppingBag size={16} />
                            <span>{totalCount}</span>
                            <span className="opacity-70">·</span>
                            <span>₹{totalPrice.toFixed(0)}</span>
                        </motion.button>
                    )}
                </div>
            </header>

            {/* ─────────────── ITEMS STEP ─────────────── */}
            {step === 'items' && (
                <>
                    {/* Search + Filters */}
                    <div className="px-4 pt-3 space-y-3 max-w-lg mx-auto">
                        <div className="relative">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search fruits, dairy, snacks..."
                                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#facc15]/30 focus:border-[#facc15] shadow-sm"
                            />
                            {search && (
                                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full">
                                    <X size={14} className="text-slate-400" />
                                </button>
                            )}
                        </div>

                        {/* Category chips */}
                        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.key}
                                    onClick={() => setActiveCategory(cat.key)}
                                    className={`flex-shrink-0 px-3.5 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${activeCategory === cat.key
                                            ? 'bg-[#18181b] text-white shadow-md'
                                            : cat.color + ' hover:opacity-80'
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="flex-1 overflow-y-auto p-4 max-w-lg mx-auto">
                        {filteredItems.length === 0 ? (
                            <div className="text-center py-16 text-slate-400">
                                <Search size={40} className="mx-auto mb-3 opacity-30" />
                                <p className="font-medium">No items found</p>
                                <p className="text-sm">Try a different search or category</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {filteredItems.map(item => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        whileTap={{ scale: 0.98 }}
                                        className="bg-white rounded-xl overflow-hidden shadow-card border border-slate-100 group"
                                    >
                                        <div className="relative">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full aspect-square object-cover bg-slate-100 group-hover:scale-105 transition-transform duration-500"
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=Item'; }}
                                            />
                                            {/* Rating badge */}
                                            <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-xs font-semibold text-slate-700 px-2 py-0.5 rounded-lg flex items-center gap-0.5 shadow-sm">
                                                <Star size={10} className="text-amber-400 fill-amber-400" /> {item.rating}
                                            </div>
                                            {/* Qty badge */}
                                            {cart[item.id] && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="absolute top-2 right-2 bg-[#facc15] text-[#18181b] w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-lg"
                                                >
                                                    {cart[item.id].qty}
                                                </motion.div>
                                            )}
                                            {/* Note indicator */}
                                            {cart[item.id]?.note && (
                                                <div className="absolute bottom-2 left-2 bg-[#18181b]/90 text-white text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1">
                                                    <MessageSquare size={8} /> Note
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-3">
                                            <h4 className="text-sm font-semibold text-slate-900 truncate">{item.name}</h4>
                                            <p className="text-xs text-slate-400 mt-0.5">{item.weight}kg</p>
                                            <div className="flex items-center justify-between mt-2.5">
                                                <p className="text-sm font-bold text-[#18181b]">₹{item.price.toFixed(2)}</p>
                                                {cart[item.id] ? (
                                                    <div className="flex items-center gap-1">
                                                        <button onClick={() => removeItem(item.id)} className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-500 flex items-center justify-center transition-colors"><Minus size={12} /></button>
                                                        <span className="w-6 text-center text-xs font-bold">{cart[item.id].qty}</span>
                                                        <button onClick={() => addItem(item.id)} className="w-7 h-7 rounded-lg bg-[#fef9c3] text-[#ca8a04] hover:bg-[#facc15] hover:text-[#18181b] flex items-center justify-center transition-colors"><Plus size={12} /></button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => addItem(item.id)}
                                                        className="px-3 py-1.5 border-2 border-[#18181b] text-[#18181b] rounded-lg text-xs font-bold hover:bg-[#18181b] hover:text-white transition-all"
                                                    >
                                                        + ADD
                                                    </button>
                                                )}
                                            </div>
                                            {/* Customize button (appears when item in cart) */}
                                            {cart[item.id] && (
                                                <motion.button
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    onClick={() => openNoteEditor(item.id)}
                                                    className="w-full mt-2 py-1.5 text-[10px] font-semibold text-[#18181b] bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center gap-1 transition-colors"
                                                >
                                                    <SlidersHorizontal size={10} />
                                                    {cart[item.id].note ? 'Edit Note' : 'Add Special Request'}
                                                </motion.button>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Note Editor Modal */}
                    <AnimatePresence>
                        {editingNote !== null && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
                                onClick={() => setEditingNote(null)}
                            >
                                <motion.div
                                    initial={{ y: 100, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 100, opacity: 0 }}
                                    onClick={e => e.stopPropagation()}
                                    className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-slate-900">Customize Item</h3>
                                        <button onClick={() => setEditingNote(null)} className="p-1 hover:bg-slate-100 rounded-lg">
                                            <X size={18} className="text-slate-400" />
                                        </button>
                                    </div>
                                    <p className="text-sm text-slate-500 mb-3">
                                        Add special requests for <span className="font-semibold text-slate-700">{DELIVERY_ITEMS.find(i => i.id === editingNote)?.name}</span>
                                    </p>
                                    {/* Quick tags */}
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {['No onion', 'Extra ripe', 'Low fat', 'Organic only', 'Small size', 'Fresh batch'].map(tag => (
                                            <button
                                                key={tag}
                                                onClick={() => setNoteText(prev => prev ? `${prev}, ${tag}` : tag)}
                                                className="px-3 py-1.5 bg-[#fef9c3] hover:bg-[#facc15]/30 text-[#ca8a04] text-xs font-medium rounded-full border border-[#facc15]/40 transition-colors"
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                    <textarea
                                        value={noteText}
                                        onChange={e => setNoteText(e.target.value)}
                                        placeholder="e.g., Pick the freshest batch, avoid bruised items..."
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#facc15]/30 focus:border-[#facc15] resize-none h-24"
                                    />
                                    <div className="flex gap-2 mt-4">
                                        <button
                                            onClick={() => { setNoteText(''); setEditingNote(null); }}
                                            className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600"
                                        >
                                            Cancel
                                        </button>
                                        <motion.button
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => saveNote(editingNote)}
                                            className="flex-1 py-3 bg-[#18181b] text-white rounded-xl text-sm font-semibold shadow-lg"
                                        >
                                            Save Note
                                        </motion.button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}

            {/* ─────────────── SHOP SELECTION ─────────────── */}
            {step === 'shop' && (
                <div className="flex-1 p-4 space-y-3 max-w-lg mx-auto">
                    <h2 className="font-bold text-slate-900 text-lg">Choose a Local Shop</h2>
                    <p className="text-sm text-slate-500 -mt-1">Zero commission, direct from the source</p>
                    {LOCAL_SHOPS.map((shop, idx) => (
                        <motion.button
                            key={shop.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.08 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => { setSelectedShop(shop); setStep('confirm'); }}
                            className="w-full flex items-center justify-between p-5 bg-white rounded-xl shadow-card border-2 border-transparent hover:border-[#facc15] transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3.5 bg-[#fef9c3] rounded-xl group-hover:bg-[#facc15] transition-all">
                                    <Store size={22} className="text-[#ca8a04] group-hover:text-[#18181b] transition-colors" />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-semibold text-slate-900">{shop.name}</h4>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-xs text-[#ca8a04] font-medium bg-[#fef9c3] px-2 py-0.5 rounded-full">ETA: {shop.eta}</span>
                                        <span className="text-[10px] text-slate-400">• Free delivery</span>
                                    </div>
                                </div>
                            </div>
                            <ChevronRight size={18} className="text-slate-300 group-hover:text-[#18181b] transition-colors" />
                        </motion.button>
                    ))}
                </div>
            )}

            {/* ─────────────── ORDER CONFIRMATION ─────────────── */}
            {step === 'confirm' && selectedShop && (
                <div className="flex-1 p-4 space-y-4 pb-8 max-w-lg mx-auto">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-5 shadow-card border border-slate-100">
                        <div className="flex items-center justify-between mb-1">
                            <h2 className="font-bold text-slate-900">Order Summary</h2>
                            <button onClick={() => setStep('items')} className="text-xs text-[#ca8a04] font-semibold">Edit Items</button>
                        </div>
                        <p className="text-sm text-slate-400 mb-4">From <span className="font-semibold text-[#18181b]">{selectedShop.name}</span></p>
                        <div className="space-y-3 max-h-56 overflow-y-auto">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex items-start gap-3">
                                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-slate-100" onError={(e) => { e.target.src = 'https://via.placeholder.com/48'; }} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-700 font-medium truncate">{item.qty}× {item.name}</span>
                                            <span className="font-semibold text-slate-900 ml-2 shrink-0">₹{(item.price * item.qty).toFixed(2)}</span>
                                        </div>
                                        {item.note && (
                                            <p className="text-[10px] text-[#ca8a04] bg-[#fef9c3] px-2 py-0.5 rounded mt-1 inline-block">
                                                📝 {item.note}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-dashed border-slate-200 mt-4 pt-3 space-y-1">
                            <div className="flex justify-between text-sm text-slate-500">
                                <span>Subtotal</span>
                                <span>₹{totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-500">
                                <span>Delivery Fee</span>
                                <span className="text-[#059669] font-medium">FREE</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-1">
                                <span className="text-slate-900">Total</span>
                                <span className="text-[#18181b]">₹{totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="bg-[#fef9c3] border border-[#facc15]/40 rounded-xl p-4 flex items-center gap-3"
                    >
                        <Check size={20} className="text-[#ca8a04] shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-slate-900">Estimated Delivery: {selectedShop.eta}</p>
                            <p className="text-xs text-slate-500">Zero commission · Direct from shop</p>
                        </div>
                    </motion.div>

                    <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleOrder}
                        className="w-full py-4 bg-[#facc15] text-[#18181b] rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 hover:bg-[#eab308] transition-colors"
                    >
                        Place Order · ₹{totalPrice.toFixed(2)}
                    </motion.button>
                </div>
            )}
        </div>
    );
};

export default DirectDelivery;
