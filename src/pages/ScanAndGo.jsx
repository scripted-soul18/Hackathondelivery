import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Keyboard, ShoppingCart, Plus, Minus, Trash2, ArrowRight, Package, Weight, DollarSign } from 'lucide-react';
import { PRODUCTS } from '../data/mockData';

const ScanAndGo = () => {
    const [cart, setCart] = useState([]);
    const [manualBarcode, setManualBarcode] = useState('');
    const [scanMode, setScanMode] = useState('simulate'); // 'camera' | 'simulate'
    const [lastScanned, setLastScanned] = useState(null);
    const [showManualInput, setShowManualInput] = useState(false);
    const navigate = useNavigate();

    const currentStore = JSON.parse(localStorage.getItem('currentStore') || '{}');

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const totalWeight = cart.reduce((sum, item) => sum + item.weight * item.qty, 0);
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === product.id);
            if (existing) {
                return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
            }
            return [...prev, { ...product, qty: 1 }];
        });
        setLastScanned(product);
        setTimeout(() => setLastScanned(null), 2000);
    };

    const updateQty = (id, delta) => {
        setCart(prev => {
            return prev
                .map(i => i.id === id ? { ...i, qty: i.qty + delta } : i)
                .filter(i => i.qty > 0);
        });
    };

    const handleManualScan = () => {
        const product = PRODUCTS.find(p => p.barcode === manualBarcode.trim());
        if (product) {
            addToCart(product);
            setManualBarcode('');
        } else {
            setLastScanned({ name: 'Not Found', error: true });
            setTimeout(() => setLastScanned(null), 2000);
        }
    };

    const handleSimulateScan = () => {
        const randomProduct = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
        addToCart(randomProduct);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-slate-100 px-4 py-3 sticky top-0 z-20">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-bold text-lg text-slate-900">Scan & Go</h1>
                        <p className="text-xs text-slate-500">{currentStore.name || 'Store'}</p>
                    </div>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/checkout', { state: { cart, totalPrice, totalWeight, totalItems } })}
                        disabled={cart.length === 0}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${cart.length > 0
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                    >
                        <ShoppingCart size={18} />
                        ₹{totalPrice.toFixed(2)}
                        {totalItems > 0 && (
                            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{totalItems}</span>
                        )}
                    </motion.button>
                </div>
            </div>

            {/* Scanner Area */}
            <div className="relative bg-slate-900 aspect-[4/3] max-h-[280px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10" />

                {/* Scan Overlay Frame */}
                <div className="relative z-10 w-56 h-40 border-2 border-white/30 rounded-2xl">
                    <div className="absolute -top-[2px] -left-[2px] w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-2xl" />
                    <div className="absolute -top-[2px] -right-[2px] w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-2xl" />
                    <div className="absolute -bottom-[2px] -left-[2px] w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-2xl" />
                    <div className="absolute -bottom-[2px] -right-[2px] w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-2xl" />

                    {/* Scanning line animation */}
                    <motion.div
                        animate={{ y: [0, 130, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="absolute left-2 right-2 h-0.5 bg-primary/60 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                    />
                </div>

                <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-3">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSimulateScan}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium shadow-lg"
                    >
                        <Camera size={16} /> Simulate Scan
                    </motion.button>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowManualInput(!showManualInput)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-xl text-sm font-medium border border-white/20"
                    >
                        <Keyboard size={16} /> Manual
                    </motion.button>
                </div>

                {/* Last scanned toast */}
                <AnimatePresence>
                    {lastScanned && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`absolute top-3 left-3 right-3 z-20 p-3 rounded-xl text-sm font-medium ${lastScanned.error
                                    ? 'bg-red-500/90 text-white'
                                    : 'bg-primary/90 text-white'
                                }`}
                        >
                            {lastScanned.error ? '❌ Product not found' : `✅ Added: ${lastScanned.name}`}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Manual Input */}
            <AnimatePresence>
                {showManualInput && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-white border-b border-slate-100 overflow-hidden"
                    >
                        <div className="p-4 flex gap-2">
                            <input
                                value={manualBarcode}
                                onChange={e => setManualBarcode(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleManualScan()}
                                placeholder="Enter barcode (e.g. 1111, 2222)"
                                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={handleManualScan}
                                className="px-4 py-3 bg-primary text-white rounded-xl text-sm font-semibold"
                            >
                                Add
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Stats Bar */}
            <div className="bg-white border-b border-slate-100 px-4 py-3 grid grid-cols-3 gap-3">
                {[
                    { icon: Package, label: 'Items', value: totalItems, color: 'text-blue-500 bg-blue-50' },
                    { icon: DollarSign, label: 'Total', value: `₹${totalPrice.toFixed(2)}`, color: 'text-primary bg-primary/10' },
                    { icon: Weight, label: 'Weight', value: `${totalWeight.toFixed(1)} kg`, color: 'text-amber-500 bg-amber-50' },
                ].map(({ icon: Icon, label, value, color }) => (
                    <div key={label} className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${color}`}>
                            <Icon size={14} />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase">{label}</p>
                            <p className="text-sm font-bold text-slate-900">{value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                        <ShoppingCart size={48} className="mb-3 opacity-30" />
                        <p className="font-medium">Your cart is empty</p>
                        <p className="text-sm">Scan or simulate a product to start</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {cart.map(item => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-white rounded-xl p-3 flex items-center gap-3 shadow-card"
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-14 h-14 rounded-xl object-cover bg-slate-100"
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/56?text=?'; }}
                                />
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm text-slate-900 truncate">{item.name}</h4>
                                    <p className="text-xs text-slate-400">Aisle {item.aisle} · {item.weight}kg</p>
                                    <p className="text-sm font-bold text-primary">₹{(item.price * item.qty).toFixed(2)}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => updateQty(item.id, -1)}
                                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-500 transition-colors"
                                    >
                                        {item.qty === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                                    </motion.button>
                                    <span className="w-8 text-center text-sm font-bold">{item.qty}</span>
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => updateQty(item.id, 1)}
                                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-primary/10 hover:text-primary transition-colors"
                                    >
                                        <Plus size={14} />
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {/* Checkout Bar */}
            {cart.length > 0 && (
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    className="sticky bottom-0 bg-white border-t border-slate-100 p-4"
                >
                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/checkout', { state: { cart, totalPrice, totalWeight, totalItems } })}
                        className="w-full py-4 bg-primary text-white rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/30"
                    >
                        Proceed to Checkout <ArrowRight size={20} />
                    </motion.button>
                </motion.div>
            )}
        </div>
    );
};

export default ScanAndGo;
