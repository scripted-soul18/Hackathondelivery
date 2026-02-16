import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, MapPin, ArrowRight, AlertCircle } from 'lucide-react';
import { STORES } from '../data/mockData';

const StoreEntry = () => {
    const [storeId, setStoreId] = useState('');
    const [error, setError] = useState('');
    const [validatedStore, setValidatedStore] = useState(null);
    const navigate = useNavigate();

    const handleDigitInput = (digit) => {
        if (storeId.length < 4) {
            const newId = storeId + digit;
            setStoreId(newId);
            setError('');
            if (newId.length === 4) {
                const found = STORES.find(s => s.id === newId);
                if (found) {
                    setValidatedStore(found);
                } else {
                    setError('Store not found. Try: 1234, 5678, 9012');
                }
            }
        }
    };

    const handleBackspace = () => {
        setStoreId(storeId.slice(0, -1));
        setError('');
        setValidatedStore(null);
    };

    const handleContinue = () => {
        if (validatedStore) {
            localStorage.setItem('currentStore', JSON.stringify(validatedStore));
            navigate('/scan');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm"
            >
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex p-4 bg-primary/10 rounded-2xl mb-4">
                        <Store className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Enter Store ID</h1>
                    <p className="text-slate-500 mt-1">Enter the 4-digit code displayed at the entrance</p>
                </div>

                {/* PIN Display */}
                <div className="flex justify-center gap-3 mb-6">
                    {[0, 1, 2, 3].map(i => (
                        <motion.div
                            key={i}
                            animate={storeId[i] ? { scale: [1, 1.1, 1] } : {}}
                            className={`w-14 h-16 rounded-xl border-2 flex items-center justify-center text-2xl font-bold transition-colors ${storeId[i]
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'border-slate-200 bg-white text-slate-300'
                                }`}
                        >
                            {storeId[i] || '•'}
                        </motion.div>
                    ))}
                </div>

                {/* Error */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2 text-red-500 text-sm mb-4 justify-center"
                        >
                            <AlertCircle size={16} /> {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Validated store info */}
                <AnimatePresence>
                    {validatedStore && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-primary/5 border border-primary/20 rounded-2xl p-4 mb-6"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-xl">
                                    <MapPin className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">{validatedStore.name}</h3>
                                    <p className="text-sm text-slate-500">{validatedStore.location}</p>
                                </div>
                            </div>
                            <p className="text-xs text-primary mt-3 font-medium">
                                💡 Find items in Aisle 3 — Check product cards for exact locations
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Keypad */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'del'].map((key, i) => (
                        <motion.button
                            key={i}
                            whileTap={{ scale: 0.92 }}
                            onClick={() => {
                                if (key === 'del') handleBackspace();
                                else if (key !== null) handleDigitInput(String(key));
                            }}
                            disabled={key === null}
                            className={`h-14 rounded-xl text-lg font-semibold transition-colors ${key === null
                                    ? 'invisible'
                                    : key === 'del'
                                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 active:bg-slate-300'
                                        : 'bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 active:bg-slate-100 shadow-sm'
                                }`}
                        >
                            {key === 'del' ? '⌫' : key}
                        </motion.button>
                    ))}
                </div>

                {/* Continue */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleContinue}
                    disabled={!validatedStore}
                    className={`w-full py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 transition-all ${validatedStore
                            ? 'bg-primary text-white shadow-lg shadow-primary/30'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                >
                    Start Shopping <ArrowRight size={20} />
                </motion.button>

                <p className="text-center text-xs text-slate-400 mt-6">
                    Demo IDs: 1234 · 5678 · 9012 · 3456 · 7890
                </p>
            </motion.div>
        </div>
    );
};

export default StoreEntry;
