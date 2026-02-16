import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle2, CreditCard, ArrowLeft, Weight, Package, DollarSign, Receipt, Download, Clock, Store as StoreIcon, Hash, Calendar, MapPin } from 'lucide-react';
import QRCode from 'react-qr-code';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { cart = [], totalPrice = 0, totalWeight = 0, totalItems = 0 } = location.state || {};

    const [step, setStep] = useState('review'); // review | security | payment | success
    const [weightStatus, setWeightStatus] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('upi');
    const [showBill, setShowBill] = useState(false);

    const storeName = JSON.parse(localStorage.getItem('currentStore') || '{}').name || 'SwiftCart Store';

    // Generate transaction details
    const txnId = `TXN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const orderNo = `#SC-${Math.floor(1000 + Math.random() * 9000)}`;
    const taxRate = 0.05;
    const subtotal = totalPrice;
    const tax = subtotal * taxRate;
    const grandTotal = subtotal + tax;
    const timestamp = new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });

    const qrData = JSON.stringify({
        transactionId: txnId,
        order: orderNo,
        totalWeight: totalWeight.toFixed(2),
        totalItems,
        grandTotal: grandTotal.toFixed(2),
        timestamp: new Date().toISOString(),
        store: storeName,
    });

    const runWeightCheck = () => {
        setStep('security');
        setTimeout(() => {
            const measured = totalWeight * (0.9 + Math.random() * 0.2);
            const discrepancy = Math.abs(measured - totalWeight) / totalWeight;
            setWeightStatus(discrepancy > 0.15 ? 'flag' : 'pass');
        }, 2500);
    };

    const handlePayment = () => {
        setStep('payment');
        setTimeout(() => {
            setStep('success');
            // Auto-show bill after a brief moment
            setTimeout(() => setShowBill(true), 800);
        }, 2500);
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-white p-6">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package size={32} className="text-slate-400" />
                    </div>
                    <p className="text-slate-600 font-medium mb-1">No items in cart</p>
                    <p className="text-sm text-slate-400 mb-6">Add items before checking out</p>
                    <button onClick={() => navigate('/scan')} className="px-8 py-3 bg-primary text-white rounded-2xl font-semibold shadow-lg shadow-primary/20 hover:shadow-xl transition-shadow">
                        Go to Scanner
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-slate-100/50 px-4 py-3 sticky top-0 z-20">
                <div className="flex items-center gap-3 max-w-lg mx-auto">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                        <ArrowLeft size={20} className="text-slate-600" />
                    </button>
                    <div>
                        <h1 className="font-bold text-lg text-slate-900">Checkout</h1>
                        <p className="text-xs text-slate-400">{storeName}</p>
                    </div>
                </div>
            </div>

            <div className="p-4 max-w-lg mx-auto space-y-4 pb-8">
                {/* Order Summary Card */}
                <motion.div layout className="bg-white rounded-2xl p-5 shadow-card border border-slate-100/50">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-slate-900">Order Summary</h2>
                        <span className="text-xs font-medium text-primary bg-primary-50 px-3 py-1 rounded-full">{totalItems} items</span>
                    </div>
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                        {cart.map(item => (
                            <div key={item.id} className="flex items-center justify-between text-sm group">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/40?text=?'; }}
                                    />
                                    <div>
                                        <span className="text-slate-700 font-medium">{item.name}</span>
                                        <p className="text-xs text-slate-400">×{item.qty} · {item.weight}kg ea</p>
                                    </div>
                                </div>
                                <span className="font-semibold text-slate-900">₹{(item.price * item.qty).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    {/* Price breakdown */}
                    <div className="border-t border-dashed border-slate-200 mt-4 pt-3 space-y-2">
                        <div className="flex justify-between text-sm text-slate-500">
                            <span>Subtotal</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-500">
                            <span>Tax (5% GST)</span>
                            <span>₹{tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-500">
                            <span>Bag weight</span>
                            <span>{totalWeight.toFixed(1)} kg</span>
                        </div>
                        <div className="border-t border-slate-100 pt-2 flex justify-between font-bold text-lg">
                            <span className="text-slate-900">Total</span>
                            <span className="text-primary">₹{grandTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </motion.div>

                {/* ---------- STEP: REVIEW ---------- */}
                {step === 'review' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                        {/* Payment method selection */}
                        <div className="bg-white rounded-2xl p-5 shadow-card border border-slate-100/50">
                            <h3 className="font-semibold text-slate-900 mb-3 text-sm">Payment Method</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { key: 'upi', label: 'UPI', emoji: '📱' },
                                    { key: 'card', label: 'Card', emoji: '💳' },
                                    { key: 'wallet', label: 'Wallet', emoji: '👛' },
                                ].map(m => (
                                    <button
                                        key={m.key}
                                        onClick={() => setPaymentMethod(m.key)}
                                        className={`p-3 rounded-xl text-center transition-all text-sm font-medium ${paymentMethod === m.key
                                                ? 'bg-primary-50 border-2 border-primary text-primary shadow-sm'
                                                : 'bg-slate-50 border-2 border-transparent text-slate-600 hover:bg-slate-100'
                                            }`}
                                    >
                                        <span className="text-lg block mb-1">{m.emoji}</span>
                                        {m.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={runWeightCheck}
                            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25"
                        >
                            <Shield size={20} /> Run Security Check
                        </motion.button>
                    </motion.div>
                )}

                {/* ---------- STEP: SECURITY ---------- */}
                {step === 'security' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl p-6 shadow-card border border-slate-100/50">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Shield size={18} className="text-amber-500" /> Weight Verification
                        </h3>
                        <AnimatePresence mode="wait">
                            {weightStatus === null ? (
                                <motion.div key="loading" exit={{ opacity: 0 }} className="flex flex-col items-center py-10">
                                    <div className="relative">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                                            className="w-16 h-16 border-4 border-slate-100 border-t-amber-500 rounded-full"
                                        />
                                        <Weight size={20} className="absolute inset-0 m-auto text-amber-500" />
                                    </div>
                                    <p className="text-sm text-slate-500 mt-4 font-medium">Verifying bag weight...</p>
                                    <p className="text-xs text-slate-400 mt-1">Expected: {totalWeight.toFixed(1)} kg</p>
                                </motion.div>
                            ) : weightStatus === 'pass' ? (
                                <motion.div key="pass" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-6">
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10 }}>
                                        <CheckCircle2 size={56} className="mx-auto text-primary" />
                                    </motion.div>
                                    <p className="font-bold text-primary text-lg mt-3">Weight Check Passed ✓</p>
                                    <p className="text-sm text-slate-500 mt-1">All {totalItems} items accounted for</p>
                                    <motion.button
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handlePayment}
                                        className="w-full mt-6 py-4 bg-gradient-to-r from-primary to-emerald-500 text-white rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 shadow-xl shadow-primary/25"
                                    >
                                        <CreditCard size={20} /> Pay ₹{grandTotal.toFixed(2)}
                                    </motion.button>
                                </motion.div>
                            ) : (
                                <motion.div key="flag" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-6">
                                    <AlertTriangle size={56} className="mx-auto text-amber-500" />
                                    <p className="font-bold text-amber-600 text-lg mt-3">Weight Discrepancy</p>
                                    <p className="text-sm text-slate-500 mt-1">Flagged for manual review at exit</p>
                                    <div className="flex gap-2 mt-6">
                                        <button
                                            onClick={() => { setWeightStatus(null); runWeightCheck(); }}
                                            className="flex-1 py-3 border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                        >
                                            Retry Check
                                        </button>
                                        <motion.button
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handlePayment}
                                            className="flex-1 py-3 bg-amber-500 text-white rounded-xl text-sm font-semibold shadow-lg"
                                        >
                                            Proceed Anyway
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* ---------- STEP: PAYMENT ---------- */}
                {step === 'payment' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-16">
                        <div className="relative">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                                className="w-20 h-20 border-4 border-primary-100 border-t-primary rounded-full"
                            />
                            <CreditCard size={24} className="absolute inset-0 m-auto text-primary" />
                        </div>
                        <p className="font-bold text-slate-900 text-lg mt-6">Processing Payment...</p>
                        <p className="text-sm text-slate-500 mt-1">₹{grandTotal.toFixed(2)} via {paymentMethod.toUpperCase()}</p>
                        <div className="flex gap-1 mt-4">
                            {[0, 1, 2].map(i => (
                                <motion.div
                                    key={i}
                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                    transition={{ duration: 1, delay: i * 0.3, repeat: Infinity }}
                                    className="w-2 h-2 rounded-full bg-primary"
                                />
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* ---------- STEP: SUCCESS + REAL-TIME BILL ---------- */}
                {step === 'success' && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
                        {/* Success header */}
                        <div className="bg-gradient-to-br from-primary-500 to-emerald-500 rounded-2xl p-6 text-white text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-12 -mt-12" />
                            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full -ml-6 -mb-6" />
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', damping: 8, delay: 0.2 }}
                                className="relative z-10"
                            >
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-3">
                                    <CheckCircle2 size={36} />
                                </div>
                                <h2 className="text-2xl font-bold">Payment Successful!</h2>
                                <p className="text-white/80 text-sm mt-1">Show QR at exit gate</p>
                            </motion.div>
                        </div>

                        {/* QR Code */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl p-6 shadow-card border border-slate-100/50 text-center"
                        >
                            <p className="text-xs text-slate-400 mb-3 font-medium uppercase tracking-wider">Exit Pass</p>
                            <div className="inline-block p-4 bg-gradient-to-br from-slate-50 to-white rounded-2xl border-2 border-dashed border-slate-200">
                                <QRCode value={qrData} size={160} level="H" />
                            </div>
                            <p className="text-[10px] text-slate-400 mt-3 font-mono">{txnId}</p>
                        </motion.div>

                        {/* ─── REAL-TIME BILL / INVOICE ─── */}
                        <AnimatePresence>
                            {showBill && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100/50 overflow-hidden">
                                        {/* Bill header */}
                                        <div className="bg-slate-900 text-white p-5">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Receipt size={18} />
                                                    <span className="font-bold text-lg">Invoice</span>
                                                </div>
                                                <span className="text-xs bg-primary/20 text-primary-300 px-3 py-1 rounded-full font-medium">PAID</span>
                                            </div>
                                        </div>

                                        <div className="p-5 space-y-4">
                                            {/* Bill meta */}
                                            <div className="grid grid-cols-2 gap-3 text-xs">
                                                <div className="flex items-start gap-2">
                                                    <Hash size={12} className="text-slate-400 mt-0.5 shrink-0" />
                                                    <div>
                                                        <p className="text-slate-400">Order No</p>
                                                        <p className="font-semibold text-slate-900">{orderNo}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <Calendar size={12} className="text-slate-400 mt-0.5 shrink-0" />
                                                    <div>
                                                        <p className="text-slate-400">Date</p>
                                                        <p className="font-semibold text-slate-900">{timestamp}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <StoreIcon size={12} className="text-slate-400 mt-0.5 shrink-0" />
                                                    <div>
                                                        <p className="text-slate-400">Store</p>
                                                        <p className="font-semibold text-slate-900">{storeName}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <CreditCard size={12} className="text-slate-400 mt-0.5 shrink-0" />
                                                    <div>
                                                        <p className="text-slate-400">Payment</p>
                                                        <p className="font-semibold text-slate-900">{paymentMethod.toUpperCase()}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Itemized list */}
                                            <div>
                                                <div className="grid grid-cols-12 text-[10px] text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100 pb-2 mb-2">
                                                    <span className="col-span-5">Item</span>
                                                    <span className="col-span-2 text-center">Qty</span>
                                                    <span className="col-span-2 text-right">Rate</span>
                                                    <span className="col-span-3 text-right">Amount</span>
                                                </div>
                                                {cart.map((item, idx) => (
                                                    <motion.div
                                                        key={item.id}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.05 * idx }}
                                                        className="grid grid-cols-12 text-xs py-1.5 border-b border-slate-50 last:border-0"
                                                    >
                                                        <span className="col-span-5 text-slate-700 font-medium truncate">{item.name}</span>
                                                        <span className="col-span-2 text-center text-slate-500">{item.qty}</span>
                                                        <span className="col-span-2 text-right text-slate-500">₹{item.price.toFixed(2)}</span>
                                                        <span className="col-span-3 text-right font-semibold text-slate-900">₹{(item.price * item.qty).toFixed(2)}</span>
                                                    </motion.div>
                                                ))}
                                            </div>

                                            {/* Totals */}
                                            <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                                                <div className="flex justify-between text-sm text-slate-500">
                                                    <span>Subtotal ({totalItems} items)</span>
                                                    <span>₹{subtotal.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm text-slate-500">
                                                    <span>GST (5%)</span>
                                                    <span>₹{tax.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm text-slate-500">
                                                    <span>Total Weight</span>
                                                    <span>{totalWeight.toFixed(1)} kg</span>
                                                </div>
                                                <div className="border-t border-slate-200 pt-2 mt-1 flex justify-between">
                                                    <span className="font-bold text-slate-900 text-lg">Grand Total</span>
                                                    <span className="font-bold text-primary text-lg">₹{grandTotal.toFixed(2)}</span>
                                                </div>
                                            </div>

                                            {/* Transaction ID */}
                                            <div className="text-center">
                                                <p className="text-[10px] text-slate-400 font-mono">Transaction: {txnId}</p>
                                                <p className="text-[10px] text-slate-400">Thank you for shopping with SwiftCart!</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Toggle bill button */}
                        <button
                            onClick={() => setShowBill(!showBill)}
                            className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
                        >
                            <Receipt size={16} /> {showBill ? 'Hide Bill' : 'View Full Bill'}
                        </button>

                        <button
                            onClick={() => navigate('/')}
                            className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-200 transition-colors"
                        >
                            Back to Home
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Checkout;
